//package com.hachionUserDashboard.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.hachionUserDashboard.dto.CertificateRequest;
//import com.hachionUserDashboard.entity.CertificateEntity;
//import com.hachionUserDashboard.repository.CertificateRepository;
//
//import Service.CertificateService;
//
//@Service
//public class Certificateimp implements CertificateService {
//	
//	@Autowired
//	private CertificateRepository certificateRepository;
//	
//
//	
//	 public CertificateEntity generateCertificate(CertificateRequest request) {
//	        // Save data
//	        CertificateEntity entity = new CertificateEntity();
//	        entity.setStudentId(request.getStudentId());
//	        entity.setStudentName(request.getStudentName());
//	        entity.setStudentEmail(request.getStudentEmail());
//	        entity.setCourseName(request.getCourseName());
//	        entity.setCompletionDate(request.getCompletionDate());
//	        entity.setStatus(request.getStatus());
//
//	        // We'll fill this after generating the PDF
//	        entity.setCertificatePath("To be updated");
//
//	        return certificateRepository.save(entity);
//	    }
//
//	 public void updateCertificatePath(Long certificateId, String path) {
//		    CertificateEntity entity = certificateRepository.findByCertificateId(certificateId);
//		    entity.setCertificatePath(path);
//		    certificateRepository.save(entity);
//		}
//}
package com.hachionUserDashboard.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.CertificateRequest;
import com.hachionUserDashboard.entity.CertificateEntity;
import com.hachionUserDashboard.repository.CertificateDetailsRepository;

import Service.CertificateService;
import jakarta.mail.MessagingException;

@Service
public class Certificateimp implements CertificateService {

	@Autowired
	private CertificateDetailsRepository certificateRepository;
	
	@Autowired
	private EmailService emailService;

	@Value("${certificate.base-path}")
	private String certificateBasePath;

	@Override
	public CertificateEntity generateCertificate(CertificateRequest request) {

		 Optional<CertificateEntity> existingEntity = certificateRepository
			        .findByStudentIdAndCourseNameAndCompletionDate(
			            request.getStudentId(),
			            request.getCourseName(),
			            request.getCompletionDate()
			        );

			    
			    if (existingEntity.isPresent()) {
			        System.out.println("Certificate record already exists for studentId: " + request.getStudentId());
			        return existingEntity.get();
			    }
		
			    String path = generateCertificatePdf(request.getStudentName(), request.getStudentId(), request.getCourseName(),
						request.getCompletionDate());
			    
			    if (path == null) {
			        throw new RuntimeException("PDF generation failed. Certificate will not be saved.");
			    }
			    
		CertificateEntity entity = new CertificateEntity();
		entity.setStudentId(request.getStudentId());
		entity.setStudentName(request.getStudentName());
		entity.setStudentEmail(request.getStudentEmail());
		entity.setCourseName(request.getCourseName());
		entity.setCompletionDate(request.getCompletionDate());
		entity.setStatus(request.getStatus());

		entity = certificateRepository.save(entity);

		entity.setCertificatePath(path);
		certificateRepository.save(entity);

		return entity;
	}

	public String generateCertificatePdf(String studentName, String studentId, String courseName,
			String completionDate) {
//		String folderPath = "certificates";
//		String outputPdfPath = folderPath + "/" + studentId + "_" + courseName.replaceAll("\\s+", "_") + "_" + completionDate.replaceAll("[-/]", "_") + "_Certificate.pdf";
//		String inputPdfPath = "src/main/resources/templates/Hachion's CertificateFinal.pdf";

		String folderPath = certificateBasePath;
		String outputPdfPath = folderPath + studentId + "_" + courseName.replaceAll("\\s+", "_") + "_" + completionDate.replaceAll("[-/]", "_") + "_Certificate.pdf";
		String inputPdfPath = folderPath + "Hachion's CertificateFinal.pdf";

		try {
			File folder = new File(folderPath);
			if (!folder.exists()) {
				folder.mkdirs();
			}
			 File outputFile = new File(outputPdfPath);
		        if (outputFile.exists()) {
		            System.out.println("Certificate already exists for studentId " + studentId + " and course " + courseName);
		            return outputPdfPath;
		        }

			PDDocument document = PDDocument.load(new File(inputPdfPath));
			document.setAllSecurityToBeRemoved(true);
			PDPage page = document.getPage(0);
			PDRectangle mediaBox = page.getMediaBox();
			float pageWidth = mediaBox.getWidth();
			float pageHeight = mediaBox.getHeight();
			System.out.println("Landscape page size: " + pageWidth + " x " + pageHeight);

			PDPageContentStream contentStream = new PDPageContentStream(document, page,
					PDPageContentStream.AppendMode.APPEND, true);

			PDFont fontBold = PDType1Font.HELVETICA_BOLD;
			PDFont fontItalic = PDType1Font.HELVETICA_OBLIQUE;
			PDFont fontBoldForCourseName = PDType1Font.TIMES_BOLD;

			int nameFontSize = 46;
			int studentIdFontSize = 14;
			int courseFontSize = 45;
			int dateFontSize = 14;

			float nameWidth = fontBold.getStringWidth(studentName) / 1000 * nameFontSize;
			float courseWidth = fontBoldForCourseName.getStringWidth(courseName) / 1000 * courseFontSize;

			contentStream.beginText();
			contentStream.setFont(fontBold, nameFontSize);
			contentStream.setNonStrokingColor(0.055f, 0.286f, 0.659f);
			contentStream.newLineAtOffset((pageWidth - nameWidth) / 2, pageHeight - 170);
			contentStream.showText(studentName);
			contentStream.endText();

			String studentIdText = "STUDENTID : " + studentId;
			float studentIdWidth = fontBold.getStringWidth(studentIdText) / 1000 * studentIdFontSize;

			contentStream.beginText();
			contentStream.setFont(fontBold, studentIdFontSize);
			contentStream.newLineAtOffset((pageWidth - studentIdWidth) / 2, pageHeight - 210);
			contentStream.showText(studentIdText);
			contentStream.endText();

			contentStream.beginText();
			contentStream.setFont(fontBoldForCourseName, courseFontSize);
			contentStream.setNonStrokingColor(0.055f, 0.286f, 0.659f);
			contentStream.newLineAtOffset((pageWidth - courseWidth) / 2, pageHeight / 2 - 15);
			contentStream.showText(courseName);
			contentStream.endText();

			LocalDate date = LocalDate.parse(completionDate);
			String formattedDate = date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
			contentStream.beginText();
			contentStream.setFont(fontItalic, dateFontSize);
			contentStream.newLineAtOffset(100, 140);
			contentStream.showText(formattedDate);
			contentStream.endText();

			contentStream.close();
			document.save(outputPdfPath);
			document.close();

			return outputPdfPath;

		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	 public void sendCertificateByEmail(Long certificateId) throws IOException, MessagingException {
        CertificateEntity certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        String email = certificate.getStudentEmail();
        String filePath = certificate.getCertificatePath(); 

        byte[] pdfBytes = Files.readAllBytes(Paths.get(filePath));

        emailService.sendEmailWithAttachment(email, pdfBytes, "Your Course Certificate", "Please find attached your certificate.");
    }
	@Override
    public List<CertificateEntity> getAllCertificates() {
        return certificateRepository.findAll();
    }

	@Override
	public String getUserById(Long certificateId) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<CertificateEntity> getCertificatesByStudentName(String studentName) {
	    List<CertificateEntity> list = certificateRepository.findByStudentNameNative(studentName);
	    return list != null ? list : new ArrayList<>();
	}
//	private String generateCertificatePdf(String studentName, String studentId, String courseName, String completionDate) {
//	    String folderPath = "certificates";
//	    String outputPdfPath = folderPath + "/" + studentId + "_Certificat	e.pdf";
//	    String inputPdfPath = "src/main/resources/templates/Hachion's CertificateFinal.pdf";
//
//	    try {
//	        // Ensure folder exists
//	        File folder = new File(folderPath);
//	        if (!folder.exists()) {
//	            folder.mkdirs();
//	            System.out.println("✅ 'certificates' folder created.");
//	        }
//
//	        // Load the template PDF
//	        PDDocument document = PDDocument.load(new File(inputPdfPath));
//	        document.setAllSecurityToBeRemoved(true);
//	        PDPage page = document.getPage(0);
//	        PDRectangle mediaBox = page.getMediaBox(); // Get dimensions
//	        float pageWidth = mediaBox.getWidth();
//	        float pageHeight = mediaBox.getHeight();
//	        System.out.println("Landscape page size: " + pageWidth + " x " + pageHeight);
//
//	        // Create content stream
//	        PDPageContentStream contentStream = new PDPageContentStream(document, page,
//	                PDPageContentStream.AppendMode.APPEND, true);
//
//	        // Load custom fonts from Windows Fonts directory
//	        String fontPathBold = "C:\\Windows\\Fonts\\Agency FB.ttf";  // Bold font
//	        String fontPathRegular = "C:\\Windows\\Fonts\\Agency FB.ttf";    // Regular font
//	        String fontPathItalic = "C:\\Windows\\Fonts\\Agency FB.ttf"; // Italic font
//
//	        PDFont fontBold = PDType0Font.load(document, new File(fontPathBold));
//	        PDFont fontRegular = PDType0Font.load(document, new File(fontPathRegular));
//	        PDFont fontItalic = PDType0Font.load(document, new File(fontPathItalic));
//	        
//	        
//
//	        // Font sizes
//	        int nameFontSize = 46;
//	        int courseFontSize = 18;
//	        int studentIdFontSize = 14;
//	        int dateFontSize = 14;
//
//	        // Measure width for centering
//	        float nameWidth = fontBold.getStringWidth(studentName) / 1000 * nameFontSize;
//	        float courseWidth = fontRegular.getStringWidth(courseName) / 1000 * courseFontSize;
//
//	        // Add Student Name (Center)
//	        contentStream.beginText();
//	        contentStream.setFont(fontBold, nameFontSize);
//	        contentStream.setNonStrokingColor(0.055f, 0.286f, 0.659f); // Blue color
//	        contentStream.newLineAtOffset((pageWidth - nameWidth) / 2, pageHeight - 170);
//	        contentStream.showText(studentName);
//	        contentStream.endText();
//
//	        // Add Student ID
//	        contentStream.beginText();
//	        contentStream.setFont(fontBold, studentIdFontSize);
//	        contentStream.setNonStrokingColor(0.055f, 0.286f, 0.659f); // Blue color
//	        contentStream.newLineAtOffset(pageWidth / 2 - 60, pageHeight - 210);
//	        contentStream.showText("STUDENTID : " + studentId);
//	        contentStream.endText();
//
//	        // Add Course Name (Center)
//	        contentStream.beginText();
//	        contentStream.setFont(fontRegular, courseFontSize);
//	        contentStream.setNonStrokingColor(0.055f, 0.286f, 0.659f); // Blue color
//	        contentStream.newLineAtOffset((pageWidth - courseWidth) / 2, pageHeight / 2 - 10);
//	        contentStream.showText(courseName);
//	        contentStream.endText();
//
//	        // Format Completion Date
//	        LocalDate date = LocalDate.parse(completionDate);
//	        String formattedDate = date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
//	        
//	        // Add Completion Date
//	        contentStream.beginText();
//	        contentStream.setFont(fontItalic, dateFontSize);
//	        contentStream.setNonStrokingColor(0.055f, 0.286f, 0.659f); // Blue color
//	        contentStream.newLineAtOffset(100, 140);
//	        contentStream.showText(formattedDate);
//	        contentStream.endText();
//
//	        // Finalize the content stream and save the document
//	        contentStream.close();
//	        document.save(outputPdfPath);
//	        document.close();
//
//	        System.out.println("✅ Certificate PDF saved successfully at: " + outputPdfPath);
//	        return outputPdfPath;
//
//	    } catch (IOException e) {
//	        e.printStackTrace();
//	        return null;
//	    }
//	}

	
	public List<CertificateEntity> findByStudentNameIgnoreCase(String studentName) {
		// TODO Auto-generated method stub
		return null;
	}

//	private String generateCertificatePdf(String studentName, String studentId, String courseName, String completionDate) {
//	    String folderPath = "certificates";
//	    String outputPdfPath = folderPath + "/" + studentId + "_Certificate.pdf";
//	    String inputPdfPath = "src/main/resources/templates/Hachion's CertificateFinal.pdf";
//
//	    try {
//	        File folder = new File(folderPath);
//	        if (!folder.exists()) {
//	            folder.mkdirs();
//	            System.out.println("✅ 'certificates' folder created.");
//	        }
//
//	        PDDocument document = PDDocument.load(new File(inputPdfPath));
//	        document.setAllSecurityToBeRemoved(true);
//	        PDPage page = document.getPage(0);
//	        PDRectangle mediaBox = page.getMediaBox();
//	        float pageWidth = mediaBox.getWidth();
//	        float pageHeight = mediaBox.getHeight();
//	        System.out.println("Landscape page size: " + pageWidth + " x " + pageHeight);
//
//	        PDPageContentStream contentStream = new PDPageContentStream(document, page,
//	                PDPageContentStream.AppendMode.APPEND, true);
//
//	        // Font and sizes
//	        PDFont fontBold = PDType1Font.HELVETICA_BOLD;
//	        PDFont fontRegular = PDType1Font.HELVETICA;
//	        PDFont fontItalic = PDType1Font.HELVETICA_OBLIQUE;
//
//	        int nameFontSize = 18;
//	        int courseFontSize = 14;
//
//	        // Measure width for centering
//	        float nameWidth = fontBold.getStringWidth(studentName) / 1000 * nameFontSize;
//	        float courseWidth = fontRegular.getStringWidth(courseName) / 1000 * courseFontSize;
//
//	        // Center Student Name
//	        contentStream.beginText();
//	        contentStream.setFont(fontBold, nameFontSize);
//	        contentStream.setNonStrokingColor(0.055f, 0.286f, 0.659f); // Apply color
//	        contentStream.newLineAtOffset((pageWidth - nameWidth) / 2, pageHeight - 160);
//	        contentStream.showText(studentName);
//	        contentStream.endText();
//
//	        // Student ID
//	        contentStream.beginText();
//	        contentStream.setFont(fontBold, 14);
//	        contentStream.newLineAtOffset(pageWidth / 2 - 60, pageHeight - 210);
//	        contentStream.showText("STUDENTID : " + studentId);
//	        contentStream.endText();
//
//	        // Center Course Name
//	        contentStream.beginText();
//	        contentStream.setFont(fontRegular, courseFontSize);
//	        contentStream.newLineAtOffset((pageWidth - courseWidth) / 2, pageHeight / 2 - 10);
//	        contentStream.showText(courseName);
//	        contentStream.endText();
//
//	        // Completion Date
//	        LocalDate date = LocalDate.parse(completionDate);
//	        String formattedDate = date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
//	        contentStream.beginText();
//	        contentStream.setFont(fontItalic, 14);
//	        contentStream.newLineAtOffset(100, 140);
//	        contentStream.showText(formattedDate);
//	        contentStream.endText();
//
//	        contentStream.close();
//	        document.save(outputPdfPath);
//	        document.close();
//
//	        System.out.println("✅ Certificate PDF saved successfully at: " + outputPdfPath);
//	        return outputPdfPath;
//
//	    } catch (IOException e) {
//	        e.printStackTrace();
//	        return null;
//	    }
//	}
//	
//	private String generateCertificatePdf(String studentName, String studentId, String courseName, String completionDate) {
//	    String folderPath = "certificates";
//	    String outputPdfPath = folderPath + "/" + studentId + "_Certificate.pdf";
//	    String inputPdfPath = "src/main/resources/templates/Hachion's CertificatePowerpoint.pdf";
//
//	    try {
//	        // Ensure folder exists
//	        File folder = new File(folderPath);
//	        if (!folder.exists()) {
//	            folder.mkdirs();
//	            System.out.println("✅ 'certificates' folder created.");
//	        }
//
//	        // Load the template PDF
//	        PDDocument document = PDDocument.load(new File(inputPdfPath));
//	        document.setAllSecurityToBeRemoved(true);
//	        PDPage page = document.getPage(0);
//	        PDRectangle mediaBox = page.getMediaBox(); // Get dimensions
//	        float pageWidth = mediaBox.getWidth();
//	        float pageHeight = mediaBox.getHeight();
//	        System.out.println("Landscape page size: " + pageWidth + " x " + pageHeight);
//
//	        PDPageContentStream contentStream = new PDPageContentStream(document, page,
//	                PDPageContentStream.AppendMode.APPEND, true);
//
//	        // Add Student Name
//	        contentStream.beginText();
//	        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
//	        contentStream.newLineAtOffset(pageWidth / 2 - 100, pageHeight - 160); // Center top-ish
////	        contentStream.newLineAtOffset(693, 333); // Absolute position from Paint
//
//	        contentStream.showText(studentName);
//	        contentStream.endText();
//
//	        // Add Student ID
//	        contentStream.beginText();
//	        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
//	        contentStream.newLineAtOffset(pageWidth / 2 - 60, pageHeight - 210);
//	        contentStream.showText("STUDENTID : " + studentId);
//	        contentStream.endText();
//
//	        // Add Course Name
//	        contentStream.beginText();
//	        contentStream.setFont(PDType1Font.HELVETICA, 14);
//	        contentStream.newLineAtOffset(pageWidth / 2 - 100, pageHeight / 2 - 10);
//	        contentStream.showText(courseName);
//	        contentStream.endText();
//
//	        // Format Completion Date
//	        LocalDate date = LocalDate.parse(completionDate);
//	        String formattedDate = date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
//
//	        // Add Completion Date
//	        contentStream.beginText();
//	        contentStream.setFont(PDType1Font.HELVETICA_OBLIQUE, 14);
//	        contentStream.newLineAtOffset(100, 140); // Bottom left area
//	        contentStream.showText(formattedDate);
//	        contentStream.endText();
//
//	        // Finalize
//	        contentStream.close();
//	        document.save(outputPdfPath);
//	        document.close();
//
//	        System.out.println("✅ Certificate PDF saved successfully at: " + outputPdfPath);
//	        return outputPdfPath;
//
//	    } catch (IOException e) {
//	        e.printStackTrace();
//	        return null;
//	    }
//	}

//    private String generateCertificatePdf(String studentName, String studentId, String courseName, String completionDate) {
//        String folderPath = "certificates";
//        String outputPdfPath = folderPath + "/" + studentId + "_Certificate.pdf";
//        String inputPdfPath = "src/main/resources/templates/HachionCertificate.pdf";
//
//        try {
//            // Ensure folder exists
//            File folder = new File(folderPath);
//            if (!folder.exists()) {
//                folder.mkdirs(); // create folders
//                System.out.println("✅ 'certificates' folder created.");
//            }
//
//            // Load and modify PDF
//            PDDocument document = PDDocument.load(new File(inputPdfPath));
//            PDPage page = document.getPage(0);
//            PDPageContentStream contentStream = new PDPageContentStream(document, page,
//                    PDPageContentStream.AppendMode.APPEND, true);
//
//            // Add dynamic data into the PDF text by replacing static text
//            replaceTextInPDF(document, "Student Name", studentName);
//            replaceTextInPDF(document, "STUDENTID : H000000000000000", "STUDENTID : " + studentId);
//            replaceTextInPDF(document, "salesforce training", courseName);
//            replaceTextInPDF(document, "11/07 2024", completionDate); // You can format completionDate as needed
//
//            // Save modified PDF
//            document.save(outputPdfPath);
//            document.close();
//
//            System.out.println("✅ Certificate PDF saved successfully at: " + outputPdfPath);
//            return outputPdfPath;
//
//        } catch (IOException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }

	// Helper method to replace text in the PDF
//    private void replaceTextInPDF(PDDocument document, String targetText, String replacementText) throws IOException {
//        // Loop through all pages of the document
//        for (PDPage page : document.getPages()) {
//            PDPageContentStream contentStream = new PDPageContentStream(document, page,
//                    PDPageContentStream.AppendMode.APPEND, true);
//
//            // Extract text from the page
//            PDRectangle mediaBox = page.getMediaBox();
//            PDFTextStripper textStripper = new PDFTextStripper();
//            textStripper.setStartPage(0);
//            textStripper.setEndPage(1);
//            String pageText = textStripper.getText(document);
//
//            // Check if the targetText exists on the page and replace it
//            if (pageText.contains(targetText)) {
//                String newText = pageText.replace(targetText, replacementText);
//                contentStream.beginText();
//                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
//                contentStream.newLineAtOffset(180, 550); // Position the text (adjust as necessary)
//                contentStream.showText(newText); // Write the replaced text
//                contentStream.endText();
//            }
//
//            contentStream.close();
//        }
//    }

}

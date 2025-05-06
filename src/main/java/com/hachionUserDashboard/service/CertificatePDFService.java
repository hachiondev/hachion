//package com.hachionUserDashboard.service;
//
//import java.io.File;
//import java.io.IOException;
//import java.time.LocalDate;
//import java.time.format.DateTimeFormatter;
//
//import org.apache.pdfbox.pdmodel.PDDocument;
//import org.apache.pdfbox.pdmodel.PDPage;
//import org.apache.pdfbox.pdmodel.PDPageContentStream;
//import org.apache.pdfbox.pdmodel.font.PDType1Font;
//import org.springframework.stereotype.Service;
//
//@Service
//public class CertificatePDFService {
//
//    public String generateCertificatePdf(String studentName, String studentId, String courseName, String completionDate) {
//        String inputPdfPath = "src/main/resources/templates/HachionCertificate.pdf";
//        String outputFolderPath = "src/main/resources/certificates/";
//        String outputPdfPath = outputFolderPath + studentId + "_Certificate.pdf";
//
//        try {
//            // Ensure the output directory exists
//            File dir = new File(outputFolderPath);
//            if (!dir.exists()) {
//                boolean created = dir.mkdirs();
//                System.out.println("Certificates folder created: " + created);
//            }
//
//            // Load the template
//            PDDocument document = PDDocument.load(new File(inputPdfPath));
//            PDPage page = document.getPage(0);
//
//            PDPageContentStream contentStream = new PDPageContentStream(document, page,
//                    PDPageContentStream.AppendMode.APPEND, true);
//
//            // Student Name
//            contentStream.beginText();
//            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
//            contentStream.newLineAtOffset(180, 550);
//            contentStream.showText(studentName);
//            contentStream.endText();
//
//            // Student ID
//            contentStream.beginText();
//            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
//            contentStream.newLineAtOffset(180, 500);
//            contentStream.showText("STUDENTID : " + studentId);
//            contentStream.endText();
//
//            // Course Name
//            contentStream.beginText();
//            contentStream.setFont(PDType1Font.HELVETICA, 14);
//            contentStream.newLineAtOffset(180, 450);
//            contentStream.showText("Successfully completed " + courseName);
//            contentStream.endText();
//
//            // Completion Date
//            LocalDate date = LocalDate.parse(completionDate);
//            String formattedDate = date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
//
//            contentStream.beginText();
//            contentStream.setFont(PDType1Font.HELVETICA_OBLIQUE, 14);
//            contentStream.newLineAtOffset(180, 400);
//            contentStream.showText("DATE OF ISSUE: " + formattedDate);
//            contentStream.endText();
//
//            contentStream.close();
//
//            // Save the filled certificate
//            document.save(outputPdfPath);
//            document.close();
//
//            System.out.println("Certificate PDF successfully saved to: " + outputPdfPath);
//            return outputPdfPath;
//
//        } catch (IOException e) {
//            System.err.println("Error generating certificate: " + e.getMessage());
//            return null;
//        }
//    }
//}

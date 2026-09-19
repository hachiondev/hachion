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
import java.util.stream.Collectors;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.CertificateDTO;
import com.hachionUserDashboard.dto.CertificateRequest;
import com.hachionUserDashboard.dto.CertificatesResponse;
import com.hachionUserDashboard.entity.CertificateEntity;
import com.hachionUserDashboard.entity.ToolsEntity;
import com.hachionUserDashboard.entity.ToolsItemEntity;
import com.hachionUserDashboard.repository.CertificateDetailsRepository;
import com.hachionUserDashboard.repository.CourseRepository;
import com.hachionUserDashboard.repository.EnrollRepository;
import com.hachionUserDashboard.repository.ToolsRepository;

import Service.CertificateService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Service
public class Certificateimp implements CertificateService {

	@Autowired
	private CertificateDetailsRepository certificateRepository;

	@Autowired
	private EmailService emailService;

	@Value("${certificate.base-path}")
	private String certificateBasePath;

	@Autowired
	private CourseRepository courseRepository;
	
	@Autowired
	private EnrollRepository enrollRepository;
	
	@Autowired
	private ToolsRepository toolsRepository;

	
	private String sanitizeText(String text) {
	    if (text == null) return "";

	    return text
	            .replace("\u202F", " ")   
	            .replace("\u00A0", " ")   
	            .replace("\u2011", "-")   
	            .replace("\u2013", "-")   
	            .replace("\u2014", "-")   
	            .replaceAll("[^\\x00-\\x7F]", ""); 
	}
	
	@Override
	public CertificateEntity generateCertificate(CertificateRequest request) {

		Optional<CertificateEntity> existingEntity = certificateRepository
				.findByStudentIdAndCourseName(request.getStudentId(), request.getCourseName());

		if (existingEntity.isPresent()) {
			CertificateEntity existing = existingEntity.get();
			String existingPath = existing.getCertificatePath();
			boolean fileMissing = existingPath == null || existingPath.isBlank() || !new File(existingPath).exists();

			if (!fileMissing) {
				return existing;
			}

			// The DB record exists but its PDF is gone from disk (an
			// earlier attempt that never finished generating one, or a file
			// lost after the fact) - regenerate onto this SAME row instead
			// of silently handing back a reference nothing can ever open,
			// and instead of inserting a second row for the same
			// student+course. Without this, an admin re-submitting the
			// "Generate Certificate" form for a student whose file was
			// missing saw a "success" response pointing at a file that
			// still 404s - certificate creation looked like it silently
			// failed for that (already-existing) student.
			existing.setStudentName(request.getStudentName());
			existing.setStudentEmail(request.getStudentEmail());
			existing.setCertificateNumber(request.getCertificateNumber());
			existing.setCompletionDate(LocalDate.parse(request.getCompletionDate().trim()).toString());
			existing.setStatus(request.getStatus());
			existing.setGrade(request.getGrade());

			String regeneratedPath = generateCertificatePdf(existing.getStudentName(), existing.getStudentId(),
					existing.getCourseName(), existing.getCompletionDate(), existing.getCertificateId(),
					existing.getCertificateNumber());

			if (regeneratedPath == null) {
				throw new RuntimeException("PDF generation failed. Certificate will not be saved.");
			}

			existing.setCertificatePath(regeneratedPath);
			return certificateRepository.save(existing);
		}

		CertificateEntity entity = new CertificateEntity();
		entity.setStudentId(request.getStudentId());
		entity.setStudentName(request.getStudentName());
		entity.setStudentEmail(request.getStudentEmail());
		entity.setCourseName(request.getCourseName());
		entity.setCertificateNumber(request.getCertificateNumber());

		LocalDate parsedDate = LocalDate.parse(request.getCompletionDate().trim());
		entity.setCompletionDate(parsedDate.toString());
		entity.setStatus(request.getStatus());
		entity.setGrade(request.getGrade());

		// Saved first (without a path yet) purely to obtain the real,
		// database-assigned certificateId - the new certificate background
		// (Certificate_Of_Hachion) has a "Certificate ID" footer slot that a
		// fabricated/placeholder number would make meaningless, and the ID
		// doesn't exist until JPA's IDENTITY strategy assigns it on insert.
		entity = certificateRepository.save(entity);

		String path = generateCertificatePdf(request.getStudentName(), request.getStudentId(), request.getCourseName(),
				request.getCompletionDate(), entity.getCertificateId(), request.getCertificateNumber());

		if (path == null) {
			throw new RuntimeException("PDF generation failed. Certificate will not be saved.");
		}

		entity.setCertificatePath(path);
		certificateRepository.save(entity);

		return entity;
	}
	public String generateCertificatePdf(String studentName, String studentId, String courseName,
	        String completionDate, Long certificateId, String certificateNumber) {

		studentName = sanitizeText(studentName);
		courseName = sanitizeText(courseName);
		studentId = sanitizeText(studentId);
		completionDate = sanitizeText(completionDate);
		certificateNumber = sanitizeText(certificateNumber);


	    String folderPath = certificateBasePath;
	    String outputPdfPath = folderPath + studentId + "_" + courseName.replaceAll("\\s+", "_") + "_Certificate.pdf";

	    try {
	        File folder = new File(folderPath);
	        if (!folder.exists()) {
	            folder.mkdirs();
	        }

	        File outputFile = new File(outputPdfPath);
	        if (outputFile.exists()) {
	            return outputPdfPath;
	        }

	        // Certificate background is Certificate_Genarated.jpg - a
	        // "Key Skills" style template (blank Certificate ID/Support/
	        // Completion Date footer, blank name line, bracketed
	        // [Course Name]/[Course Type] placeholder paragraph) matching
	        // the admin-supplied reference layout. This is the artwork used
	        // for real, per-student generated certificates; the course-page
	        // marketing preview (CertificateSection.jsx) intentionally uses
	        // a different image (cer.png) and is not expected to match this
	        // one pixel-for-pixel.
	        PDDocument document = new PDDocument();

	        byte[] bgImageBytes;
	        try (java.io.InputStream in = new ClassPathResource("templates/Certificate_Genarated.jpg")
	                .getInputStream()) {
	            bgImageBytes = in.readAllBytes();
	        }
	        org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject bgImage = org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject
	                .createFromByteArray(document, bgImageBytes, "Certificate_Genarated");

	        // Page sized to the background image's own aspect ratio
	        // (512x362px, ratio 1.4144 - very close to A4 landscape's
	        // 1.4151) so it fills edge-to-edge with no letterboxing/cropping,
	        // at a normal print-scale width (842pt ~= A4 landscape width).
	        float pageWidth = 842f;
	        float pageHeight = pageWidth / ((float) bgImage.getWidth() / bgImage.getHeight());
	        PDPage page = new PDPage(new PDRectangle(pageWidth, pageHeight));
	        document.addPage(page);

	        PDPageContentStream contentStream = new PDPageContentStream(document, page,
	                PDPageContentStream.AppendMode.APPEND, true, true);
	        contentStream.drawImage(bgImage, 0, 0, pageWidth, pageHeight);

	        PDFont fontBold = PDType1Font.HELVETICA_BOLD;
	        PDFont fontItalic = PDType1Font.HELVETICA;

	        // A semi-transparent cover was tried here to let the artwork's
	        // baked watermark show through the name/passage cover rects
	        // instead of being erased. Reverted: even at 97% opacity, the
	        // artwork's OWN baked placeholder text ("Student Name",
	        // "[Course Name]...") stayed faintly legible underneath the real
	        // text, reading as visible overlapping/duplicated content between
	        // the name and passage. Fully opaque avoids that outright, at
	        // the cost of the watermark not showing through in this area -
	        // an explicit tradeoff, not an oversight.
	        PDExtendedGraphicsState semiTransparentFill = new PDExtendedGraphicsState();
	        semiTransparentFill.setNonStrokingAlphaConstant(1f);
	        PDExtendedGraphicsState opaqueFill = new PDExtendedGraphicsState();
	        opaqueFill.setNonStrokingAlphaConstant(1f);

	        int nameFontSize = 24;
	        int aboutCourseFontSize = 12;

	        // --- Hours from course table ---
	        String aboutCourse = sanitizeText(courseRepository.findAboutCourseByCourseName(courseName));
	        String classesStr = aboutCourse != null ? aboutCourse : "0";
	        int totalHours = 0;
	        try {
	            totalHours = Integer.parseInt(classesStr);
	        } catch (NumberFormatException e) {
	            totalHours = 0;
	        }

	        String mode = sanitizeText(enrollRepository.findModeByStudentAndCourse(studentId, courseName));

	        if (mode == null || mode.trim().isEmpty()) {
	            mode = "Instructor-Led Training";
	        }

	        String safeMode = sanitizeText(mode.trim());

	        String aboutText =
	            "This is to certify that the above-named candidate has successfully completed the " +
	            courseName +
	            " Program conducted by Hachion, comprising " +
	            totalHours +
	            " hours of " + safeMode + ", and has demonstrated proficiency in core concepts " +
	            "and practical applications aligned with industry standards.";

	        // All X/Y fractions below were measured directly against the
	        // Certificate_Genarated.jpg artwork (top-left origin, as the image
	        // is normally viewed) via a labeled percentage-grid render, and
	        // converted to PDFBox's bottom-left origin via
	        // `pageHeight * (1 - topFractionFromTop)`. The image's own
	        // right-hand content column (the white certificate panel, right
	        // of the navy "Key Skills" sidebar + gold border) is horizontally
	        // centered at ~64% of the page width, not 50% - the sidebar
	        // shifts the true visual center right.
	        float centerXRatio = 0.64f;

	        // =======================
	        // 1) Student Name
	        // =======================
	        // This artwork's name line is blank (no baked placeholder text),
	        // but a cover rect is still drawn for safety/consistency in case
	        // of artwork variations. No separate "Student ID" line here - the
	        // Certificate ID in the footer below IS the student's Student ID.
	        float nameCoverTopY = pageHeight * (1 - 0.30f);
	        float nameCoverBottomY = pageHeight * (1 - 0.475f);
	        float nameCoverWidth = pageWidth * 0.55f;
	        float nameCoverX = (pageWidth * centerXRatio) - (nameCoverWidth / 2);
	        contentStream.setNonStrokingColor(1f, 1f, 1f);
	        contentStream.setGraphicsStateParameters(semiTransparentFill);
	        contentStream.addRect(nameCoverX, nameCoverBottomY, nameCoverWidth, nameCoverTopY - nameCoverBottomY);
	        contentStream.fill();
	        contentStream.setGraphicsStateParameters(opaqueFill);

	        // Passage cover is drawn here too (ahead of its own section below)
	        // so both cover rects are down BEFORE the watermark is drawn next -
	        // the watermark needs to sit on top of the opaque white covers but
	        // underneath the real name/passage text, spanning both areas as
	        // one continuous piece of text like the reference does.
	        float aboutCoverTopY = pageHeight * (1 - 0.495f);
	        float aboutCoverBottomY = pageHeight * (1 - 0.65f);
	        float aboutCoverWidth = pageWidth * 0.64f;
	        float aboutCoverX = (pageWidth * centerXRatio) - (aboutCoverWidth / 2);
	        contentStream.setNonStrokingColor(1f, 1f, 1f);
	        contentStream.setGraphicsStateParameters(semiTransparentFill);
	        contentStream.addRect(aboutCoverX, aboutCoverBottomY, aboutCoverWidth, aboutCoverTopY - aboutCoverBottomY);
	        contentStream.fill();
	        contentStream.setGraphicsStateParameters(opaqueFill);

	        // Watermark: drawn as an independent vector text layer (the
	        // current Certificate_Genarated background has no baked-in
	        // watermark or placeholder text of its own to hide/reveal), on
	        // top of the name/passage cover rects and underneath the real
	        // name/passage text drawn next. Size/angle/position measured
	        // against the HACH10000 reference render: light gray #EBEBEB,
	        // ~9 degree upward tilt, large enough and low enough to span
	        // from the name line down through the passage.
	        String watermarkText = "Hachion";
	        float watermarkFontSize = 140f;
	        float watermarkTextWidth = fontBold.getStringWidth(watermarkText) / 1000 * watermarkFontSize;
	        double watermarkAngle = Math.toRadians(9);
	        float watermarkCenterX = pageWidth * 0.62f;
	        float watermarkCenterY = pageHeight * (1 - 0.545f);
	        float watermarkStartX = (float) (watermarkCenterX - (watermarkTextWidth / 2) * Math.cos(watermarkAngle));
	        float watermarkStartY = (float) (watermarkCenterY - (watermarkTextWidth / 2) * Math.sin(watermarkAngle));
	        contentStream.beginText();
	        contentStream.setFont(fontBold, watermarkFontSize);
	        contentStream.setNonStrokingColor(0.92f, 0.92f, 0.92f);
	        contentStream.setTextMatrix(org.apache.pdfbox.util.Matrix.getRotateInstance(
	                watermarkAngle, watermarkStartX, watermarkStartY));
	        contentStream.showText(watermarkText);
	        contentStream.endText();

	        float nameWidth = fontBold.getStringWidth(studentName) / 1000 * nameFontSize;
	        float nameAreaWidth = pageWidth * 0.50f;
	        while (nameWidth > nameAreaWidth && nameFontSize > 17) {
	            nameFontSize--;
	            nameWidth = fontBold.getStringWidth(studentName) / 1000 * nameFontSize;
	        }

	        contentStream.beginText();
	        contentStream.setFont(fontBold, nameFontSize);
	        contentStream.setNonStrokingColor(0.055f, 0.286f, 0.659f);
	        float nameX = (pageWidth * centerXRatio) - (nameWidth / 2);
	        contentStream.newLineAtOffset(nameX, pageHeight * (1 - 0.44f));
	        contentStream.showText(studentName);
	        contentStream.endText();

	        // =======================
	        // 2) About text (wrapped, bold parts) - the cover rect for this
	        // area (hiding the baked-in bracketed placeholder paragraph) was
	        // already drawn above, ahead of the watermark. Only the layout
	        // math for wrapping/positioning the real text is left here.
	        // =======================
	        float aboutTopY = pageHeight * (1 - 0.545f);
	        float availableAboutHeight = aboutTopY - aboutCoverBottomY - 6f;
	        float safeWhiteWidth = aboutCoverWidth - 10f;
	        float safeWhiteStartX = aboutCoverX + 5f;

	        String[] words = aboutText.split(" ");
	        List<String> lines;
	        float lineGap;

	        while (true) {
	            lines = new ArrayList<>();
	            StringBuilder currentLine = new StringBuilder();
	            for (String word : words) {
	                String testLine = currentLine.length() == 0 ? word : currentLine + " " + word;
	                float testWidth = fontItalic.getStringWidth(testLine) / 1000 * aboutCourseFontSize;

	                if (testWidth > safeWhiteWidth) {
	                    lines.add(currentLine.toString());
	                    currentLine = new StringBuilder(word);
	                } else {
	                    currentLine = new StringBuilder(testLine);
	                }
	            }
	            if (currentLine.length() > 0) {
	                lines.add(currentLine.toString());
	            }

	            lineGap = aboutCourseFontSize + 4;
	            float neededHeight = (lines.size() - 1) * lineGap;
	            if (neededHeight <= availableAboutHeight || aboutCourseFontSize <= 9) {
	                break;
	            }
	            aboutCourseFontSize--;
	        }

	        float startY = aboutTopY;
	        String hoursPhrase = totalHours + " hours";
	        String modePhrase = mode.trim();

	        for (int i = 0; i < lines.size(); i++) {
	            String line = lines.get(i);

	            float lineWidth = fontItalic.getStringWidth(line) / 1000 * aboutCourseFontSize;
	            float lineX = safeWhiteStartX + (safeWhiteWidth - lineWidth) / 2;
	            float lineY = startY - (i * lineGap);

	            contentStream.beginText();
	            contentStream.setNonStrokingColor(0f, 0f, 0f);
	            contentStream.newLineAtOffset(lineX, lineY);

	            String remaining = line;

	            if (remaining.contains(courseName)) {
	                int index = remaining.indexOf(courseName);
	                String before = remaining.substring(0, index);
	                String after = remaining.substring(index + courseName.length());

	                contentStream.setFont(fontItalic, aboutCourseFontSize);
	                contentStream.showText(before);

	                contentStream.setFont(PDType1Font.HELVETICA_BOLD, aboutCourseFontSize);
	                contentStream.showText(courseName);

	                remaining = after;
	            }
	            if (remaining.contains(hoursPhrase)) {
	                String[] p = remaining.split(java.util.regex.Pattern.quote(hoursPhrase), 2);

	                contentStream.setFont(fontItalic, aboutCourseFontSize);
	                contentStream.showText(p[0]);

	                contentStream.setFont(fontBold, aboutCourseFontSize);
	                contentStream.showText(hoursPhrase);

	                remaining = p.length > 1 ? p[1] : "";
	            }
	            if (remaining.contains(modePhrase)) {
	                String[] p = remaining.split(java.util.regex.Pattern.quote(modePhrase), 2);

	                contentStream.setFont(fontBold, aboutCourseFontSize);
	                contentStream.showText(p[0]);
	                contentStream.setFont(fontBold, aboutCourseFontSize);
	                contentStream.showText(modePhrase);

	                remaining = p.length > 1 ? p[1] : "";
	            }

	            contentStream.setFont(fontItalic, aboutCourseFontSize);
	            contentStream.showText(remaining);
	            contentStream.endText();
	        }

	        // =======================
	        // 2b) Key Skills sidebar - real tools/skills for this course
	        // (ToolsRepository, the same course_tools data the public course
	        // page's tools section and /api/tools/by-course serve), drawn
	        // white-on-navy into the template's left sidebar, below its own
	        // baked "Key Skills" heading (~54%-56%).
	        // =======================
	        List<ToolsEntity> toolsEntities = toolsRepository.findByCourseName(courseName);
	        List<String> skillNames = new ArrayList<>();
	        if (toolsEntities != null) {
	            for (ToolsEntity toolsEntity : toolsEntities) {
	                if (toolsEntity.getItems() == null) continue;
	                for (ToolsItemEntity item : toolsEntity.getItems()) {
	                    String skillName = sanitizeText(item.getToolsName());
	                    if (skillName != null && !skillName.isBlank()) {
	                        skillNames.add(skillName);
	                    }
	                }
	            }
	        }

	        if (!skillNames.isEmpty()) {
	            // The area below this artwork's "Key Skills" heading is
	            // already blank navy from the background JPG itself - no
	            // cover rectangle needed. An earlier cover-rect here used
	            // #16233E, visibly darker than the JPG's actual measured
	            // navy (#343F63), producing a visible seam/color clash
	            // against the reference design - removed rather than
	            // color-matched, since covering was never load-bearing.
	            float skillsCoverTopY = pageHeight * (1 - 0.565f);
	            float skillsCoverBottomY = pageHeight * (1 - 0.83f);

	            float skillFontSize = 14f;
	            float skillLineGap = 20f;
	            float skillX = pageWidth * 0.055f;
	            float skillY = skillsCoverTopY - (pageHeight * 0.035f);
	            float skillMinY = skillsCoverBottomY + 5f;

	            contentStream.setFont(fontItalic, skillFontSize);
	            contentStream.setNonStrokingColor(1f, 1f, 1f);
	            for (String skillName : skillNames) {
	                if (skillY < skillMinY) break;
	                contentStream.beginText();
	                contentStream.newLineAtOffset(skillX, skillY);
	                contentStream.showText(skillName);
	                contentStream.endText();
	                skillY -= skillLineGap;
	            }
	        }

	        // =======================
	        // 3) Footer: Certificate ID (= Student ID) + Support + Completion Date
	        // =======================
	        // This artwork bakes the footer as one label line ("Certificate
	        // ID:   Support: trainings@hachion.co   Completion Date:") with
	        // blank value slots, plus separate legal/footer text just below
	        // it. The label line is covered and all three fields - Certificate
	        // ID bottom-left, Support bottom-center, Completion Date
	        // bottom-right - are drawn fresh, without touching the legal text.
	        float footerCoverTopY = pageHeight * (1 - 0.885f);
	        float footerCoverBottomY = pageHeight * (1 - 0.925f);
	        // X nudged a few points right of the raw 0.30 fraction: at that
	        // exact fraction the cover's left edge lands inside the artwork's
	        // thin dark-navy accent stripe that borders the gold divider, so
	        // only the covered Y-range (footerCoverBottomY..Top) had that
	        // stripe erased - producing a visible stepped notch against the
	        // uncovered stripe just above/below it. Measured directly off the
	        // rendered pixels (pixel step ~5px at 150 DPI = ~2.4pt).
	        float footerCoverWidth = pageWidth * 0.67f - 3f;
	        float footerCoverX = pageWidth * 0.30f + 3f;
	        contentStream.setNonStrokingColor(1f, 1f, 1f);
	        contentStream.addRect(footerCoverX, footerCoverBottomY, footerCoverWidth, footerCoverTopY - footerCoverBottomY);
	        contentStream.fill();
	        // The small teal mark that appears just past this cover's right
	        // edge is the template's own bottom-right corner-bracket flourish
	        // (matching the one top-right) - legitimate artwork, not a stray
	        // baked-text sliver, so it's deliberately left uncovered.
	        float footerTextBaselineY = footerCoverBottomY + 3f;

	        LocalDate date2 = LocalDate.parse(completionDate);
	        String formattedDate2 = date2.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

	        // Certificate ID displayed to the learner is a distinct,
	        // admin-entered reference number (certificateNumber) - NOT the
	        // student's Student ID and NOT the DB-assigned sequential
	        // certificateId row number (that PK is still used only for
	        // routing/filenames elsewhere). Student ID and Certificate ID
	        // are two different things by design.
	        //
	        // All three footer fields (Certificate ID, Support, Completion
	        // Date) share one consistent size (footerFontSize) and the same
	        // label/value styling - regular weight label, bold value - so
	        // the row reads as one uniform line instead of a mix of
	        // different sizes/weights per field. An earlier version sized
	        // the Certificate ID value independently (20pt, versus 11pt for
	        // Completion Date) which looked wildly oversized for a short ID
	        // like "45" - a single shared size avoids that.
	        //
	        // Layout is anchored at BOTH ends instead of purely sequential:
	        // Certificate ID stays left-anchored, but Completion Date below
	        // is right-anchored to the white panel's own right edge - its
	        // position no longer depends on how wide the ID value or
	        // Support email happen to be, so it can never run off the page.
	        // Support is centered in whatever space remains between the
	        // two. A purely sequential layout (each field positioned off
	        // the previous one's end) was tried first and pushed Completion
	        // Date past the page edge once the ID value grew to match the
	        // reference's size - anchoring both ends independently removes
	        // that failure mode for any ID/email length.
	        float footerFontSize = 12f;
	        String certIdLabel = "Certificate ID: ";
	        float certIdLabelSize = footerFontSize;
	        float certIdValueSize = footerFontSize;
	        float certIdStartX = pageWidth * 0.31f;
	        float certIdLabelWidth = fontItalic.getStringWidth(certIdLabel) / 1000 * certIdLabelSize;
	        float certIdValueWidth = fontBold.getStringWidth(certificateNumber) / 1000 * certIdValueSize;
	        float certIdEndX = certIdStartX + certIdLabelWidth + certIdValueWidth;
	        contentStream.beginText();
	        contentStream.setFont(fontItalic, certIdLabelSize);
	        contentStream.setNonStrokingColor(0f, 0f, 0f);
	        contentStream.newLineAtOffset(certIdStartX, footerTextBaselineY);
	        contentStream.showText(certIdLabel);
	        contentStream.endText();
	        contentStream.beginText();
	        contentStream.setFont(fontBold, certIdValueSize);
	        contentStream.setNonStrokingColor(0f, 0f, 0f);
	        contentStream.newLineAtOffset(certIdStartX + certIdLabelWidth, footerTextBaselineY - 1f);
	        contentStream.showText(certificateNumber);
	        contentStream.endText();

	        // Completion Date: regular label + bold value (same styling as
	        // Certificate ID/Support), right-anchored to the covered footer
	        // strip's own right edge (with a small margin so it doesn't
	        // crowd the corner-bracket flourish just past it).
	        String dateLabel = "Completion Date: ";
	        float dateFontSize = footerFontSize;
	        float dateLabelWidth = fontItalic.getStringWidth(dateLabel) / 1000 * dateFontSize;
	        float dateValueWidth = fontBold.getStringWidth(formattedDate2) / 1000 * dateFontSize;
	        float dateRightMargin = 10f;
	        float dateStartX = (footerCoverX + footerCoverWidth) - dateRightMargin - dateLabelWidth - dateValueWidth;
	        contentStream.beginText();
	        contentStream.setFont(fontItalic, dateFontSize);
	        contentStream.setNonStrokingColor(0f, 0f, 0f);
	        contentStream.newLineAtOffset(dateStartX, footerTextBaselineY);
	        contentStream.showText(dateLabel);
	        contentStream.endText();
	        contentStream.beginText();
	        contentStream.setFont(fontBold, dateFontSize);
	        contentStream.setNonStrokingColor(0f, 0f, 0f);
	        contentStream.newLineAtOffset(dateStartX + dateLabelWidth, footerTextBaselineY);
	        contentStream.showText(formattedDate2);
	        contentStream.endText();

	        // Support: label + blue underlined email, styled like a
	        // hyperlink, centered in the space between Certificate ID's end
	        // and Completion Date's start. Label is regular weight
	        // (fontItalic), NOT bold - confirmed by zooming the reference
	        // render: "Support:" has the same thin stroke weight as
	        // "Certificate ID:", clearly lighter than the bold
	        // "HACH10000"/"Completion Date:" text next to it.
	        //
	        // Sized down dynamically from footerFontSize (same "shrink until
	        // it fits" approach used for the name and passage above) if
	        // "Support: trainings@hachion.co" plus margins doesn't fit the
	        // space actually left between Certificate ID's end and the
	        // right-anchored Completion Date.
	        String supportLabel = "Support: ";
	        String supportEmail = "trainings@hachion.co";
	        float footerLabelSize = footerFontSize;
	        float minFieldGap = 16f;
	        float availableCenterSpace = dateStartX - certIdEndX;
	        float supportLabelWidth, supportEmailWidth, supportTotalWidth;
	        do {
	            supportLabelWidth = fontItalic.getStringWidth(supportLabel) / 1000 * footerLabelSize;
	            supportEmailWidth = fontItalic.getStringWidth(supportEmail) / 1000 * footerLabelSize;
	            supportTotalWidth = supportLabelWidth + supportEmailWidth;
	            if (supportTotalWidth + 2 * minFieldGap <= availableCenterSpace || footerLabelSize <= 9f) break;
	            footerLabelSize -= 0.5f;
	        } while (true);
	        float supportStartX = certIdEndX + (availableCenterSpace - supportTotalWidth) / 2f;
	        // If the ID/email combination is still unusually long even at the
	        // smallest size, fall back to a minimum gap off Certificate ID's
	        // end rather than letting the fields collide.
	        supportStartX = Math.max(supportStartX, certIdEndX + minFieldGap);
	        contentStream.beginText();
	        contentStream.setFont(fontItalic, footerLabelSize);
	        contentStream.setNonStrokingColor(0f, 0f, 0f);
	        contentStream.newLineAtOffset(supportStartX, footerTextBaselineY);
	        contentStream.showText(supportLabel);
	        contentStream.endText();
	        // Measured directly from the HACH10000 reference render (#0189AD) -
	        // a distinct teal/link blue, not the same blue used for the name.
	        contentStream.beginText();
	        contentStream.setFont(fontItalic, footerLabelSize);
	        contentStream.setNonStrokingColor(0.004f, 0.537f, 0.678f);
	        contentStream.newLineAtOffset(supportStartX + supportLabelWidth, footerTextBaselineY);
	        contentStream.showText(supportEmail);
	        contentStream.endText();
	        contentStream.setStrokingColor(0.004f, 0.537f, 0.678f);
	        contentStream.setLineWidth(0.4f);
	        contentStream.moveTo(supportStartX + supportLabelWidth, footerTextBaselineY - 1.2f);
	        contentStream.lineTo(supportStartX + supportLabelWidth + supportEmailWidth, footerTextBaselineY - 1.2f);
	        contentStream.stroke();

	        contentStream.close();
	        document.save(outputPdfPath);
	        document.close();

	        return outputPdfPath;

	    } catch (Exception e) {
	        e.printStackTrace();
	        throw new RuntimeException("Error while generating certificate PDF: " + e.getMessage(), e);
	    }
	}

	@Override
	public void sendCertificateByEmail(Long certificateId) throws IOException, MessagingException {
		CertificateEntity certificate = certificateRepository.findById(certificateId)
				.orElseThrow(() -> new RuntimeException("Certificate not found"));

		String email = certificate.getStudentEmail();
		String filePath = certificate.getCertificatePath();

		byte[] pdfBytes = Files.readAllBytes(Paths.get(filePath));

		emailService.sendEmailWithAttachment(email, pdfBytes, "Your Course Certificate",
				"Please find attached your certificate.");
	}

	@Override
	public List<CertificateEntity> getAllCertificates() {
		return certificateRepository.findAll();
	}

	@Override
	public String getUserById(Long certificateId) {

		return null;
	}

	public List<CertificateEntity> getCertificatesByStudentName(String studentName) {
		List<CertificateEntity> list = certificateRepository.findByStudentNameNative(studentName);
		return list != null ? list : new ArrayList<>();
	}

	@Transactional
	public CertificatesResponse getByEmail(String email) {
		var rows = certificateRepository.findAllByStudentEmail(email);
		List<CertificateDTO> items = rows.stream()
				// Certificate ID shown to the learner must equal their Student ID,
				// same convention as the PDF footer and the admin panel - not a
				// separately fabricated "CERT-<row id>" string.
				.map(r -> new CertificateDTO(r.getId(), r.getCourseName(), r.getGrade(), r.getIssueDate(),
						r.getStudentId(), r.getCertificatePath(), r.getCertificateNumber()))
				.collect(Collectors.toList());

		long total = certificateRepository.countByStudentEmail(email); 
		return new CertificatesResponse(total, items);
	}

	@Transactional
	public long countByEmail(String email) {
		return certificateRepository.countByStudentEmail(email);
	}

	public List<CertificateEntity> findByStudentNameIgnoreCase(String studentName) {
		
		return null;
	}

}

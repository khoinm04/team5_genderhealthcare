package com.ghsms.util;

import com.ghsms.file_enum.ReportFormat;
import com.ghsms.model.TestResult;
import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.commons.io.IOUtils;

@Component
public class ReportGenerator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    private Font getVietnameseFont(float size, int style) throws IOException, DocumentException {
        try {
            ClassPathResource fontResource = new ClassPathResource("fonts/Roboto-Regular.ttf");
            BaseFont baseFont = BaseFont.createFont(
                    "fonts/Roboto-Regular.ttf", // font name only
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED,
                    true, // cache
                    IOUtils.toByteArray(fontResource.getInputStream()), // font data as byte array
                    null
            );
            return new Font(baseFont, size, style);
        } catch (Exception e) {
            // Fallback to default font if Roboto is not available
            BaseFont baseFont = BaseFont.createFont(
                    BaseFont.HELVETICA,
                    BaseFont.CP1252,
                    BaseFont.EMBEDDED
            );
            return new Font(baseFont, size, style);
        }
    }


    public byte[] generateReport(List<TestResult> results, ReportFormat format) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            if (format == ReportFormat.PDF) {
                generatePdfReport(results, baos);
            } else if (format == ReportFormat.EXCEL) {
                generateExcelReport(results, baos);
            }
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating report: " + e.getMessage(), e);
        }
    }

    private void generatePdfReport(List<TestResult> results, ByteArrayOutputStream baos) throws DocumentException, IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        document.open();

        // Create fonts with different styles
        Font titleFont = getVietnameseFont(16, Font.BOLD);
        Font headerFont = getVietnameseFont(12, Font.BOLD);
        Font normalFont = getVietnameseFont(12, Font.NORMAL);

        // Add title
        Paragraph title = new Paragraph("BÁO CÁO KẾT QUẢ XÉT NGHIỆM", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Add patient info if available
        if (!results.isEmpty()) {
            TestResult firstResult = results.get(0);
            addPatientInfo(document, firstResult, headerFont, normalFont);
            addStaffInfo(document, firstResult, headerFont, normalFont);
        }


        // Create table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(20f);

        // Add headers
        String[] headers = {"Tên xét nghiệm", "Kết quả", "Trạng thái", "Ngày thực hiện"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(5);
            table.addCell(cell);
        }

        // Add data
        for (TestResult result : results) {
            // Cột "Tên xét nghiệm"
            table.addCell(new Phrase(result.getTestName(), normalFont));

            // Cột "Kết quả" với màu
            PdfPCell resultCell = new PdfPCell(new Phrase(result.getResult() != null ? result.getResult() : "Chưa có", normalFont));
            if ("Âm tính".equalsIgnoreCase(result.getResult())) {
                resultCell.setBackgroundColor(new BaseColor(198, 239, 206)); // Xanh nhạt
            } else if ("Duong tính".equalsIgnoreCase(result.getResult())) {
                resultCell.setBackgroundColor(new BaseColor(255, 199, 206)); // Đỏ nhạt
            }
            resultCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(resultCell);

            // Cột "Trạng thái"
            table.addCell(new Phrase(result.getStatus().name(), normalFont));

            // Cột "Ngày thực hiện"
            table.addCell(new Phrase(result.getGeneratedAt().format(DATE_FORMATTER), normalFont));
        }


        document.add(table);
        document.close();
    }

    private void addPatientInfo(Document document, TestResult result, Font headerFont, Font normalFont) throws DocumentException {
        Paragraph patientInfo = new Paragraph();
        patientInfo.add(new Chunk("Thông tin bệnh nhân:", headerFont));
        patientInfo.add(Chunk.NEWLINE);
        patientInfo.add(new Chunk("Họ và tên: " + result.getBooking().getCustomer().getFullName(), normalFont));
        patientInfo.add(Chunk.NEWLINE);
        patientInfo.add(new Chunk("Tuổi: " + result.getBooking().getCustomer().getAge(), normalFont));
        patientInfo.add(Chunk.NEWLINE);
        patientInfo.add(new Chunk("Giới tính: " + result.getBooking().getCustomer().getGender(), normalFont));
        patientInfo.add(Chunk.NEWLINE);
        patientInfo.setSpacingAfter(20f);
        document.add(patientInfo);
    }

    private void generateExcelReport(List<TestResult> results, ByteArrayOutputStream baos) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Kết quả xét nghiệm");

            // Create headers
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Tên xét nghiệm", "Kết quả", "Trạng thái", "Ngày thực hiện"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Add data
            int rowNum = 1;
            for (TestResult result : results) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(result.getTestName());
                row.createCell(1).setCellValue(result.getResult() != null ? result.getResult() : "Chưa có");
                row.createCell(2).setCellValue(result.getStatus().name());
                row.createCell(3).setCellValue(result.getGeneratedAt().format(DATE_FORMATTER));
            }

            // Autosize columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(baos);
        }
    }

    private void addStaffInfo(Document document, TestResult result, Font headerFont, Font normalFont) throws DocumentException {
        if (result.getBooking() != null && result.getBooking().getStaff() != null) {
            String staffName = result.getBooking().getStaff().getStaff().getName(); // Tên nhân viên
            String specialty = result.getBooking().getStaff().getSpecialization().name(); // Chuyên môn (enum)

            Paragraph staffInfo = new Paragraph();
            staffInfo.add(new Chunk("Thông tin nhân viên xét nghiệm:", headerFont));
            staffInfo.add(Chunk.NEWLINE);
            staffInfo.add(new Chunk("Họ và tên: " + staffName, normalFont));
            staffInfo.add(Chunk.NEWLINE);
            staffInfo.add(new Chunk("Chuyên môn: " + specialty, normalFont));
            staffInfo.setSpacingAfter(20f);

            document.add(staffInfo);
        }
    }

}
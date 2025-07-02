package com.ghsms.util;

import com.ghsms.file_enum.ReportFormat;
import com.ghsms.model.TestResult;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.element.Text;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class ReportGenerator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final String FONT_PATH = "fonts/Roboto-Regular.ttf";

    public byte[] generateReport(List<TestResult> results, ReportFormat format) {
        try {
            return switch (format) {
                case PDF -> generatePdfReport(results);
                case EXCEL -> generateExcelReport(results);
            };
        } catch (Exception e) {
            throw new RuntimeException("Error generating report: " + e.getMessage(), e);
        }
    }

    private byte[] generatePdfReport(List<TestResult> results) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Load Roboto font
        // Replace this

// With this
        InputStream fontStream = getClass().getClassLoader().getResourceAsStream(FONT_PATH);
        byte[] fontBytes = fontStream.readAllBytes();
        PdfFont robotoFont = PdfFontFactory.createFont(fontBytes, PdfEncodings.IDENTITY_H, PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED);

        // Add main title
        Paragraph mainTitle = new Paragraph("KẾT QUẢ KHÁM SỨC KHỎE")
                .setFont(robotoFont)
                .setFontSize(24)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER);
        document.add(mainTitle);

        Paragraph subtitle = new Paragraph("Mẫu giấy kết quả xét nghiệm STI")
                .setFont(robotoFont)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(subtitle);

        // Add spacing
        document.add(new Paragraph("\n"));

        // Add introduction
        Paragraph intro = new Paragraph()
                .add(new Text("Mẫu giấy kết quả có thể có các nội dung khác nhau tùy theo mục đích sử dụng. ")
                        .setFont(robotoFont)
                        .setFontSize(12))
                .add(new Text("Trong trường hợp mẫu giấy khám sức khỏe xin việc, tài liệu này thường được chia thành ba phần chính như sau:")
                        .setFont(robotoFont)
                        .setFontSize(12));
        document.add(intro);

        document.add(new Paragraph("\n"));

        // Phần I: Thông tin cá nhân
        addSectionTitle(document, "PHẦN I: THÔNG TIN CÁ NHÂN", robotoFont);

        Paragraph personalInfo = new Paragraph()
                .add(new Text("Trong phần này, người khám sức khỏe cần cung cấp đầy đủ thông tin nhận diện cá nhân, bao gồm:\n\n")
                        .setFont(robotoFont)
                        .setFontSize(11))
                .add(new Text("• Họ và tên: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Phải viết in hoa, không dấu.\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("• Giới tính: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Ghi rõ Nam/Nữ.\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("• Ngày tháng năm sinh: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Theo định dạng ngày/tháng/năm.\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("• Số CCCD: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Ghi rõ số, ngày cấp, nơi cấp.\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("• Chỗ ở hiện tại: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Ghi theo sổ hộ khẩu hoặc nơi cư trú thực tế.\n\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("Những thông tin trên là bắt buộc nhằm xác định danh tính người khám, giúp quá trình theo dõi sức khỏe thuận tiện hơn.")
                        .setFont(robotoFont).setFontSize(11).setItalic());
        document.add(personalInfo);

        document.add(new Paragraph("\n"));

        // Phần II: Tiền sử bệnh
        addSectionTitle(document, "PHẦN II: TIỀN SỬ BỆNH CỦA ĐỐI TƯỢNG KHÁM SỨC KHỎE", robotoFont);

        Paragraph medicalHistory = new Paragraph()
                .add(new Text("Trong phần này, người khám sức khỏe cần khai báo các thông tin liên quan đến tiền sử bệnh lý, bao gồm:\n\n")
                        .setFont(robotoFont)
                        .setFontSize(11))
                .add(new Text("• Tiền sử bệnh gia đình: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Đánh dấu vào ô \"Có\" hoặc \"Không\" theo danh mục bệnh lý do bác sĩ cung cấp.\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("• Tiền sử bệnh cá nhân: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Ghi rõ các bệnh lý từng mắc phải hoặc đang điều trị.\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("• Câu hỏi bổ sung: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Nếu có các vấn đề sức khỏe khác chưa được đề cập, người khám cần khai báo đầy đủ.\n\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("Thông tin này rất quan trọng, giúp bác sĩ có cơ sở để đánh giá tình trạng sức khỏe tổng quát của bệnh nhân.")
                        .setFont(robotoFont).setFontSize(11).setItalic());
        document.add(medicalHistory);

        document.add(new Paragraph("\n"));

        // Phần III: Nội dung khám sức khỏe
        addSectionTitle(document, "PHẦN III: NỘI DUNG KHÁM SỨC KHỎE", robotoFont);

        Paragraph examContent = new Paragraph()
                .add(new Text("Nội dung khám sức khỏe trong mẫu giấy kết quả khám bệnh bao gồm các mục sau:\n\n")
                        .setFont(robotoFont)
                        .setFontSize(11))
                .add(new Text("• Khám thể lực: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Đánh giá chiều cao, cân nặng, chỉ số BMI, mạch, huyết áp, phân loại thể lực.\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("• Khám lâm sàng: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Bác sĩ chuyên khoa thực hiện kiểm tra các hệ cơ quan như nội khoa, ngoại khoa – da liễu, sản phụ khoa, mắt, tai – mũi – họng, răng – hàm – mặt.\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("• Khám cận lâm sàng: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Gồm các xét nghiệm máu, xét nghiệm nước tiểu, chẩn đoán hình ảnh nếu cần.\n").setFont(robotoFont).setFontSize(11))
                .add(new Text("• Kết luận sức khỏe: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Bác sĩ tổng hợp kết quả và đưa ra kết luận cuối cùng, xác định người khám có đủ sức khỏe đáp ứng yêu cầu công việc hay không.")
                        .setFont(robotoFont).setFontSize(11));
        document.add(examContent);

        document.add(new Paragraph("\n"));

        // Add test results section
        addSectionTitle(document, "KẾT QUẢ XÉT NGHIỆM STI", robotoFont);

        // Create table for test results
        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 2, 2, 3}));
        table.setWidth(UnitValue.createPercentValue(100));

        // Add headers
        table.addHeaderCell(new Cell().add(new Paragraph("Tên xét nghiệm").setFont(robotoFont).setBold().setFontSize(11)));
        table.addHeaderCell(new Cell().add(new Paragraph("Kết quả").setFont(robotoFont).setBold().setFontSize(11)));
        table.addHeaderCell(new Cell().add(new Paragraph("Trạng thái").setFont(robotoFont).setBold().setFontSize(11)));
        table.addHeaderCell(new Cell().add(new Paragraph("Thời gian").setFont(robotoFont).setBold().setFontSize(11)));

        // Add data rows
        for (TestResult result : results) {
            table.addCell(new Cell().add(new Paragraph(result.getTestName()).setFont(robotoFont).setFontSize(10)));
            table.addCell(new Cell().add(new Paragraph(result.getResult()).setFont(robotoFont).setFontSize(10)));
            table.addCell(new Cell().add(new Paragraph(result.getStatus().name()).setFont(robotoFont).setFontSize(10)));
            table.addCell(new Cell().add(new Paragraph(result.getGeneratedAt().format(DATE_FORMATTER)).setFont(robotoFont).setFontSize(10)));
        }

        document.add(table);

        // Add footer
        document.add(new Paragraph("\n"));
        Paragraph footer = new Paragraph()
                .add(new Text("Ghi chú: ").setFont(robotoFont).setBold().setFontSize(11))
                .add(new Text("Kết quả xét nghiệm này chỉ có giá trị trong thời gian quy định và cần được bảo quản cẩn thận.")
                        .setFont(robotoFont).setFontSize(11).setItalic());
        document.add(footer);

        document.close();
        return baos.toByteArray();
    }

    private void addSectionTitle(Document document, String title, PdfFont font) {
        Paragraph sectionTitle = new Paragraph(title)
                .setFont(font)
                .setFontSize(14)
                .setBold()
                .setTextAlignment(TextAlignment.LEFT);
        document.add(sectionTitle);
        document.add(new Paragraph("\n"));
    }

    private byte[] generateExcelReport(List<TestResult> results) throws Exception {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("STI Test Results");

        // Create header style
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // Create title
        Row titleRow = sheet.createRow(0);
        Cell titleCell = (Cell) titleRow.createCell(0);
        ((org.apache.poi.ss.usermodel.Cell) titleCell).setCellValue("KẾT QUẢ KHÁM SỨC KHỎE - XÉT NGHIỆM STI");
        CellStyle titleStyle = workbook.createCellStyle();
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleStyle.setFont(titleFont);
        ((org.apache.poi.ss.usermodel.Cell) titleCell).setCellStyle(titleStyle);

        // Add empty row
        sheet.createRow(1);

        // Create headers
        String[] headers = {"Tên xét nghiệm", "Kết quả", "Trạng thái", "Thời gian tạo"};
        Row headerRow = sheet.createRow(2);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = (Cell) headerRow.createCell(i);
            ((org.apache.poi.ss.usermodel.Cell) cell).setCellValue(headers[i]);
            ((org.apache.poi.ss.usermodel.Cell) cell).setCellStyle(headerStyle);
        }

        // Add data rows
        int rowNum = 3;
        for (TestResult result : results) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(result.getTestName());
            row.createCell(1).setCellValue(result.getResult());
            row.createCell(2).setCellValue(result.getStatus().name());
            row.createCell(3).setCellValue(result.getGeneratedAt().format(DATE_FORMATTER));
        }

        // Add note
        Row noteRow = sheet.createRow(rowNum + 1);
        Cell noteCell = (Cell) noteRow.createCell(0);
        ((org.apache.poi.ss.usermodel.Cell) noteCell).setCellValue("Ghi chú: Kết quả xét nghiệm này chỉ có giá trị trong thời gian quy định và cần được bảo quản cẩn thận.");
        CellStyle noteStyle = workbook.createCellStyle();
        Font noteFont = workbook.createFont();
        noteFont.setItalic(true);
        noteStyle.setFont(noteFont);
        ((org.apache.poi.ss.usermodel.Cell) noteCell).setCellStyle(noteStyle);

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Merge title cells
        sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 3));
        sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(rowNum + 1, rowNum + 1, 0, 3));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        workbook.write(baos);
        workbook.close();

        return baos.toByteArray();
    }
}
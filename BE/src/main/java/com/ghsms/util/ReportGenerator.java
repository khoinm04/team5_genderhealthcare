package com.ghsms.util;

import com.ghsms.file_enum.ReportFormat;
import com.ghsms.model.TestResult;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class ReportGenerator {

    public byte[] generateReport(List<TestResult> results, ReportFormat format) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            if (format == ReportFormat.PDF) {
                Document document = new Document();
                PdfWriter.getInstance(document, baos);
                document.open();
                document.add(new Paragraph("Kết quả xét nghiệm STI"));
                for (TestResult result : results) {
                    document.add(new Paragraph("Test: " + result.getTestName() + ", Result: " + result.getResult()));
                }
                document.close();
            } else if (format == ReportFormat.EXCEL) {
                Workbook workbook = new XSSFWorkbook();
                Sheet sheet = workbook.createSheet("Test Results");
                String[] headers = {"Test Name", "Result", "Status", "Generated At"};
                Row headerRow = sheet.createRow(0);
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i]);
                }

                int rowNum = 1;
                for (TestResult result : results) {
                    Row row = sheet.createRow(rowNum++);
                    row.createCell(0).setCellValue(result.getTestName());
                    row.createCell(1).setCellValue(result.getResult());
                    row.createCell(2).setCellValue(result.getStatus().name());
                    row.createCell(3).setCellValue(result.getGeneratedAt().toString());
                }

                workbook.write(baos);
                workbook.close();
            }
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating report: " + e.getMessage());
        }
    }
}
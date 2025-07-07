package com.ghsms.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin // Cho phép frontend gọi API
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra file rỗng
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File rỗng");
            }

            // Tạo thư mục nếu chưa tồn tại
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Lấy đuôi file và kiểm tra
            String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            String extension = getFileExtension(originalFilename).toLowerCase();

            List<String> allowedExtensions = List.of(".jpg", ".jpeg", ".png", ".gif", ".webp");
            if (!allowedExtensions.contains(extension)) {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ ảnh có định dạng: " + allowedExtensions);
            }

            // Tạo tên file ngẫu nhiên an toàn
            String fileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(fileName).normalize();

            // Chống path traversal
            if (!filePath.toAbsolutePath().startsWith(uploadPath)) {
                return ResponseEntity.status(400).body("Đường dẫn không hợp lệ");
            }

            // Lưu file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Trả về đường dẫn ảnh (tùy thuộc vào WebMvcConfigurer)
            String fileUrl = "/uploads/images/" + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi khi upload ảnh: " + e.getMessage());
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf(".");
        return (dotIndex != -1) ? filename.substring(dotIndex) : "";
    }
}

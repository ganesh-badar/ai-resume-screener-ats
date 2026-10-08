package com.ats.screener.service.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@Slf4j
public class LocalStorageServiceImpl implements StorageService {

    @Value("${app.storage.local-dir:./uploads/resumes}")
    private String uploadDir;

    @Override
    public String uploadFile(String key, MultipartFile file) {
        try {
            Path targetPath = Paths.get(uploadDir).resolve(key).normalize();
            Files.createDirectories(targetPath.getParent());
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Persisted resume to local storage: {}", targetPath.toAbsolutePath());
            return "file://" + targetPath.toAbsolutePath();
        } catch (IOException e) {
            log.error("Failed to persist file locally", e);
            throw new RuntimeException("Could not save file to disk", e);
        }
    }

    @Override
    public InputStream downloadFile(String key) {
        try {
            Path targetPath = Paths.get(uploadDir).resolve(key).normalize();
            if (!Files.exists(targetPath)) {
                throw new IOException("File does not exist at path: " + targetPath.toAbsolutePath());
            }
            return Files.newInputStream(targetPath);
        } catch (IOException e) {
            log.error("Failed to read file from local storage: {}", key, e);
            throw new RuntimeException("Could not read file from storage", e);
        }
    }
}

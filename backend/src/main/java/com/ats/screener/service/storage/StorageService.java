package com.ats.screener.service.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

/**
 * Strategy Pattern:
 * Decouples upload and retrieval business logic from underlying storage mechanism.
 * Implementations:
 * - LocalStorageServiceImpl: Uses local disk for zero-dependency local dev.
 * - S3StorageServiceImpl: Uses AWS S3 SDK for production cloud storage.
 */
public interface StorageService {
    String uploadFile(String key, MultipartFile file);
    InputStream downloadFile(String key);
}

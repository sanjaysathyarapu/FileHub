package com.example.FileHub.service.File;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.example.FileHub.dao.FileDTO;

import java.io.IOException;

public interface FileService {
    FileDTO uploadToS3(Long userId, MultipartFile file);


    MultipartFile convertFileToMultipartFile(java.io.File file) throws IOException;

    String convertDocxToHtmlFromUrl(String cloudFrontUrl);

    ResponseEntity<?> convertHTMLToDOCX(String htmlContent, Long fileId);

    public void deleteFromS3(Long userId, Long fileId);
}

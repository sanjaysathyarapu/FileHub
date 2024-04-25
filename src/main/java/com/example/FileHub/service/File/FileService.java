package com.example.FileHub.service.File;

import org.springframework.web.multipart.MultipartFile;

import com.example.FileHub.dao.FileDTO;

public interface FileService {
    FileDTO uploadToS3(Long userId, MultipartFile file);
}

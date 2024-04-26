package com.example.FileHub.service.File;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.sql.Timestamp;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.FileHub.config.AwsProperties;
import com.example.FileHub.dao.FileDTO;
import com.example.FileHub.entity.File;
import com.example.FileHub.repository.FileRepository;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class FileServiceImpl implements FileService {
    @Autowired

    private final FileRepository fileRepository;
    private final AwsProperties awsProperties;
    private final S3Client s3Client;
    private final String bucketName;
    // private String bucketName = "mytestbucketforfileupload";

    @Autowired
    public FileServiceImpl(FileRepository fileRepository, AwsProperties awsProperties, S3Client s3Client) {
        this.fileRepository = fileRepository;
        this.awsProperties = awsProperties;
        this.s3Client = s3Client;
        this.bucketName = awsProperties.getBucketName();
    }

    @Override
    public FileDTO uploadToS3(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String fileName = file.getOriginalFilename();
        String fileKey = userId + "/" + file.getOriginalFilename();

        Optional<File> existingFile = fileRepository.getByFileNameAndUserId(fileName, userId);
        if (existingFile.isPresent()) {
            throw new IllegalStateException("File already exists for this user.");
        }
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();

        try {
            ByteBuffer fileByteBuffer = ByteBuffer.wrap(file.getBytes());
            RequestBody requestBody = RequestBody.fromByteBuffer(fileByteBuffer);

            s3Client.putObject(putObjectRequest, requestBody);
            File fileEntity = new File();
            fileEntity.setFileName(file.getOriginalFilename());
            fileEntity.setFileType(getFileExtension(file.getOriginalFilename()));
            fileEntity.setFileSize(String.valueOf(file.getSize()));
            fileEntity.setFileURL("https://" + bucketName + ".s3.amazonaws.com/" + fileKey);
            fileEntity.setUserId(userId);
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            fileEntity.setUploadedAt(currentTimestamp);
            fileEntity.setLastEditedAt(currentTimestamp);
            fileRepository.save(fileEntity);

            FileDTO fileDTO = new FileDTO();
            fileDTO.setFileName(fileEntity.getFileName());
            fileDTO.setFileType(fileEntity.getFileType());
            fileDTO.setFileSize(fileEntity.getFileSize());
            fileDTO.setFileURL(fileEntity.getFileURL());
            fileDTO.setUploadedAt(fileEntity.getUploadedAt());
            fileDTO.setLastEditedAt(currentTimestamp);

            return fileDTO;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

}
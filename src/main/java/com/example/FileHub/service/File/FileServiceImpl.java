package com.example.FileHub.service.File;

import java.io.*;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.Optional;


import com.aspose.words.Document;
import com.aspose.words.HtmlSaveOptions;
import com.aspose.words.SaveFormat;
import com.example.FileHub.entity.User;
import org.apache.commons.io.FileUtils;
import com.example.FileHub.entity.User;
import com.example.FileHub.repository.SharedFileRepository;
import com.example.FileHub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.FileHub.config.AwsProperties;
import com.example.FileHub.dao.FileDTO;
import com.example.FileHub.entity.File;
import com.example.FileHub.repository.FileRepository;


import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class FileServiceImpl implements FileService {
    @Autowired


    private final FileRepository fileRepository;
    private final SharedFileRepository sharedFileRepository;
    private final AwsProperties awsProperties;
    private final S3Client s3Client;
    private final String bucketName;

    private final UserRepository userRepository;

    // private String bucketName = "mytestbucketforfileupload";

    @Autowired
    public FileServiceImpl(FileRepository fileRepository, AwsProperties awsProperties, S3Client s3Client, UserRepository userRepository,SharedFileRepository sharedFileRepository) {
        this.fileRepository = fileRepository;
        this.awsProperties = awsProperties;
        this.s3Client = s3Client;
        this.bucketName = awsProperties.getBucketName();
        this.userRepository = userRepository;
        this.sharedFileRepository = sharedFileRepository;
    }

    @Override
    public FileDTO uploadToS3(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String fileName = file.getOriginalFilename();
        String fileKey = userId + "/" + file.getOriginalFilename();



        String contentType = determineContentType(fileName);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .contentType(contentType)
                .build();

        try {
            ByteBuffer fileByteBuffer = ByteBuffer.wrap(file.getBytes());
            RequestBody requestBody = RequestBody.fromByteBuffer(fileByteBuffer);

            s3Client.putObject(putObjectRequest, requestBody);


            File fileEntity = new File();
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            FileDTO fileDTO = new FileDTO();


            Optional<File> existingFile = fileRepository.getByFileNameAndUserId(fileName, userId);
            if (existingFile.isPresent()) {
                existingFile.get().setLastEditedAt(currentTimestamp);
                existingFile.get().setFileURL("https://dxkn0p0al1ucf.cloudfront.net/"+fileKey);
                fileRepository.save(existingFile.get());
            } else {
                fileEntity.setFileName(file.getOriginalFilename());
                fileEntity.setFileType(getFileExtension(file.getOriginalFilename()));
                fileEntity.setFileSize(String.valueOf(file.getSize()));
                fileEntity.setFileURL("https://dxkn0p0al1ucf.cloudfront.net/"+ fileKey);
                fileEntity.setUserId(userId);
                fileEntity.setUploadedAt(currentTimestamp);
                fileEntity.setLastEditedAt(currentTimestamp);
                fileRepository.save(fileEntity);

                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                user.setNoOfFilesUploaded(user.getNoOfFilesUploaded() + 1);
                userRepository.save(user);

                fileDTO.setFileId(fileEntity.getFileId());
                fileDTO.setFileName(fileEntity.getFileName());
                fileDTO.setFileType(fileEntity.getFileType());
                fileDTO.setFileSize(fileEntity.getFileSize());
                fileDTO.setFileURL(fileEntity.getFileURL());
                fileDTO.setUploadedAt(fileEntity.getUploadedAt());
                fileDTO.setLastEditedAt(currentTimestamp);
            }

            return fileDTO;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public void deleteFromS3(Long userId, Long fileId) {

        File fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!fileEntity.getUserId().equals(userId)) {
            throw new SecurityException("User not authorized to delete this file");
        }
        if (sharedFileRepository.existsByFile(fileEntity)) {
            try {
                int cnt = sharedFileRepository.findAllByFile(fileEntity).size();
                sharedFileRepository.deleteByFile(fileEntity);
                if(user.getNoOfFilesShared() >= cnt)
                    user.setNoOfFilesShared(user.getNoOfFilesShared() - cnt);
            } catch (Exception e) {
                System.out.println("Failed to delete from shared files table: " + e.getMessage());
            }
        }
        String fileKey = userId + "/" + fileEntity.getFileName();
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
        fileRepository.deleteById(fileId);
        if(user.getNoOfFilesUploaded() > 0)
            user.setNoOfFilesUploaded(user.getNoOfFilesUploaded() - 1);
        userRepository.save(user);
    }



    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    private String determineContentType(String fileName) {
        String fileExtension = getFileExtension(fileName);
        if (fileExtension.equalsIgnoreCase("pdf")) {
            return "application/pdf";
        } else if (fileExtension.equalsIgnoreCase("docx")) {
            return "application/msword";
        } else {
            return "application/octet-stream";
        }
    }

    @Override
    public MultipartFile convertFileToMultipartFile(java.io.File file) throws IOException {
        FileInputStream fileInputStream = new FileInputStream(file);
        return new MockMultipartFile(
                file.getName(),      // Name of the file
                file.getName(),      // Original filename
                "application/msword",  // Content type
                fileInputStream     // InputStream containing file content
        );
    }

    @Override
    public String convertDocxToHtmlFromUrl(String cloudFrontUrl) {
        try {
            // Load the document from the CloudFront URL

            URL wordUrl = new URL(cloudFrontUrl);
            java.io.File wordFile = new java.io.File("src/main/resources/public/files/wordTemp.docx");
            FileUtils.copyURLToFile(wordUrl, wordFile);

            Document doc = new Document(wordFile.getAbsolutePath());

            HtmlSaveOptions htmlSaveOptions = new HtmlSaveOptions();
            htmlSaveOptions.setExportImagesAsBase64(true);

            java.io.File tempHtmlFile = java.io.File.createTempFile("temp", ".html");
            doc.save(tempHtmlFile.getAbsolutePath(), htmlSaveOptions);

//            doc.save("wordToHTML.html", SaveFormat.HTML);


            // Return the HTML content
            return FileUtils.readFileToString(tempHtmlFile, StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error converting DOCX to HTML";
        }
    }

    @Override
    public ResponseEntity<?> convertHTMLToDOCX(String htmlContent, Long fileId) {
        Optional<File> file = fileRepository.findById(fileId);

        try {
            // Load HTML content into a Document
            Document doc = new Document(new ByteArrayInputStream(htmlContent.getBytes(StandardCharsets.UTF_8)));

            java.io.File docxFile = new java.io.File("src/main/resources/public/files/edited/" + file.get().getFileName());


            // Save the Document as a DOCX file
            doc.save(docxFile.getAbsolutePath(), SaveFormat.DOCX);
            MultipartFile multipartFile = convertFileToMultipartFile(docxFile);
            uploadToS3(file.get().getUserId(), multipartFile);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("Successfully saved");
    }


}
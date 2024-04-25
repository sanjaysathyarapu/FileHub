package com.example.FileHub.dao;

import java.sql.Timestamp;

public class FileDTO {
    private Long fileId;
    private String fileName;
    private String fileType;
    private Timestamp uploadedAt;
    private Timestamp lastEditedAt;
    private String fileSize;
    private String fileURL;

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Timestamp getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Timestamp uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Timestamp getLastEditedAt() {
        return lastEditedAt;
    }

    public void setLastEditedAt(Timestamp lastEditedAt) {
        this.lastEditedAt = lastEditedAt;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileURL() {
        return fileURL;
    }

    public void setFileURL(String fileURL) {
        this.fileURL = fileURL;
    }
}

package com.example.FileHub.dao;

public class UserDao {
    private String email;
    private int noOfFilesUploaded;
    private int noOfFilesShared;

    public UserDao(String email, int noOfFilesUploaded, int noOfFilesShared) {
        this.email = email;
        this.noOfFilesUploaded = noOfFilesUploaded;
        this.noOfFilesShared = noOfFilesShared;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getNoOfFilesUploaded() {
        return noOfFilesUploaded;
    }

    public void setNoOfFilesUploaded(int noOfFilesUploaded) {
        this.noOfFilesUploaded = noOfFilesUploaded;
    }

    public int getNoOfFilesShared() {
        return noOfFilesShared;
    }

    public void setNoOfFilesShared(int noOfFilesShared) {
        this.noOfFilesShared = noOfFilesShared;
    }
}

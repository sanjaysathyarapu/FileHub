package com.example.FileHub.dao;

public class UserStatsDTO {
    private int noOfFilesUploaded;
    private int noOfFilesShared;

    public UserStatsDTO(int noOfFilesUploaded, int noOfFilesShared) {
        this.noOfFilesUploaded = noOfFilesUploaded;
        this.noOfFilesShared = noOfFilesShared;
    }


}
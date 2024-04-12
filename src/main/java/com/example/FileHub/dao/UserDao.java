package com.example.FileHub.dao;

public class UserDao {

    String email;

    public UserDao(String email, String password) {
        this.email = email;

    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

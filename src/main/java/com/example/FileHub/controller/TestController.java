package com.example.FileHub.controller;

import com.example.FileHub.entity.File;
import com.example.FileHub.entity.User;
import com.example.FileHub.repository.FileRepository;
import com.example.FileHub.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class TestController {

    private final UserRepository userRepository;
    private final FileRepository fileRepository;

    public TestController(UserRepository userRepository, FileRepository fileRepository) {
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
    }

    @GetMapping("/addUser")
    public ResponseEntity<?> addUserToDatabase() {

        User user = new User();
        user.setEmail("test@filehub.com");
        userRepository.save(user);

        return new ResponseEntity<>(user,HttpStatus.ACCEPTED);
    }

    @GetMapping("/addfile")
    public ResponseEntity<?> addFileToDatabase() {
        User user = userRepository.findByEmail("test@filehub.com");
        File file = new File();
        file.setFileName("Test File");
        file.setFileType(".doc");
        file.setFileSize("20kb");
        file.setUploadedAt(Timestamp.valueOf(LocalDateTime.now()));
        file.setLastEditedAt(Timestamp.valueOf(LocalDateTime.now()));
        file.setFileURL("https://www.google.com");
        file.setUserId(user.getUserId());
        fileRepository.save(file);

        return new ResponseEntity<>(file,HttpStatus.ACCEPTED);
    }





}

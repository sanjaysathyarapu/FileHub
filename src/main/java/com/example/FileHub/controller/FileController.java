package com.example.FileHub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.FileHub.dao.FileDTO;
import com.example.FileHub.entity.File;
import com.example.FileHub.entity.User;
import com.example.FileHub.repository.FileRepository;
import com.example.FileHub.repository.UserRepository;
import com.example.FileHub.service.File.FileService;

@RestController
@RequestMapping("/file")
@CrossOrigin(origins = "http://localhost:3000")

public class FileController {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final FileRepository fileRepository;

    @Autowired

    private FileService fileService;

    public FileController(UserRepository userRepository, FileRepository fileRepository, FileService fileService) {
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.fileService = fileService;
    }

    @GetMapping("/all")
    public List<File> getAllFiles(@RequestParam("userEmail") String userEmail) {
        signUpIfUserDoesNotExist(userEmail);
        User user = userRepository.findByEmail(userEmail);
        return fileRepository.findFilesByUserId(user.getUserId());
    }

    @PostMapping(path = "{userEmail}/upload/", consumes = "multipart/form-data")
    public ResponseEntity<FileDTO> uploadFileToS3Bucket(@PathVariable("userEmail") String userEmail,
            @RequestParam("file") MultipartFile file) {
        User user = userRepository.findByEmail(userEmail);
        FileDTO fileDTO = fileService.uploadToS3(user.getUserId(), file);
        return ResponseEntity.ok(fileDTO);
    }

    // @PostMapping(path = "{userId}/upload/", consumes = "multipart/form-data")
    // public ResponseEntity<FileDTO> uploadFileToS3Bucket(@PathVariable("userId")
    // Long userId,
    // @RequestParam("file") MultipartFile file) {
    // User user = userRepository.findByEmail("example@gmail.com");
    // FileDTO fileDTO = fileService.uploadToS3(user.getUserId(), file);
    // return ResponseEntity.ok(fileDTO);
    // }

    private void signUpIfUserDoesNotExist(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            User newUser = new User();
            newUser.setEmail(userEmail);
            userRepository.save(newUser);
        }
    }
}

package com.example.FileHub.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.FileHub.dao.UserStatsDTO;
import com.example.FileHub.entity.SharedFile;
import com.example.FileHub.service.File.SharingService;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @Autowired
    private SharingService sharingService;

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

    @PostMapping("/{fileId}/share")
    public ResponseEntity<?> shareFile(@PathVariable Long fileId, @RequestParam("userEmail") String userEmail) {
        sharingService.shareFileWithUser(fileId, userEmail);
        return ResponseEntity.ok("File shared successfully");
    }

    @GetMapping("/shared-with")
    public ResponseEntity<List<SharedFile>> getFilesSharedWith(@RequestParam String userEmail) {
        List<SharedFile> sharedFiles = sharingService.getAllFilesSharedWith(userEmail);
        return ResponseEntity.ok(sharedFiles);
    }


//    @GetMapping("/user/{userId}/stats")
//    public ResponseEntity<Map<String, Integer>> getUserStats(@PathVariable Long userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("User not found"));
//
//        Map<String, Integer> stats = new HashMap<>();
//        stats.put("noOfFilesUploaded", user.getNoOfFilesUploaded());
//        stats.put("noOfFilesShared", user.getNoOfFilesShared());
//
//        return ResponseEntity.ok(stats);
//    }

    @GetMapping("/user/stats")
    public ResponseEntity<Map<String, Integer>> getUserStats(@RequestParam String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Map<String, Integer> stats = new HashMap<>();
        stats.put("noOfFilesUploaded", user.getNoOfFilesUploaded());
        stats.put("noOfFilesShared", user.getNoOfFilesShared());

        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/{userEmail}/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable("userEmail") String userEmail,
                                             @PathVariable Long fileId) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        fileService.deleteFromS3(user.getUserId(), fileId);
        return ResponseEntity.ok("File deleted successfully");
    }

}
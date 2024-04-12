package com.example.FileHub.controller;

import com.example.FileHub.entity.File;
import com.example.FileHub.entity.User;
import com.example.FileHub.repository.FileRepository;
import com.example.FileHub.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/file")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    private final UserRepository userRepository;
    private final FileRepository fileRepository;

    public FileController(UserRepository userRepository, FileRepository fileRepository) {
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
    }

    @GetMapping("/all")
    public List<File> getAllFiles(@RequestParam("userEmail") String userEmail) {
        signUpIfUserDoesNotExist(userEmail);
        User user = userRepository.findByEmail(userEmail);
        return fileRepository.findFilesByUserId(user.getUserId());
    }

    private void signUpIfUserDoesNotExist(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if( user == null) {
            User newUser = new User();
            newUser.setEmail(userEmail);
            userRepository.save(newUser);
        }
    }
}

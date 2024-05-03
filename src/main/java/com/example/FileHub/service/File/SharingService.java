package com.example.FileHub.service.File;

import com.example.FileHub.entity.File;
import com.example.FileHub.entity.SharedFile;
import com.example.FileHub.entity.User;
import com.example.FileHub.repository.FileRepository;
import com.example.FileHub.repository.SharedFileRepository;
import com.example.FileHub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;



@Service
public class SharingService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SharedFileRepository sharedFileRepository;

    public List<SharedFile> getAllFilesSharedWith(String email) {
        return sharedFileRepository.findAllSharedWith(email);
    }

    @Transactional
    public void shareFileWithUser(Long fileId, String sharedWithEmail) {
        File file = fileRepository.findByFileId(fileId);
        if (file == null) {
            throw new IllegalArgumentException("File not found");
        }
        Long userId = file.getUserId();
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User sharedWith = userRepository.findByEmail(sharedWithEmail);
        if (sharedWith == null) {
            throw new IllegalArgumentException("User not found");
        }
        SharedFile sharedFile = new SharedFile();
        sharedFile.setFile(file);
        sharedFile.setOwner(userRepository.findByUserId(file.getUserId()));
        sharedFile.setSharedWith(sharedWith);
        sharedFileRepository.save(sharedFile);

        owner.setNoOfFilesShared(owner.getNoOfFilesShared() + 1);
        userRepository.save(owner);




    }
}

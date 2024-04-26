package com.example.FileHub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.FileHub.entity.File;

public interface FileRepository extends JpaRepository<File, Long> {

    List<File> findFilesByUserId(Long userId);

    Optional<File> getByFileNameAndUserId(String fileName, Long userId);

    File findByFileId(Long fileId);
}

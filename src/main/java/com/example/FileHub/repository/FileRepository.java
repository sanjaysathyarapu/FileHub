package com.example.FileHub.repository;

import com.example.FileHub.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {

    List<File> findFilesByUserId(Long userId);
}

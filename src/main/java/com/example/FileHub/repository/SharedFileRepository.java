package com.example.FileHub.repository;

import com.example.FileHub.entity.File;
import com.example.FileHub.entity.SharedFile;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
@Transactional
public interface SharedFileRepository extends JpaRepository<SharedFile, Long> {
    @Query("SELECT sf FROM SharedFile sf WHERE sf.sharedWith.email = :email")
    List<SharedFile> findAllSharedWith(@Param("email") String email);
    void deleteByFile(File file);
    boolean existsByFile(File file);
    List<SharedFile> findAllByFile(File file);
}
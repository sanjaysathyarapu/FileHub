package com.example.FileHub.entity;

import java.sql.Timestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "file")
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long fileId;

    @Column(name = "fileName", unique = true, nullable = false)
    private String fileName;

    @Column(name = "fileType", nullable = false)
    private String fileType;

    @Column(name = "uploadedAt", nullable = false)
    private Timestamp uploadedAt;

    @Column(name = "lastEditedAt", nullable = false)
    private Timestamp lastEditedAt;

    @Column(name = "fileSize", nullable = false)
    private String fileSize;

    @Column(name = "userId", nullable = false)
    private Long userId;

    @Column(name = "fileURL", unique = true, nullable = false)
    private String fileURL;

    @PrePersist
    protected void onCreate() {
        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
        uploadedAt = currentTimestamp;
        lastEditedAt = currentTimestamp;
    }

    @PreUpdate
    protected void onUpdate() {
        lastEditedAt = new Timestamp(System.currentTimeMillis());
    }
}

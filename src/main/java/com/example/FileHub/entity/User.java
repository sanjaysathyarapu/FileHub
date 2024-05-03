package com.example.FileHub.entity;

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
@Table(name = "user")
public class User {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "noOfFilesUploaded", nullable = false)
    private Integer noOfFilesUploaded = 0;

    @Column(name = "noOfFilesShared", nullable = false)
    private Integer noOfFilesShared = 0;


}

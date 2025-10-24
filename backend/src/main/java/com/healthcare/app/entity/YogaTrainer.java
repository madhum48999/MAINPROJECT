package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class YogaTrainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String experience;
    private String certifications;
    private String bio;
    private Double hourlyRate;
    private String availability;
    private String status = "ACTIVE"; // ACTIVE, INACTIVE
    private String profileImageUrl;
}

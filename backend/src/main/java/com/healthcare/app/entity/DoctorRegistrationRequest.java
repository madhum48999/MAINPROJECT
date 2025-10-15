package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DoctorRegistrationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // keep numeric ID for request tracking

    private String name;

    private String specialization;

    private String phone;

    private String licenseNumber;

    private String hospitalId; // String for consistency

    @Column(unique = true)
    private String email;

    private String password;

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
}

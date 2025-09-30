package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DoctorRegistrationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String doctorName;

    private String specialization;

    private Long hospitalId;

    @Column(unique = true)
    private String email;

    private String password;

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
}

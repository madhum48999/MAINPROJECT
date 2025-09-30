package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String doctorName;

    @Column(unique = true)
    private String email;

    private String password;

    private String specialization;

    private Long hospitalId; // nullable for independent doctors

    private String role = "DOCTOR";
}

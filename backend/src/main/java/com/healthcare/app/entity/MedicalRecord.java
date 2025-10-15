package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientId;   // String to match Patient.pid
    private String doctorId;    // String to match Doctor.did
    private String hospitalId;  // String to match Hospital.hid

    private LocalDate visitDate;
    private LocalDateTime createdAt;

    private String diagnosis;
    private String treatment;
    private String prescription;
    private String report;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

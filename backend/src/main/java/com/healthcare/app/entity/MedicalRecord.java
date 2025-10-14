package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

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

    private String prescription;

    private String report;
}

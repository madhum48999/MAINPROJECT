package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Doctor {
    @Id
    private String did;

    private String doctorName;

    @Column(unique = true)
    private String email;

    private String password;

    private String specialization;

    private String hospitalId; // changed to String (consistent with Hospital.hid)

    private String role = "DOCTOR";
}

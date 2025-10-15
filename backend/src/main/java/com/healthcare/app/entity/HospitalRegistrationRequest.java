package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class HospitalRegistrationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String hospitalName;

    @Column(unique = true)
    private String email;

    private String address;

    private String city;

    private String state;

    private String zipCode;

    private String phone;

    private String password;

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
}

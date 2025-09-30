package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hospitalName;

    @Column(unique = true)
    private String email;

    private String password;

    private String address;

    private String contact;

    private String role = "HOSPITAL";
}

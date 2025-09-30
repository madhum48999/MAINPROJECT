package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Column(unique = true)
    private String patientId;

    private String role = "USER";

    private String phone;

    private String firstName;
    private String lastName;
    private Integer age;
    private Double weight;
    private String gender;
    private String dateOfBirth;
}

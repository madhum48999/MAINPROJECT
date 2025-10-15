package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Hospital {
    @Id
    private String hid;

    private String name;

    private String hospitalName;

    @Column(unique = true)
    private String email;

    private String password;

    private String address;

    private String city;

    private String state;

    private String zipCode;

    private String phone;

    private String contact;

    private String role = "HOSPITAL";

    private String status = "ACTIVE";
}

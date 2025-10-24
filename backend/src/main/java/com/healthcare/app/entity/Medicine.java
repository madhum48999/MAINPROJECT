package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String dosage;
    private String manufacturer;
    private Double price;
    private Integer stockQuantity;
    private String category;
    private String sideEffects;
    private String contraindications;
    private Boolean requiresPrescription = false;
    private String status = "ACTIVE"; // ACTIVE, INACTIVE
}

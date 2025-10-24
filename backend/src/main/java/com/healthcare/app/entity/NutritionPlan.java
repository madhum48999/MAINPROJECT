package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class NutritionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private String dietaryRestrictions;
    private String goals;
    private String mealPlan;
    private String exerciseRecommendations;
    private String supplements;
    private LocalDateTime createdDate;
    private LocalDateTime expiryDate;
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, CANCELLED
    private String notes;
}

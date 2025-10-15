package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reviewerId; // Patient who is reviewing

    private String reviewedEntityId; // Doctor or Hospital ID

    @Enumerated(EnumType.STRING)
    private ReviewedEntityType reviewedEntityType; // DOCTOR or HOSPITAL

    private Integer rating; // 1-5 stars

    private String reviewText;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ReviewedEntityType {
        DOCTOR, HOSPITAL
    }
}

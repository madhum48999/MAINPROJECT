package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientId;

    private String type; // e.g., "appointment_confirmed", "reminder", "result_available"

    private String message;

    private LocalDateTime createdAt;

    private boolean isRead = false;
}

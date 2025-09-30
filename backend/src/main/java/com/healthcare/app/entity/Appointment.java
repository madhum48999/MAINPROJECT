package com.healthcare.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientId;

    private Long doctorId;

    private Long hospitalId;

    private LocalDateTime dateTime;

    private String status = "BOOKED"; // BOOKED, COMPLETED, CANCELLED
}

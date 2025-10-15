package com.healthcare.app.repository;

import com.healthcare.app.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByPatientIdOrderByCreatedAtDesc(String patientId);
    List<Notification> findByPatientIdAndIsReadFalseOrderByCreatedAtDesc(String patientId);
}

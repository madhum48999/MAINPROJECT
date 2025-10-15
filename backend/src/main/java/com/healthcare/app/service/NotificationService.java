package com.healthcare.app.service;

import com.healthcare.app.entity.Notification;
import com.healthcare.app.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getNotificationsByPatient(String patientId) {
        return notificationRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public Notification saveNotification(Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        return notificationRepository.save(notification);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    public void createAppointmentNotification(String patientId, String message, String type) {
        Notification notification = new Notification();
        notification.setPatientId(patientId);
        notification.setType(type);
        notification.setMessage(message);
        saveNotification(notification);
    }
}

package com.healthcare.app.repository;

import com.healthcare.app.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByPatientId(String patientId);
    List<Reminder> findByPatientIdOrderByReminderDateAsc(String patientId);
    List<Reminder> findByReminderDate(LocalDate reminderDate);
}

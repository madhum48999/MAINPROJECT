package com.healthcare.app.service;

import com.healthcare.app.entity.Patient;
import com.healthcare.app.entity.Reminder;
import com.healthcare.app.repository.PatientRepository;
import com.healthcare.app.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private SmsService smsService;

    public List<Reminder> getRemindersByPatient(String patientId) {
        return reminderRepository.findByPatientId(patientId);
    }

    public Reminder saveReminder(Reminder reminder) {
        Reminder savedReminder = reminderRepository.save(reminder);
        // Send SMS to patient
        Optional<Patient> patientOpt = patientRepository.findByPatientId(reminder.getPatientId());
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            String message = "Reminder: " + reminder.getMessage() + " on " + reminder.getReminderDate();
            smsService.sendSms(patient.getPhone(), message);
        }
        return savedReminder;
    }
}

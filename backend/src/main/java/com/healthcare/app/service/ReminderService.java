package com.healthcare.app.service;

import com.healthcare.app.entity.Patient;
import com.healthcare.app.entity.Reminder;
import com.healthcare.app.repository.PatientRepository;
import com.healthcare.app.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
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

    @Autowired
    private EmailService emailService;

    public List<Reminder> getRemindersByPatient(String patientId) {
        return reminderRepository.findByPatientIdOrderByReminderDateAsc(patientId);
    }

    public Reminder saveReminder(Reminder reminder) {
        Reminder savedReminder = reminderRepository.save(reminder);
        // Send SMS notification immediately for new reminders
        sendReminderNotification(savedReminder);
        return savedReminder;
    }

    private void sendReminderNotification(Reminder reminder) {
        Optional<Patient> patientOpt = patientRepository.findByPatientId(reminder.getPatientId());
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();

            // Send SMS
            String smsMessage = "Reminder: " + reminder.getMessage() + " on " + reminder.getReminderDate();
            smsService.sendSms(patient.getPhone(), smsMessage);

            // Send Email (logged for development)
            String emailSubject = "Healthcare Reminder - " + reminder.getType();
            String emailMessage = String.format(
                "Dear %s,\n\n" +
                "This is a reminder for your healthcare appointment.\n\n" +
                "Details: %s\n" +
                "Date: %s\n\n" +
                "Please ensure you are prepared for your appointment.\n\n" +
                "Best regards,\n" +
                "Healthcare Appointment System",
                patient.getName(),
                reminder.getMessage(),
                reminder.getReminderDate()
            );

            System.out.println("=== REMINDER EMAIL ===");
            System.out.println("To: " + patient.getEmail());
            System.out.println("Subject: " + emailSubject);
            System.out.println("Message:\n" + emailMessage);
            System.out.println("======================");
        }
    }

    // Scheduled task to send daily reminders (runs at 9 AM every day)
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendDailyReminders() {
        LocalDate today = LocalDate.now();
        List<Reminder> todaysReminders = reminderRepository.findByReminderDate(today);

        for (Reminder reminder : todaysReminders) {
            sendReminderNotification(reminder);
        }

        if (!todaysReminders.isEmpty()) {
            System.out.println("Sent " + todaysReminders.size() + " daily reminders for " + today);
        }
    }

    // Scheduled task to send advance reminders (runs at 9 AM every day)
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendAdvanceReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Reminder> advanceReminders = reminderRepository.findByReminderDate(tomorrow);

        for (Reminder reminder : advanceReminders) {
            Optional<Patient> patientOpt = patientRepository.findByPatientId(reminder.getPatientId());
            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();

                // Send advance SMS
                String smsMessage = "Tomorrow's Reminder: " + reminder.getMessage();
                smsService.sendSms(patient.getPhone(), smsMessage);

                // Send advance Email
                String emailSubject = "Tomorrow's Healthcare Reminder - " + reminder.getType();
                String emailMessage = String.format(
                    "Dear %s,\n\n" +
                    "This is an advance reminder for your healthcare appointment tomorrow.\n\n" +
                    "Details: %s\n" +
                    "Date: %s\n\n" +
                    "Please ensure you are prepared for your appointment.\n\n" +
                    "Best regards,\n" +
                    "Healthcare Appointment System",
                    patient.getName(),
                    reminder.getMessage(),
                    reminder.getReminderDate()
                );

                System.out.println("=== ADVANCE REMINDER EMAIL ===");
                System.out.println("To: " + patient.getEmail());
                System.out.println("Subject: " + emailSubject);
                System.out.println("Message:\n" + emailMessage);
                System.out.println("==============================");
            }
        }

        if (!advanceReminders.isEmpty()) {
            System.out.println("Sent " + advanceReminders.size() + " advance reminders for " + tomorrow);
        }
    }
}

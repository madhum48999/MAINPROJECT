package com.healthcare.app.service;

import com.healthcare.app.entity.Appointment;
import com.healthcare.app.entity.Availability;
import com.healthcare.app.entity.Patient;
import com.healthcare.app.entity.Reminder;
import com.healthcare.app.repository.AppointmentRepository;
import com.healthcare.app.repository.AvailabilityRepository;
import com.healthcare.app.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    public Appointment bookAppointment(Appointment appointment) {
        // Check if doctor is available at the time
        List<Availability> availabilities = availabilityRepository.findByDoctorIdAndAvailableDate(
            appointment.getDoctorId(), appointment.getDateTime().toLocalDate());
        boolean isAvailable = availabilities.stream()
            .anyMatch(a -> a.getAvailableTimeSlot().equals(appointment.getDateTime().toLocalTime()));
        if (!isAvailable) {
            throw new RuntimeException("Doctor not available at this time");
        }
        appointment.setStatus("BOOKED");

        // Save the appointment
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Create reminder for the appointment
        createAppointmentReminder(savedAppointment);

        // Create notification for the appointment
        createAppointmentNotification(savedAppointment);

        // Send confirmation email
        sendAppointmentConfirmation(savedAppointment);

        return savedAppointment;
    }

    private void createAppointmentReminder(Appointment appointment) {
        Reminder reminder = new Reminder();
        reminder.setPatientId(appointment.getPatientId());
        reminder.setType("appointment");
        reminder.setMessage("You have an appointment scheduled for " + appointment.getDateTime().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a")));
        reminder.setReminderDate(appointment.getDateTime().toLocalDate().minusDays(1)); // Reminder 1 day before
        reminderService.saveReminder(reminder);
    }

    private void createAppointmentNotification(Appointment appointment) {
        String message = "Your appointment has been confirmed for " + appointment.getDateTime().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));
        notificationService.createAppointmentNotification(appointment.getPatientId(), message, "appointment_confirmed");
    }

    private void sendAppointmentConfirmation(Appointment appointment) {
        Optional<Patient> patientOpt = patientRepository.findByPatientId(appointment.getPatientId());
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            String subject = "Appointment Confirmation - Healthcare System";
            String message = String.format(
                "Dear %s,\n\n" +
                "Your appointment has been successfully booked!\n\n" +
                "Appointment Details:\n" +
                "Date & Time: %s\n" +
                "Doctor ID: %s\n" +
                "Hospital ID: %s\n\n" +
                "Please arrive 15 minutes early for your appointment.\n\n" +
                "If you need to reschedule or cancel, please contact us.\n\n" +
                "Best regards,\n" +
                "Healthcare Appointment System",
                patient.getName(),
                appointment.getDateTime().format(java.time.format.DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")),
                appointment.getDoctorId(),
                appointment.getHospitalId()
            );

            // For now, just log the email (as per EmailService implementation)
            System.out.println("=== APPOINTMENT CONFIRMATION EMAIL ===");
            System.out.println("To: " + patient.getEmail());
            System.out.println("Subject: " + subject);
            System.out.println("Message:\n" + message);
            System.out.println("=====================================");
        }
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByHospital(Long hospitalId) {
        return appointmentRepository.findByHospitalId(hospitalId);
    }

    public Appointment updateAppointmentStatus(Long id, String status) {
        var appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        }
        throw new RuntimeException("Appointment not found");
    }

    public Appointment createAppointment(Appointment appointment) {
        appointment.setStatus("BOOKED");
        return appointmentRepository.save(appointment);
    }

    public Appointment rescheduleAppointment(Long appointmentId, LocalDateTime newDateTime) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (!appointmentOpt.isPresent()) {
            throw new RuntimeException("Appointment not found");
        }

        Appointment appointment = appointmentOpt.get();

        // Check if the appointment can be rescheduled (e.g., not cancelled or completed)
        if ("CANCELLED".equals(appointment.getStatus()) || "COMPLETED".equals(appointment.getStatus())) {
            throw new RuntimeException("Cannot reschedule a cancelled or completed appointment");
        }

        // Check if doctor is available at the new time
        List<Availability> availabilities = availabilityRepository.findByDoctorIdAndAvailableDate(
            appointment.getDoctorId(), newDateTime.toLocalDate());
        boolean isAvailable = availabilities.stream()
            .anyMatch(a -> a.getAvailableTimeSlot().equals(newDateTime.toLocalTime()));
        if (!isAvailable) {
            throw new RuntimeException("Doctor not available at the new time");
        }

        // Update the appointment date and time
        appointment.setDateTime(newDateTime);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Update reminder
        updateAppointmentReminder(updatedAppointment);

        // Create notification for rescheduling
        createRescheduleNotification(updatedAppointment);

        // Send reschedule confirmation email
        sendRescheduleConfirmation(updatedAppointment);

        return updatedAppointment;
    }

    private void updateAppointmentReminder(Appointment appointment) {
        // For simplicity, we'll create a new reminder. In a real app, you might want to update existing ones.
        Reminder reminder = new Reminder();
        reminder.setPatientId(appointment.getPatientId());
        reminder.setType("appointment");
        reminder.setMessage("You have a rescheduled appointment for " + appointment.getDateTime().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a")));
        reminder.setReminderDate(appointment.getDateTime().toLocalDate().minusDays(1));
        reminderService.saveReminder(reminder);
    }

    private void createRescheduleNotification(Appointment appointment) {
        String message = "Your appointment has been rescheduled to " + appointment.getDateTime().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));
        notificationService.createAppointmentNotification(appointment.getPatientId(), message, "appointment_rescheduled");
    }

    private void sendRescheduleConfirmation(Appointment appointment) {
        Optional<Patient> patientOpt = patientRepository.findByPatientId(appointment.getPatientId());
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            String subject = "Appointment Rescheduled - Healthcare System";
            String message = String.format(
                "Dear %s,\n\n" +
                "Your appointment has been successfully rescheduled!\n\n" +
                "Updated Appointment Details:\n" +
                "Date & Time: %s\n" +
                "Doctor ID: %s\n" +
                "Hospital ID: %s\n\n" +
                "Please arrive 15 minutes early for your appointment.\n\n" +
                "If you need to cancel, please contact us.\n\n" +
                "Best regards,\n" +
                "Healthcare Appointment System",
                patient.getName(),
                appointment.getDateTime().format(java.time.format.DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")),
                appointment.getDoctorId(),
                appointment.getHospitalId()
            );

            // For now, just log the email
            System.out.println("=== APPOINTMENT RESCHEDULE EMAIL ===");
            System.out.println("To: " + patient.getEmail());
            System.out.println("Subject: " + subject);
            System.out.println("Message:\n" + message);
            System.out.println("====================================");
        }
    }
}

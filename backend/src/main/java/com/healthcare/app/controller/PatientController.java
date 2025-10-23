package com.healthcare.app.controller;

import com.healthcare.app.entity.Appointment;
import com.healthcare.app.entity.Availability;
import com.healthcare.app.entity.Doctor;
import com.healthcare.app.entity.MedicalRecord;
import com.healthcare.app.entity.Patient;
import com.healthcare.app.entity.Reminder;
import com.healthcare.app.entity.Notification;
import com.healthcare.app.service.AppointmentService;
import com.healthcare.app.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;

    public PatientController(PatientService patientService, AppointmentService appointmentService) {
        this.patientService = patientService;
        this.appointmentService = appointmentService;
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.bookAppointment(appointment));
    }

    @GetMapping("/appointments/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/history/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalHistory(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getMedicalHistory(patientId));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(patientService.getAllDoctors());
    }

    @GetMapping("/availabilities/{doctorId}")
    public ResponseEntity<List<Availability>> getAvailabilities(@PathVariable Long doctorId) {
        return ResponseEntity.ok(patientService.getAvailabilitiesByDoctor(doctorId));
    }

    @GetMapping("/appointments/upcoming/{patientId}")
    public ResponseEntity<List<Appointment>> getUpcomingAppointments(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getUpcomingAppointments(patientId));
    }

    @GetMapping("/prescriptions/{patientId}")
    public ResponseEntity<List<String>> getPrescriptions(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getPrescriptions(patientId));
    }

    @GetMapping("/lab-results/{patientId}")
    public ResponseEntity<List<String>> getLabResults(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getLabResults(patientId));
    }

    @GetMapping("/reminders/{patientId}")
    public ResponseEntity<List<Reminder>> getReminders(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getReminders(patientId));
    }

    @GetMapping("/notifications/{patientId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getNotifications(patientId));
    }

    @GetMapping("/profile")
    public ResponseEntity<Patient> getProfile(@RequestHeader("Authorization") String authHeader) {
        String patientId = patientService.extractPatientIdFromAuthHeader(authHeader);
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }

    @PutMapping("/profile")
    public ResponseEntity<Patient> updateProfile(@RequestHeader("Authorization") String authHeader, @RequestBody Patient updatedPatient) {
        String patientId = patientService.extractPatientIdFromAuthHeader(authHeader);
        return ResponseEntity.ok(patientService.updatePatientProfile(patientId, updatedPatient));
    }

    @PutMapping("/appointments/{appointmentId}/reschedule")
    public ResponseEntity<Appointment> rescheduleAppointment(@PathVariable Long appointmentId, @RequestBody LocalDateTime newDateTime) {
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(appointmentId, newDateTime));
    }
}

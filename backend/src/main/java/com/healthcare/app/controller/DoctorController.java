package com.healthcare.app.controller;

import com.healthcare.app.entity.Appointment;
import com.healthcare.app.entity.Availability;
import com.healthcare.app.entity.Doctor;
import com.healthcare.app.entity.MedicalRecord;
import com.healthcare.app.entity.Patient;
import com.healthcare.app.service.AppointmentService;
import com.healthcare.app.service.AvailabilityService;
import com.healthcare.app.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final AvailabilityService availabilityService;

    public DoctorController(DoctorService doctorService, AppointmentService appointmentService, AvailabilityService availabilityService) {
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
        this.availabilityService = availabilityService;
    }

    @GetMapping("/specialization")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@RequestParam String specialization) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specialization));
    }

    @GetMapping("/appointments/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getAppointmentsByDoctor(doctorId));
    }

    @GetMapping("/availability/{doctorId}")
    public ResponseEntity<List<Availability>> getAvailability(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getAvailabilityByDoctor(doctorId));
    }

    @PostMapping("/availability")
    public ResponseEntity<Availability> setAvailability(@RequestBody Availability availability) {
        return ResponseEntity.ok(doctorService.setAvailability(availability));
    }

    @DeleteMapping("/availability/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/records/{doctorId}")
    public ResponseEntity<List<MedicalRecord>> getRecords(@PathVariable String doctorId) {
        return ResponseEntity.ok(doctorService.getRecordsByDoctor(doctorId));
    }

    @PostMapping("/records")
    public ResponseEntity<MedicalRecord> createRecord(@RequestBody MedicalRecord record) {
        return ResponseEntity.ok(doctorService.createRecord(record));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Patient> getPatientProfile(@PathVariable String patientId) {
        return ResponseEntity.ok(doctorService.getPatientByPatientId(patientId));
    }
}

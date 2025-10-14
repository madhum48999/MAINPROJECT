package com.healthcare.app.controller;

import com.healthcare.app.entity.*;
import com.healthcare.app.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/hospital-requests")
    public ResponseEntity<List<HospitalRegistrationRequest>> getPendingHospitalRequests() {
        return ResponseEntity.ok(adminService.getPendingHospitalRequests());
    }

    @GetMapping("/doctor-requests")
    public ResponseEntity<List<DoctorRegistrationRequest>> getPendingDoctorRequests() {
        return ResponseEntity.ok(adminService.getPendingDoctorRequests());
    }

    @PostMapping("/approve/hospital/{requestId}")
    public ResponseEntity<Hospital> approveHospital(@PathVariable Long requestId) {
        return ResponseEntity.ok(adminService.approveHospital(requestId));
    }

    @PostMapping("/approve/doctor/{requestId}")
    public ResponseEntity<Doctor> approveDoctor(@PathVariable Long requestId) {
        return ResponseEntity.ok(adminService.approveDoctor(requestId));
    }

    @PostMapping("/reject/hospital/{requestId}")
    public ResponseEntity<Void> rejectHospital(@PathVariable Long requestId) {
        adminService.rejectHospital(requestId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reject/doctor/{requestId}")
    public ResponseEntity<Void> rejectDoctor(@PathVariable Long requestId) {
        adminService.rejectDoctor(requestId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    @PostMapping("/patients")
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(adminService.addPatient(patient));
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        adminService.deletePatient(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/hospitals")
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        return ResponseEntity.ok(adminService.getAllHospitals());
    }

    @PostMapping("/hospitals")
    public ResponseEntity<Hospital> addHospital(@RequestBody Hospital hospital) {
        return ResponseEntity.ok(adminService.addHospital(hospital));
    }

    @DeleteMapping("/hospitals/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable String id) {
        adminService.deleteHospital(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @PostMapping("/doctors")
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(adminService.addDoctor(doctor));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        adminService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(adminService.getAllAppointments());
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(adminService.createAppointment(appointment));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestBody String status) {
        return ResponseEntity.ok(adminService.updateAppointmentStatus(id, status));
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        adminService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/hospital-request/{id}")
    public ResponseEntity<HospitalRegistrationRequest> getHospitalRequest(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getHospitalRequest(id));
    }

    @GetMapping("/doctor-request/{id}")
    public ResponseEntity<DoctorRegistrationRequest> getDoctorRequest(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getDoctorRequest(id));
    }
}

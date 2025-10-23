  package com.healthcare.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.app.entity.Appointment;
import com.healthcare.app.entity.Hospital;
import com.healthcare.app.entity.MedicalRecord;
import com.healthcare.app.service.AppointmentService;
import com.healthcare.app.service.HospitalService;

@RestController
@RequestMapping("/api/hospital")
public class HospitalController {

    private final HospitalService hospitalService;
    private final AppointmentService appointmentService;

    public HospitalController(HospitalService hospitalService, AppointmentService appointmentService) {
        this.hospitalService = hospitalService;
        this.appointmentService = appointmentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospital(@PathVariable String id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    @GetMapping("/appointments/{hospitalId}")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(hospitalService.getAppointmentsByHospital(hospitalId));
    }

    @GetMapping("/records/{hospitalId}")
    public ResponseEntity<List<MedicalRecord>> getRecords(@PathVariable String hospitalId) {
        return ResponseEntity.ok(hospitalService.getRecordsByHospital(hospitalId));
    }

    @PostMapping("/records")
    public ResponseEntity<MedicalRecord> createRecord(@RequestBody MedicalRecord record) {
        return ResponseEntity.ok(hospitalService.createRecord(record));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status));
    }
}

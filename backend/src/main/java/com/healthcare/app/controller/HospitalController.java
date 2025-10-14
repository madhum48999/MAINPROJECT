package com.healthcare.app.controller;

import com.healthcare.app.entity.Appointment;
import com.healthcare.app.entity.MedicalRecord;
import com.healthcare.app.service.AppointmentService;
import com.healthcare.app.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private AppointmentService appointmentService;

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

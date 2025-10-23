package com.healthcare.app.service;

import com.healthcare.app.entity.Appointment;
import com.healthcare.app.entity.Hospital;
import com.healthcare.app.entity.MedicalRecord;
import com.healthcare.app.repository.AppointmentRepository;
import com.healthcare.app.repository.HospitalRepository;
import com.healthcare.app.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public HospitalService(HospitalRepository hospitalRepository,
                           AppointmentRepository appointmentRepository,
                           MedicalRecordRepository medicalRecordRepository) {
        this.hospitalRepository = hospitalRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
    }

    public Hospital getHospitalById(String id) {
        return hospitalRepository.findById(id).orElseThrow(() -> new RuntimeException("Hospital not found"));
    }

    public List<Appointment> getAppointmentsByHospital(Long hospitalId) {
        return appointmentRepository.findByHospitalId(hospitalId);
    }

    public List<MedicalRecord> getRecordsByHospital(String hospitalId) {
        return medicalRecordRepository.findAll().stream()
            .filter(r -> r.getHospitalId().equals(hospitalId))
            .toList();
    }

    public MedicalRecord createRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }
}

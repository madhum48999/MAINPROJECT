package com.healthcare.app.service;

import com.healthcare.app.entity.Appointment;
import com.healthcare.app.entity.Availability;
import com.healthcare.app.entity.Doctor;
import com.healthcare.app.entity.MedicalRecord;
import com.healthcare.app.repository.AppointmentRepository;
import com.healthcare.app.repository.AvailabilityRepository;
import com.healthcare.app.repository.DoctorRepository;
import com.healthcare.app.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final AvailabilityRepository availabilityRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final com.healthcare.app.repository.PatientRepository patientRepository;

    public DoctorService(DoctorRepository doctorRepository,
                         AppointmentRepository appointmentRepository,
                         AvailabilityRepository availabilityRepository,
                         MedicalRecordRepository medicalRecordRepository,
                         com.healthcare.app.repository.PatientRepository patientRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
    }

    public Doctor getDoctorById(String id) {
        return doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Availability> getAvailabilityByDoctor(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId);
    }

    public Availability setAvailability(Availability availability) {
        return availabilityRepository.save(availability);
    }

    public List<MedicalRecord> getRecordsByDoctor(String doctorId) {
        return medicalRecordRepository.findAll().stream()
            .filter(r -> r.getDoctorId().equals(doctorId))
            .toList();
    }

    public MedicalRecord createRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }

    public com.healthcare.app.entity.Patient getPatientByPatientId(String patientId) {
        return patientRepository.findByPatientId(patientId).orElseThrow(() -> new RuntimeException("Patient not found"));
    }
}

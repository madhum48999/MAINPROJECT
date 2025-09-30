package com.healthcare.app.service;

import com.healthcare.app.entity.*;
import com.healthcare.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    @Autowired
    private HospitalRegistrationRequestRepository hospitalRequestRepository;

    @Autowired
    private DoctorRegistrationRequestRepository doctorRequestRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<HospitalRegistrationRequest> getPendingHospitalRequests() {
        return hospitalRequestRepository.findAll().stream()
            .filter(req -> "PENDING".equals(req.getStatus()))
            .toList();
    }

    public List<DoctorRegistrationRequest> getPendingDoctorRequests() {
        return doctorRequestRepository.findAll().stream()
            .filter(req -> "PENDING".equals(req.getStatus()))
            .toList();
    }

    public Hospital approveHospital(Long requestId) {
        var requestOpt = hospitalRequestRepository.findById(requestId);
        if (requestOpt.isPresent()) {
            HospitalRegistrationRequest request = requestOpt.get();
            request.setStatus("APPROVED");
            hospitalRequestRepository.save(request);

            Hospital hospital = new Hospital();
            hospital.setHospitalName(request.getHospitalName());
            hospital.setEmail(request.getEmail());
            // Set a default password or generate one
            hospital.setPassword(passwordEncoder.encode("defaultPassword"));
            hospital.setRole("HOSPITAL");
            return hospitalRepository.save(hospital);
        }
        throw new RuntimeException("Request not found");
    }

    public Doctor approveDoctor(Long requestId) {
        var requestOpt = doctorRequestRepository.findById(requestId);
        if (requestOpt.isPresent()) {
            DoctorRegistrationRequest request = requestOpt.get();
            request.setStatus("APPROVED");
            doctorRequestRepository.save(request);

            Doctor doctor = new Doctor();
            doctor.setDoctorName(request.getDoctorName());
            doctor.setEmail(request.getEmail());
            doctor.setSpecialization(request.getSpecialization());
            // Set a default password or generate one
            doctor.setPassword(passwordEncoder.encode("defaultPassword"));
            doctor.setRole("DOCTOR");
            return doctorRepository.save(doctor);
        }
        throw new RuntimeException("Request not found");
    }

    public void rejectHospital(Long requestId) {
        var requestOpt = hospitalRequestRepository.findById(requestId);
        if (requestOpt.isPresent()) {
            HospitalRegistrationRequest request = requestOpt.get();
            request.setStatus("REJECTED");
            hospitalRequestRepository.save(request);
        }
    }

    public void rejectDoctor(Long requestId) {
        var requestOpt = doctorRequestRepository.findById(requestId);
        if (requestOpt.isPresent()) {
            DoctorRegistrationRequest request = requestOpt.get();
            request.setStatus("REJECTED");
            doctorRequestRepository.save(request);
        }
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient addPatient(Patient patient) {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        patient.setRole("USER");
        patient.setPatientId(java.util.UUID.randomUUID().toString());
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Hospital addHospital(Hospital hospital) {
        if (hospitalRepository.findByEmail(hospital.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        hospital.setRole("HOSPITAL");
        hospital.setPassword(passwordEncoder.encode(hospital.getPassword()));
        return hospitalRepository.save(hospital);
    }

    public void deleteHospital(Long id) {
        hospitalRepository.deleteById(id);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor addDoctor(Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        doctor.setRole("DOCTOR");
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        doctor.setHospitalId(null); // Can be updated later
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment createAppointment(Appointment appointment) {
        appointment.setStatus("BOOKED");
        return appointmentRepository.save(appointment);
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

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}

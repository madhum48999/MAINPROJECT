package com.healthcare.app.service;

import com.healthcare.app.entity.*;
import com.healthcare.app.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    private final HospitalRegistrationRequestRepository hospitalRequestRepository;
    private final DoctorRegistrationRequestRepository doctorRequestRepository;
    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppointmentRepository appointmentRepository;
    private final MedicineRepository medicineRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final NutritionPlanRepository nutritionPlanRepository;
    private final YogaTrainerRepository yogaTrainerRepository;

    public AdminService(HospitalRegistrationRequestRepository hospitalRequestRepository,
                       DoctorRegistrationRequestRepository doctorRequestRepository,
                       HospitalRepository hospitalRepository,
                       DoctorRepository doctorRepository,
                       PatientRepository patientRepository,
                       PasswordEncoder passwordEncoder,
                       AppointmentRepository appointmentRepository,
                       MedicineRepository medicineRepository,
                       PrescriptionRepository prescriptionRepository,
                       NutritionPlanRepository nutritionPlanRepository,
                       YogaTrainerRepository yogaTrainerRepository) {
        this.hospitalRequestRepository = hospitalRequestRepository;
        this.doctorRequestRepository = doctorRequestRepository;
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.appointmentRepository = appointmentRepository;
        this.medicineRepository = medicineRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.nutritionPlanRepository = nutritionPlanRepository;
        this.yogaTrainerRepository = yogaTrainerRepository;
    }

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
            hospital.setHid(generateNextHospitalId());
            hospital.setName(request.getName());
            hospital.setHospitalName(request.getHospitalName());
            hospital.setAddress(request.getAddress());
            hospital.setCity(request.getCity());
            hospital.setState(request.getState());
            hospital.setZipCode(request.getZipCode());
            hospital.setPhone(request.getPhone());
            hospital.setEmail(request.getEmail());
            hospital.setPassword(passwordEncoder.encode(request.getPassword()));
            hospital.setRole("HOSPITAL");
            return hospitalRepository.save(hospital);
        }
        throw new RuntimeException("Request not found");
    }

    private String generateNextHospitalId() {
        Long maxId = hospitalRepository.findMaxId();
        if (maxId == null) {
            return "H001";
        }
        return String.format("H%03d", maxId + 1);
    }

    public Doctor approveDoctor(Long requestId) {
        var requestOpt = doctorRequestRepository.findById(requestId);
        if (requestOpt.isPresent()) {
            DoctorRegistrationRequest request = requestOpt.get();
            request.setStatus("APPROVED");
            doctorRequestRepository.save(request);

            Doctor doctor = new Doctor();
            doctor.setDid(generateNextDoctorId());
            doctor.setName(request.getName());
            doctor.setPhone(request.getPhone());
            doctor.setLicenseNumber(request.getLicenseNumber());
            doctor.setEmail(request.getEmail());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setPassword(passwordEncoder.encode(request.getPassword()));
            doctor.setRole("DOCTOR");
            return doctorRepository.save(doctor);
        }
        throw new RuntimeException("Request not found");
    }

    private String generateNextDoctorId() {
        Long maxId = doctorRepository.findMaxId();
        if (maxId == null) {
            return "D001";
        }
        return String.format("D%03d", maxId + 1);
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
        patient.setPid(generateNextPatientId());
        patient.setPatientId(java.util.UUID.randomUUID().toString());
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        return patientRepository.save(patient);
    }

    private String generateNextPatientId() {
        Long maxId = patientRepository.findMaxId();
        if (maxId == null) {
            return "P001";
        }
        return String.format("P%03d", maxId + 1);
    }

    public void deletePatient(String id) {
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

    public void deleteHospital(String id) {
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

    public void deleteDoctor(String id) {
        doctorRepository.deleteById(id);
    }

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

    public HospitalRegistrationRequest getHospitalRequest(Long id) {
        return hospitalRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
    }

    public DoctorRegistrationRequest getDoctorRequest(Long id) {
        return doctorRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
    }
}

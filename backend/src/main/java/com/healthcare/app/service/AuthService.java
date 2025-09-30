package com.healthcare.app.service;

import com.healthcare.app.config.JwtUtil;
import com.healthcare.app.entity.*;
import com.healthcare.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRegistrationRequestRepository hospitalRequestRepository;

    @Autowired
    private DoctorRegistrationRequestRepository doctorRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    public Hospital registerHospital(HospitalRegistrationRequest request) {
        Hospital hospital = new Hospital();
        hospital.setHospitalName(request.getHospitalName());
        hospital.setEmail(request.getEmail());
        hospital.setPassword(passwordEncoder.encode(request.getPassword()));
        hospital.setAddress(request.getAddress());
        hospital.setContact(request.getPhone());
        hospital.setRole("HOSPITAL");
        return hospitalRepository.save(hospital);
    }

    public Doctor registerDoctor(DoctorRegistrationRequest request) {
        if (doctorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        Doctor doctor = new Doctor();
        doctor.setDoctorName(request.getDoctorName());
        doctor.setEmail(request.getEmail());
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));
        doctor.setSpecialization(request.getSpecialization());
        doctor.setHospitalId(request.getHospitalId());
        doctor.setRole("DOCTOR");
        return doctorRepository.save(doctor);
    }

    public Patient registerPatient(Patient patient) {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        patient.setRole("USER");
        patient.setPatientId(UUID.randomUUID().toString());
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        return patientRepository.save(patient);
    }

    public String login(String email, String password) {
        // Check in Admins
        var adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                return jwtUtil.generateToken(admin.getId().toString(), admin.getRole());
            }
        }

        // Check in Patients
        var patientOpt = patientRepository.findByEmail(email);
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            if (passwordEncoder.matches(password, patient.getPassword())) {
                return jwtUtil.generateToken(patient.getPatientId(), patient.getRole());
            }
        }

        // Check in Hospitals
        var hospitalOpt = hospitalRepository.findByEmail(email);
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
            if (passwordEncoder.matches(password, hospital.getPassword())) {
                return jwtUtil.generateToken(hospital.getId().toString(), hospital.getRole());
            }
        }

        // Check in Doctors
        var doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            if (passwordEncoder.matches(password, doctor.getPassword())) {
                return jwtUtil.generateToken(doctor.getId().toString(), doctor.getRole());
            }
        }

        throw new RuntimeException("Invalid credentials");
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        // Check in Admins
        var adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(oldPassword, admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(newPassword));
                adminRepository.save(admin);
                return;
            } else {
                throw new RuntimeException("Invalid old password");
            }
        }

        // Check in Patients
        var patientOpt = patientRepository.findByEmail(email);
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            if (passwordEncoder.matches(oldPassword, patient.getPassword())) {
                patient.setPassword(passwordEncoder.encode(newPassword));
                patientRepository.save(patient);
                return;
            } else {
                throw new RuntimeException("Invalid old password");
            }
        }

        // Check in Hospitals
        var hospitalOpt = hospitalRepository.findByEmail(email);
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
            if (passwordEncoder.matches(oldPassword, hospital.getPassword())) {
                hospital.setPassword(passwordEncoder.encode(newPassword));
                hospitalRepository.save(hospital);
                return;
            } else {
                throw new RuntimeException("Invalid old password");
            }
        }

        // Check in Doctors
        var doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            if (passwordEncoder.matches(oldPassword, doctor.getPassword())) {
                doctor.setPassword(passwordEncoder.encode(newPassword));
                doctorRepository.save(doctor);
                return;
            } else {
                throw new RuntimeException("Invalid old password");
            }
        }

        throw new RuntimeException("User not found");
    }

    @Transactional
    public void forgotPassword(String email) {
        // Check if user exists
        boolean userExists = adminRepository.findByEmail(email).isPresent() ||
                           patientRepository.findByEmail(email).isPresent() ||
                           hospitalRepository.findByEmail(email).isPresent() ||
                           doctorRepository.findByEmail(email).isPresent();

        if (!userExists) {
            throw new RuntimeException("User not found");
        }

        // Clean up expired OTPs
        otpRepository.deleteExpiredOtps(LocalDateTime.now());

        // Generate OTP
        String otp = generateOtp();

        // Save OTP
        Otp otpEntity = new Otp();
        otpEntity.setEmail(email);
        otpEntity.setOtpCode(otp);
        otpEntity.setCreatedAt(LocalDateTime.now());
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpRepository.save(otpEntity);

        // Send email
        emailService.sendOtpEmail(email, otp);
    }

    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        // Verify OTP
        Optional<Otp> otpEntity = otpRepository.findByEmailAndOtpCodeAndUsedFalse(email, otp);
        if (otpEntity.isEmpty()) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        Otp validOtp = otpEntity.get();
        if (validOtp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        // Mark OTP as used
        otpRepository.markOtpAsUsed(email, otp);

        // Update password for the user
        updateUserPassword(email, newPassword);
    }

    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    private void updateUserPassword(String email, String newPassword) {
        // Check in Admins
        var adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode(newPassword));
            adminRepository.save(admin);
            return;
        }

        // Check in Patients
        var patientOpt = patientRepository.findByEmail(email);
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            patient.setPassword(passwordEncoder.encode(newPassword));
            patientRepository.save(patient);
            return;
        }

        // Check in Hospitals
        var hospitalOpt = hospitalRepository.findByEmail(email);
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
            hospital.setPassword(passwordEncoder.encode(newPassword));
            hospitalRepository.save(hospital);
            return;
        }

        // Check in Doctors
        var doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            doctor.setPassword(passwordEncoder.encode(newPassword));
            doctorRepository.save(doctor);
            return;
        }

        throw new RuntimeException("User not found");
    }
}

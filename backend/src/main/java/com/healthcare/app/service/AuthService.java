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

    private final PatientRepository patientRepository;
    private final AdminRepository adminRepository;
    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRegistrationRequestRepository hospitalRequestRepository;
    private final DoctorRegistrationRequestRepository doctorRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpRepository otpRepository;
    private final EmailService emailService;

    public AuthService(PatientRepository patientRepository,
                       AdminRepository adminRepository,
                       HospitalRepository hospitalRepository,
                       DoctorRepository doctorRepository,
                       HospitalRegistrationRequestRepository hospitalRequestRepository,
                       DoctorRegistrationRequestRepository doctorRequestRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       OtpRepository otpRepository,
                       EmailService emailService) {
        this.patientRepository = patientRepository;
        this.adminRepository = adminRepository;
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
        this.hospitalRequestRepository = hospitalRequestRepository;
        this.doctorRequestRepository = doctorRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    public Object register(RegistrationRequest request) {
        String role = request.getRole().toUpperCase();

        switch (role) {
            case "USER":
                Patient patient = new Patient();
                patient.setName(request.getName());
                patient.setEmail(request.getEmail());
                patient.setPassword(request.getPassword());
                patient.setPhone(request.getPhone());
                patient.setDateOfBirth(request.getDateOfBirth());
                patient.setGender(request.getGender());
                patient.setWeight(Double.parseDouble(request.getWeight()));
                return registerPatient(patient);
            case "DOCTOR":
                DoctorRegistrationRequest doctorRequest = new DoctorRegistrationRequest();
                doctorRequest.setName(request.getName());
                doctorRequest.setEmail(request.getEmail());
                doctorRequest.setPassword(request.getPassword());
                doctorRequest.setPhone(request.getPhone());
                doctorRequest.setSpecialization(request.getSpecialization());
                doctorRequest.setLicenseNumber(request.getLicenseNumber());
                return registerDoctor(doctorRequest);
            case "HOSPITAL":
                HospitalRegistrationRequest hospitalRequest = new HospitalRegistrationRequest();
                hospitalRequest.setName(request.getName());
                hospitalRequest.setEmail(request.getEmail());
                hospitalRequest.setPassword(request.getPassword());
                hospitalRequest.setPhone(request.getPhone());
                hospitalRequest.setHospitalName(request.getHospitalName());
                hospitalRequest.setAddress(request.getAddress());
                hospitalRequest.setCity(request.getCity());
                hospitalRequest.setState(request.getState());
                hospitalRequest.setZipCode(request.getZipCode());
                return registerHospital(hospitalRequest);
            default:
                throw new RuntimeException("Invalid role");
        }
    }

    public HospitalRegistrationRequest registerHospital(HospitalRegistrationRequest request) {
        if (hospitalRequestRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        return hospitalRequestRepository.save(request);
    }

    public DoctorRegistrationRequest registerDoctor(DoctorRegistrationRequest request) {
        if (doctorRequestRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        return doctorRequestRepository.save(request);
    }

    public Patient registerPatient(Patient patient) {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        patient.setRole("USER");
        patient.setPid(generateNextPatientId());
        patient.setPatientId(UUID.randomUUID().toString());
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

    private String generateNextDoctorId() {
        Long maxId = doctorRepository.findMaxId();
        if (maxId == null) {
            return "D001";
        }
        return String.format("D%03d", maxId + 1);
    }

    private String generateNextHospitalId() {
        Long maxId = hospitalRepository.findMaxId();
        if (maxId == null) {
            return "H001";
        }
        return String.format("H%03d", maxId + 1);
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
                return jwtUtil.generateToken(patient.getPid(), patient.getRole());
            }
        }

        // Check in Hospitals
        var hospitalOpt = hospitalRepository.findByEmail(email);
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
            if (passwordEncoder.matches(password, hospital.getPassword())) {
                return jwtUtil.generateToken(hospital.getHid(), hospital.getRole());
            }
        }

        // Check in Doctors
        var doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            if (passwordEncoder.matches(password, doctor.getPassword())) {
                return jwtUtil.generateToken(doctor.getDid(), doctor.getRole());
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

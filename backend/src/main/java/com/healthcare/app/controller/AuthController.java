package com.healthcare.app.controller;

import com.healthcare.app.entity.*;
import com.healthcare.app.repository.*;
import com.healthcare.app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final HospitalRegistrationRequestRepository hospitalRequestRepository;
    private final DoctorRegistrationRequestRepository doctorRequestRepository;
    private final PatientRepository patientRepository;
    private final AdminRepository adminRepository;
    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    public AuthController(AuthService authService, HospitalRegistrationRequestRepository hospitalRequestRepository,
                         DoctorRegistrationRequestRepository doctorRequestRepository, PatientRepository patientRepository,
                         AdminRepository adminRepository, HospitalRepository hospitalRepository, DoctorRepository doctorRepository) {
        this.authService = authService;
        this.hospitalRequestRepository = hospitalRequestRepository;
        this.doctorRequestRepository = doctorRequestRepository;
        this.patientRepository = patientRepository;
        this.adminRepository = adminRepository;
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/register/patient")
    public ResponseEntity<Patient> registerPatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(authService.registerPatient(patient));
    }

    @PostMapping("/register/hospital")
    public ResponseEntity<HospitalRegistrationRequest> registerHospital(@RequestBody HospitalRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerHospital(request));
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<DoctorRegistrationRequest> registerDoctor(@RequestBody DoctorRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerDoctor(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        return ResponseEntity.ok(authService.login(email, password));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        authService.changePassword(email, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("OTP sent to your email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successfully");
    }

    @GetMapping("/hospital-request-status/{id}")
    public ResponseEntity<String> getHospitalRequestStatus(@PathVariable Long id) {
        HospitalRegistrationRequest request = hospitalRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
        return ResponseEntity.ok(request.getStatus());
    }

    @GetMapping("/doctor-request-status/{id}")
    public ResponseEntity<String> getDoctorRequestStatus(@PathVariable Long id) {
        DoctorRegistrationRequest request = doctorRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
        return ResponseEntity.ok(request.getStatus());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Check in Admins
        var adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return ResponseEntity.ok(Map.of(
                "id", admin.getId().toString(),
                "name", admin.getName(),
                "email", admin.getEmail(),
                "role", admin.getRole()
            ));
        }

        // Check in Patients
        var patientOpt = patientRepository.findByEmail(email);
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            return ResponseEntity.ok(Map.of(
                "id", patient.getPid(),
                "name", patient.getName(),
                "email", patient.getEmail(),
                "role", patient.getRole()
            ));
        }

        // Check in Hospitals
        var hospitalOpt = hospitalRepository.findByEmail(email);
        if (hospitalOpt.isPresent()) {
            Hospital hospital = hospitalOpt.get();
            return ResponseEntity.ok(Map.of(
                "id", hospital.getHid(),
                "name", hospital.getName(),
                "email", hospital.getEmail(),
                "role", hospital.getRole()
            ));
        }

        // Check in Doctors
        var doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            return ResponseEntity.ok(Map.of(
                "id", doctor.getDid(),
                "name", doctor.getName(),
                "email", doctor.getEmail(),
                "role", doctor.getRole()
            ));
        }

        return ResponseEntity.notFound().build();
    }
}

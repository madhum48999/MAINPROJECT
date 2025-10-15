package com.healthcare.app.controller;

import com.healthcare.app.entity.*;
import com.healthcare.app.repository.HospitalRegistrationRequestRepository;
import com.healthcare.app.repository.DoctorRegistrationRequestRepository;
import com.healthcare.app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private HospitalRegistrationRequestRepository hospitalRequestRepository;

    @Autowired
    private DoctorRegistrationRequestRepository doctorRequestRepository;

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
}

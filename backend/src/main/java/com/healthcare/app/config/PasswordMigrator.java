package com.healthcare.app.config;

import com.healthcare.app.entity.Admin;
import com.healthcare.app.entity.Doctor;
import com.healthcare.app.entity.Hospital;
import com.healthcare.app.entity.Patient;
import com.healthcare.app.repository.AdminRepository;
import com.healthcare.app.repository.DoctorRepository;
import com.healthcare.app.repository.HospitalRepository;
import com.healthcare.app.repository.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Component
public class PasswordMigrator {

    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordMigrator(AdminRepository adminRepository, DoctorRepository doctorRepository,
                            HospitalRepository hospitalRepository, PatientRepository patientRepository,
                            PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void migratePasswords() {
        System.out.println("Starting password migration...");

        // Migrate Admin passwords
        List<Admin> admins = adminRepository.findAll();
        for (Admin admin : admins) {
            if (!isBCryptEncoded(admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(admin.getPassword()));
                adminRepository.save(admin);
                System.out.println("Migrated password for admin: " + admin.getEmail());
            }
        }

        // Migrate Patient passwords
        List<Patient> patients = patientRepository.findAll();
        for (Patient patient : patients) {
            if (!isBCryptEncoded(patient.getPassword())) {
                patient.setPassword(passwordEncoder.encode(patient.getPassword()));
                patientRepository.save(patient);
                System.out.println("Migrated password for patient: " + patient.getEmail());
            }
        }

        // Migrate Hospital passwords
        List<Hospital> hospitals = hospitalRepository.findAll();
        for (Hospital hospital : hospitals) {
            if (!isBCryptEncoded(hospital.getPassword())) {
                hospital.setPassword(passwordEncoder.encode(hospital.getPassword()));
                hospitalRepository.save(hospital);
                System.out.println("Migrated password for hospital: " + hospital.getEmail());
            }
        }

        // Migrate Doctor passwords
        List<Doctor> doctors = doctorRepository.findAll();
        for (Doctor doctor : doctors) {
            if (!isBCryptEncoded(doctor.getPassword())) {
                doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
                doctorRepository.save(doctor);
                System.out.println("Migrated password for doctor: " + doctor.getEmail());
            }
        }

        System.out.println("Password migration completed.");
    }

    private boolean isBCryptEncoded(String password) {
        // BCrypt passwords start with $2a$, $2b$, or $2y$
        return password != null && (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$"));
    }
}

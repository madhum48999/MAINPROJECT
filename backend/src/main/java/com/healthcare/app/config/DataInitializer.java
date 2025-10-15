package com.healthcare.app.config;

import com.healthcare.app.entity.Admin;
import com.healthcare.app.entity.Doctor;
import com.healthcare.app.entity.Hospital;
import com.healthcare.app.entity.Patient;
import com.healthcare.app.repository.AdminRepository;
import com.healthcare.app.repository.DoctorRepository;
import com.healthcare.app.repository.HospitalRepository;
import com.healthcare.app.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DataInitializer {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // Seed sample admin if not exists
        if (adminRepository.findByEmail("admin@example.com").isEmpty()) {
            Admin admin = new Admin();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("adminpass"));
            admin.setRole("ADMIN");
            adminRepository.save(admin);
        }

        // Seed sample patient if not exists
        if (patientRepository.findByEmail("patient@example.com").isEmpty()) {
            Patient patient = new Patient();
            patient.setPatientId("P001");
            patient.setName("John Doe");
            patient.setEmail("patient@example.com");
            patient.setPassword(passwordEncoder.encode("password"));
            patient.setRole("PATIENT");
            patientRepository.save(patient);
        }

        // Seed sample doctors if not exists
        if (doctorRepository.count() == 0) {
            String[][] doctorsData = {
                {"Dr. Madhu", "madhu@example.com", "General Medicine"},
                {"Dr. Rajesh", "rajesh@example.com", "Cardiology"},
                {"Dr. Priya", "priya@example.com", "Dermatology"},
                {"Dr. Anil", "anil@example.com", "Neurology"},
                {"Dr. Sunita", "sunita@example.com", "Orthopedics"},
                {"Dr. Vikram", "vikram@example.com", "Pediatrics"},
                {"Dr. Kavita", "kavita@example.com", "Gynecology"},
                {"Dr. Ramesh", "ramesh@example.com", "Ophthalmology"},
                {"Dr. Meera", "meera@example.com", "Psychiatry"},
                {"Dr. Suresh", "suresh@example.com", "Urology"},
                {"Dr. Anjali", "anjali@example.com", "Gastroenterology"},
                {"Dr. Deepak", "deepak@example.com", "Endocrinology"},
                {"Dr. Neha", "neha@example.com", "Nephrology"},
                {"Dr. Arjun", "arjun@example.com", "Pulmonology"},
                {"Dr. Pooja", "pooja@example.com", "Rheumatology"},
                {"Dr. Karan", "karan@example.com", "Oncology"},
                {"Dr. Simran", "simran@example.com", "Hematology"},
                {"Dr. Rohit", "rohit@example.com", "Infectious Diseases"},
                {"Dr. Aisha", "aisha@example.com", "Emergency Medicine"},
                {"Dr. Manoj", "manoj@example.com", "Radiology"}
            };

            for (String[] data : doctorsData) {
                Doctor doctor = new Doctor();
                doctor.setName(data[0]);
                doctor.setEmail(data[1]);
                doctor.setPassword(passwordEncoder.encode("password"));
                doctor.setSpecialization(data[2]);
                doctor.setHospitalId(null);
                doctor.setRole("DOCTOR");
                doctorRepository.save(doctor);
            }
        }

        // Seed sample hospital if not exists
        if (hospitalRepository.findByEmail("hospital@gmail.com").isEmpty()) {
            Hospital hospital = new Hospital();
            hospital.setHospitalName("General Hospital");
            hospital.setEmail("hospital@gmail.com");
            hospital.setPassword(passwordEncoder.encode("password"));
            hospital.setAddress("456 Oak Ave");
            hospital.setContact("987-654-3210");
            hospital.setRole("HOSPITAL");
            hospitalRepository.save(hospital);
        }
    }
}

package com.healthcare.app.repository;

import com.healthcare.app.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByPatientId(String patientId);
    Optional<Patient> findByNameAndPhone(String name, String phone);
}

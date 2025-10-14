package com.healthcare.app.repository;

import com.healthcare.app.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByPatientId(String patientId);
    Optional<Patient> findByNameAndPhone(String name, String phone);
    @Query("SELECT MAX(CAST(SUBSTRING(p.pid, 2) AS long)) FROM Patient p")
    Long findMaxId();
}

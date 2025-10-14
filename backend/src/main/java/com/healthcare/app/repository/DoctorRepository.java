package com.healthcare.app.repository;

import com.healthcare.app.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, String> {
    Optional<Doctor> findByEmail(String email);
    List<Doctor> findBySpecialization(String specialization);
    @Query("SELECT MAX(CAST(SUBSTRING(d.did, 2) AS long)) FROM Doctor d")
    Long findMaxId();
}

package com.healthcare.app.repository;

import com.healthcare.app.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientPid(String patientId);
    List<Prescription> findByDoctorDid(String doctorId);
    List<Prescription> findByStatus(String status);
}

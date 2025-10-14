package com.healthcare.app.repository;

import com.healthcare.app.entity.HospitalRegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HospitalRegistrationRequestRepository extends JpaRepository<HospitalRegistrationRequest, Long> {
    Optional<HospitalRegistrationRequest> findByEmail(String email);
}

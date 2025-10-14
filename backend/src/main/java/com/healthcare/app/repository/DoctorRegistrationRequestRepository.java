package com.healthcare.app.repository;

import com.healthcare.app.entity.DoctorRegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRegistrationRequestRepository extends JpaRepository<DoctorRegistrationRequest, Long> {
    Optional<DoctorRegistrationRequest> findByEmail(String email);
}

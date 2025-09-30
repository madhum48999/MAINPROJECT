package com.healthcare.app.repository;

import com.healthcare.app.entity.DoctorRegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRegistrationRequestRepository extends JpaRepository<DoctorRegistrationRequest, Long> {
}

package com.healthcare.app.repository;

import com.healthcare.app.entity.HospitalRegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRegistrationRequestRepository extends JpaRepository<HospitalRegistrationRequest, Long> {
}

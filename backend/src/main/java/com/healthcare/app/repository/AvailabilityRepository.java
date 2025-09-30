package com.healthcare.app.repository;

import com.healthcare.app.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByDoctorId(Long doctorId);
    List<Availability> findByDoctorIdAndAvailableDate(Long doctorId, LocalDate date);
}

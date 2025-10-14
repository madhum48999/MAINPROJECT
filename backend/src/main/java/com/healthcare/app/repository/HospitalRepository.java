package com.healthcare.app.repository;

import com.healthcare.app.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital, String> {
    Optional<Hospital> findByEmail(String email);
    @Query("SELECT MAX(CAST(SUBSTRING(h.hid, 2) AS long)) FROM Hospital h")
    Long findMaxId();
}

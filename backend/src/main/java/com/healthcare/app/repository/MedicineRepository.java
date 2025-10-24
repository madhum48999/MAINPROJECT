package com.healthcare.app.repository;

import com.healthcare.app.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByStatus(String status);
    List<Medicine> findByCategory(String category);
    List<Medicine> findByRequiresPrescription(Boolean requiresPrescription);
}

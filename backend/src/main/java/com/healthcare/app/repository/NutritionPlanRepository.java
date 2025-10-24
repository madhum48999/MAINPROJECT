package com.healthcare.app.repository;

import com.healthcare.app.entity.NutritionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NutritionPlanRepository extends JpaRepository<NutritionPlan, Long> {
    List<NutritionPlan> findByPatientPid(String patientId);
    List<NutritionPlan> findByDoctorDid(String doctorId);
    List<NutritionPlan> findByStatus(String status);
}

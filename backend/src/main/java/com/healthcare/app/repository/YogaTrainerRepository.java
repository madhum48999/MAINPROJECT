package com.healthcare.app.repository;

import com.healthcare.app.entity.YogaTrainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YogaTrainerRepository extends JpaRepository<YogaTrainer, Long> {
    List<YogaTrainer> findByStatus(String status);
    List<YogaTrainer> findBySpecialization(String specialization);
}

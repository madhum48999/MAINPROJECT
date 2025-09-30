package com.healthcare.app.repository;

import com.healthcare.app.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByHospitalId(Long hospitalId);
}

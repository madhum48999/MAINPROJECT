package com.healthcare.app.service;

import com.healthcare.app.entity.Appointment;
import com.healthcare.app.entity.Availability;
import com.healthcare.app.repository.AppointmentRepository;
import com.healthcare.app.repository.AvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    public Appointment bookAppointment(Appointment appointment) {
        // Check if doctor is available at the time
        List<Availability> availabilities = availabilityRepository.findByDoctorIdAndAvailableDate(
            appointment.getDoctorId(), appointment.getDateTime().toLocalDate());
        boolean isAvailable = availabilities.stream()
            .anyMatch(a -> a.getAvailableTimeSlot().equals(appointment.getDateTime().toLocalTime()));
        if (!isAvailable) {
            throw new RuntimeException("Doctor not available at this time");
        }
        appointment.setStatus("BOOKED");
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByHospital(Long hospitalId) {
        return appointmentRepository.findByHospitalId(hospitalId);
    }

    public Appointment updateAppointmentStatus(Long id, String status) {
        var appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        }
        throw new RuntimeException("Appointment not found");
    }

    public Appointment createAppointment(Appointment appointment) {
        appointment.setStatus("BOOKED");
        return appointmentRepository.save(appointment);
    }
}

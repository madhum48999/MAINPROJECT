package com.healthcare.app.service;

import com.healthcare.app.entity.Appointment;
import com.healthcare.app.entity.Availability;
import com.healthcare.app.entity.Doctor;
import com.healthcare.app.entity.MedicalRecord;
import com.healthcare.app.entity.Patient;
import com.healthcare.app.entity.Reminder;
import com.healthcare.app.repository.AppointmentRepository;
import com.healthcare.app.repository.AvailabilityRepository;
import com.healthcare.app.repository.DoctorRepository;
import com.healthcare.app.repository.MedicalRecordRepository;
import com.healthcare.app.config.JwtUtil;
import com.healthcare.app.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtUtil jwtUtil;

    public Patient getPatientById(String patientId) {
        return patientRepository.findByPatientId(patientId).orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getUpcomingAppointments(String patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .filter(appointment -> appointment.getDateTime().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    public List<MedicalRecord> getMedicalHistory(String patientId) {
        return medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<String> getPrescriptions(String patientId) {
        return medicalRecordRepository.findByPatientId(patientId).stream()
                .map(MedicalRecord::getPrescription)
                .filter(prescription -> prescription != null && !prescription.isEmpty())
                .collect(Collectors.toList());
    }

    public List<String> getLabResults(String patientId) {
        return medicalRecordRepository.findByPatientId(patientId).stream()
                .map(MedicalRecord::getReport)
                .filter(report -> report != null && !report.isEmpty())
                .collect(Collectors.toList());
    }

    public List<Reminder> getReminders(String patientId) {
        return reminderService.getRemindersByPatient(patientId);
    }

    public List<com.healthcare.app.entity.Notification> getNotifications(String patientId) {
        return notificationService.getNotificationsByPatient(patientId);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Availability> getAvailabilitiesByDoctor(Long doctorId) {
        List<Availability> availabilities = availabilityRepository.findByDoctorId(doctorId);
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return availabilities.stream()
                .filter(availability -> appointments.stream()
                        .noneMatch(appointment -> appointment.getDateTime().toLocalDate().equals(availability.getAvailableDate())
                                && appointment.getDateTime().toLocalTime().equals(availability.getAvailableTimeSlot())))
                .collect(Collectors.toList());
    }

    public Patient updatePatientProfile(String patientId, Patient updatedPatient) {
        Patient patient = getPatientById(patientId);
        patient.setName(updatedPatient.getName());
        patient.setEmail(updatedPatient.getEmail());
        patient.setPhone(updatedPatient.getPhone());
        patient.setFirstName(updatedPatient.getFirstName());
        patient.setLastName(updatedPatient.getLastName());
        patient.setAge(updatedPatient.getAge());
        patient.setWeight(updatedPatient.getWeight());
        patient.setGender(updatedPatient.getGender());
        patient.setDateOfBirth(updatedPatient.getDateOfBirth());
        return patientRepository.save(patient);
    }

    public String extractPatientIdFromAuthHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getUsernameFromToken(token);
    }
}

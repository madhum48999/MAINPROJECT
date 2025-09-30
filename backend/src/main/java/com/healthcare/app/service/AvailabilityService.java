package com.healthcare.app.service;

import com.healthcare.app.entity.Availability;
import com.healthcare.app.repository.AvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AvailabilityService {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    public Availability setAvailability(Availability availability) {
        return availabilityRepository.save(availability);
    }

    public List<Availability> getAvailabilityByDoctor(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId);
    }

    public List<Availability> getAvailabilityByDoctorAndDate(Long doctorId, LocalDate date) {
        return availabilityRepository.findByDoctorIdAndAvailableDate(doctorId, date);
    }

    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }
}

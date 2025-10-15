package com.healthcare.app.service;

import com.healthcare.app.entity.Doctor;
import com.healthcare.app.entity.Hospital;
import com.healthcare.app.repository.DoctorRepository;
import com.healthcare.app.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    public Page<Doctor> searchDoctors(String query, String specialization, int page, int size) {
        List<Doctor> allDoctors = doctorRepository.findAll();

        List<Doctor> filteredDoctors = allDoctors.stream()
            .filter(doctor -> {
                boolean matchesQuery = query == null || query.isEmpty() ||
                    doctor.getName().toLowerCase().contains(query.toLowerCase()) ||
                    doctor.getSpecialization().toLowerCase().contains(query.toLowerCase()) ||
                    doctor.getEmail().toLowerCase().contains(query.toLowerCase());

                boolean matchesSpecialization = specialization == null || specialization.isEmpty() ||
                    doctor.getSpecialization().equalsIgnoreCase(specialization);

                return matchesQuery && matchesSpecialization;
            })
            .collect(Collectors.toList());

        // Sort by name
        filteredDoctors.sort((a, b) -> a.getName().compareToIgnoreCase(b.getName()));

        // Pagination
        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredDoctors.size());
        List<Doctor> pageContent = filteredDoctors.subList(start, end);

        return new PageImpl<>(pageContent, pageable, filteredDoctors.size());
    }

    public Page<Hospital> searchHospitals(String query, String city, int page, int size) {
        List<Hospital> allHospitals = hospitalRepository.findAll();

        List<Hospital> filteredHospitals = allHospitals.stream()
            .filter(hospital -> {
                boolean matchesQuery = query == null || query.isEmpty() ||
                    hospital.getName().toLowerCase().contains(query.toLowerCase()) ||
                    hospital.getHospitalName().toLowerCase().contains(query.toLowerCase()) ||
                    hospital.getAddress().toLowerCase().contains(query.toLowerCase()) ||
                    hospital.getCity().toLowerCase().contains(query.toLowerCase()) ||
                    hospital.getState().toLowerCase().contains(query.toLowerCase());

                boolean matchesCity = city == null || city.isEmpty() ||
                    hospital.getCity().equalsIgnoreCase(city);

                return matchesQuery && matchesCity;
            })
            .collect(Collectors.toList());

        // Sort by name
        filteredHospitals.sort((a, b) -> a.getHospitalName().compareToIgnoreCase(b.getHospitalName()));

        // Pagination
        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredHospitals.size());
        List<Hospital> pageContent = filteredHospitals.subList(start, end);

        return new PageImpl<>(pageContent, pageable, filteredHospitals.size());
    }

    public List<String> getAllSpecializations() {
        return doctorRepository.findAll().stream()
            .map(Doctor::getSpecialization)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }

    public List<String> getAllCities() {
        return hospitalRepository.findAll().stream()
            .map(Hospital::getCity)
            .filter(city -> city != null && !city.isEmpty())
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }
}

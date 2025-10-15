package com.healthcare.app.service;

import com.healthcare.app.entity.MedicalRecord;
import com.healthcare.app.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord createRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }

    public List<MedicalRecord> getRecordsByPatient(String patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    public MedicalRecord updateRecord(Long id, MedicalRecord updatedRecord) {
        var recordOpt = medicalRecordRepository.findById(id);
        if (recordOpt.isPresent()) {
            MedicalRecord record = recordOpt.get();
            record.setPrescription(updatedRecord.getPrescription());
            record.setReport(updatedRecord.getReport());
            record.setPrescriptionFilePath(updatedRecord.getPrescriptionFilePath());
            record.setReportFilePath(updatedRecord.getReportFilePath());
            return medicalRecordRepository.save(record);
        }
        throw new RuntimeException("Record not found");
    }
}

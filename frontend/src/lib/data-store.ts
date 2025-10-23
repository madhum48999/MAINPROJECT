// In-memory data store for frontend application
// This replaces the backend database with local storage

import {
  Patient,
  Doctor,
  Hospital,
  Appointment,
  MedicalRecord,
  Notification,
  Reminder,
  Review,
  Availability,
  Admin,
  HospitalRegistrationRequest,
  DoctorRegistrationRequest,
  Otp,
  Medicine,
  Prescription,
  NutritionPlan,
  YogaTrainer
} from '../types';

// In-memory storage
export const dataStore = {
  patients: [] as Patient[],
  doctors: [] as Doctor[],
  hospitals: [] as Hospital[],
  appointments: [] as Appointment[],
  medicalRecords: [] as MedicalRecord[],
  notifications: [] as Notification[],
  reminders: [] as Reminder[],
  reviews: [] as Review[],
  availabilities: [] as Availability[],
  admins: [] as Admin[],
  hospitalRequests: [] as HospitalRegistrationRequest[],
  doctorRequests: [] as DoctorRegistrationRequest[],
  otps: [] as Otp[],
  medicines: [] as Medicine[],
  prescriptions: [] as Prescription[],
  nutritionPlans: [] as NutritionPlan[],
  yogaTrainers: [] as YogaTrainer[],
};

// Initialize with some default data
export const initializeData = () => {
  // Add default admin
  dataStore.admins.push({
    id: 1,
    name: 'Admin User',
    email: 'admin@hyno.com',
    password: 'admin123', // In real app, this would be hashed
    role: 'ADMIN',
  });
};

// Helper functions for data operations
export const generateId = (prefix: string, existingIds: string[]): string => {
  let counter = 1;
  let id: string;
  do {
    id = `${prefix}${counter.toString().padStart(3, '0')}`;
    counter++;
  } while (existingIds.includes(id));
  return id;
};

export const generateNumericId = (existingIds: number[]): number => {
  return Math.max(...existingIds, 0) + 1;
};

// Repository-like functions
export const patientRepository = {
  findAll: () => dataStore.patients,
  findById: (id: string) => dataStore.patients.find(p => p.patientId === id),
  findByEmail: (email: string) => dataStore.patients.find(p => p.email === email),
  findMaxId: () => dataStore.patients.length > 0 ? Math.max(...dataStore.patients.map(p => parseInt(p.pid.substring(1)))) : 0,
  save: (patient: Patient) => {
    const index = dataStore.patients.findIndex(p => p.patientId === patient.patientId);
    if (index >= 0) {
      dataStore.patients[index] = patient;
    } else {
      dataStore.patients.push(patient);
    }
    return patient;
  },
  delete: (id: string) => {
    const index = dataStore.patients.findIndex(p => p.patientId === id);
    if (index >= 0) {
      dataStore.patients.splice(index, 1);
    }
  },
};

export const doctorRepository = {
  findAll: () => dataStore.doctors,
  findById: (id: string) => dataStore.doctors.find(d => d.did === id),
  findByEmail: (email: string) => dataStore.doctors.find(d => d.email === email),
  findMaxId: () => dataStore.doctors.length > 0 ? Math.max(...dataStore.doctors.map(d => parseInt(d.did.substring(1)))) : 0,
  save: (doctor: Doctor) => {
    const index = dataStore.doctors.findIndex(d => d.did === doctor.did);
    if (index >= 0) {
      dataStore.doctors[index] = doctor;
    } else {
      dataStore.doctors.push(doctor);
    }
    return doctor;
  },
  delete: (id: string) => {
    const index = dataStore.doctors.findIndex(d => d.did === id);
    if (index >= 0) {
      dataStore.doctors.splice(index, 1);
    }
  },
};

export const hospitalRepository = {
  findAll: () => dataStore.hospitals,
  findById: (id: string) => dataStore.hospitals.find(h => h.hid === id),
  findByEmail: (email: string) => dataStore.hospitals.find(h => h.email === email),
  findMaxId: () => dataStore.hospitals.length > 0 ? Math.max(...dataStore.hospitals.map(h => parseInt(h.hid.substring(1)))) : 0,
  save: (hospital: Hospital) => {
    const index = dataStore.hospitals.findIndex(h => h.hid === hospital.hid);
    if (index >= 0) {
      dataStore.hospitals[index] = hospital;
    } else {
      dataStore.hospitals.push(hospital);
    }
    return hospital;
  },
  delete: (id: string) => {
    const index = dataStore.hospitals.findIndex(h => h.hid === id);
    if (index >= 0) {
      dataStore.hospitals.splice(index, 1);
    }
  },
};

export const appointmentRepository = {
  findAll: () => dataStore.appointments,
  findById: (id: number) => dataStore.appointments.find(a => a.id === id),
  findByPatientId: (patientId: string) => dataStore.appointments.filter(a => a.patientId === patientId),
  findByDoctorId: (doctorId: number) => dataStore.appointments.filter(a => a.doctorId === doctorId),
  findByHospitalId: (hospitalId: number) => dataStore.appointments.filter(a => a.hospitalId === hospitalId),
  save: (appointment: Appointment) => {
    const index = dataStore.appointments.findIndex(a => a.id === appointment.id);
    if (index >= 0) {
      dataStore.appointments[index] = appointment;
    } else {
      appointment.id = generateNumericId(dataStore.appointments.map(a => a.id));
      dataStore.appointments.push(appointment);
    }
    return appointment;
  },
  delete: (id: number) => {
    const index = dataStore.appointments.findIndex(a => a.id === id);
    if (index >= 0) {
      dataStore.appointments.splice(index, 1);
    }
  },
};

export const medicalRecordRepository = {
  findAll: () => dataStore.medicalRecords,
  findByPatientId: (patientId: string) => dataStore.medicalRecords.filter(mr => mr.patientId === patientId),
  findByPatientIdOrderByCreatedAtDesc: (patientId: string) =>
    dataStore.medicalRecords
      .filter(mr => mr.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  save: (record: MedicalRecord) => {
    const index = dataStore.medicalRecords.findIndex(mr => mr.id === record.id);
    if (index >= 0) {
      dataStore.medicalRecords[index] = record;
    } else {
      record.id = generateNumericId(dataStore.medicalRecords.map(mr => mr.id));
      dataStore.medicalRecords.push(record);
    }
    return record;
  },
};

export const notificationRepository = {
  findAll: () => dataStore.notifications,
  findByPatientId: (patientId: string) => dataStore.notifications.filter(n => n.patientId === patientId),
  save: (notification: Notification) => {
    const index = dataStore.notifications.findIndex(n => n.id === notification.id);
    if (index >= 0) {
      dataStore.notifications[index] = notification;
    } else {
      notification.id = generateNumericId(dataStore.notifications.map(n => n.id));
      dataStore.notifications.push(notification);
    }
    return notification;
  },
};

export const reminderRepository = {
  findAll: () => dataStore.reminders,
  findByPatientId: (patientId: string) => dataStore.reminders.filter(r => r.patientId === patientId),
  save: (reminder: Reminder) => {
    const index = dataStore.reminders.findIndex(r => r.id === reminder.id);
    if (index >= 0) {
      dataStore.reminders[index] = reminder;
    } else {
      reminder.id = generateNumericId(dataStore.reminders.map(r => r.id));
      dataStore.reminders.push(reminder);
    }
    return reminder;
  },
};

export const availabilityRepository = {
  findAll: () => dataStore.availabilities,
  findByDoctorId: (doctorId: number) => dataStore.availabilities.filter(a => a.doctorId === doctorId),
  findByDoctorIdAndAvailableDate: (doctorId: number, date: string) =>
    dataStore.availabilities.filter(a => a.doctorId === doctorId && a.availableDate === date),
  save: (availability: Availability) => {
    const index = dataStore.availabilities.findIndex(a => a.id === availability.id);
    if (index >= 0) {
      dataStore.availabilities[index] = availability;
    } else {
      availability.id = generateNumericId(dataStore.availabilities.map(a => a.id));
      dataStore.availabilities.push(availability);
    }
    return availability;
  },
};

export const adminRepository = {
  findAll: () => dataStore.admins,
  findByEmail: (email: string) => dataStore.admins.find(a => a.email === email),
  save: (admin: Admin) => {
    const index = dataStore.admins.findIndex(a => a.id === admin.id);
    if (index >= 0) {
      dataStore.admins[index] = admin;
    } else {
      admin.id = generateNumericId(dataStore.admins.map(a => a.id));
      dataStore.admins.push(admin);
    }
    return admin;
  },
};

export const hospitalRequestRepository = {
  findAll: () => dataStore.hospitalRequests,
  findById: (id: number) => dataStore.hospitalRequests.find(hr => hr.id === id),
  findByEmail: (email: string) => dataStore.hospitalRequests.find(hr => hr.email === email),
  save: (request: HospitalRegistrationRequest) => {
    const index = dataStore.hospitalRequests.findIndex(hr => hr.id === request.id);
    if (index >= 0) {
      dataStore.hospitalRequests[index] = request;
    } else {
      request.id = generateNumericId(dataStore.hospitalRequests.map(hr => hr.id));
      dataStore.hospitalRequests.push(request);
    }
    return request;
  },
};

export const doctorRequestRepository = {
  findAll: () => dataStore.doctorRequests,
  findById: (id: number) => dataStore.doctorRequests.find(dr => dr.id === dr.id),
  findByEmail: (email: string) => dataStore.doctorRequests.find(dr => dr.email === email),
  save: (request: DoctorRegistrationRequest) => {
    const index = dataStore.doctorRequests.findIndex(dr => dr.id === request.id);
    if (index >= 0) {
      dataStore.doctorRequests[index] = request;
    } else {
      request.id = generateNumericId(dataStore.doctorRequests.map(dr => dr.id));
      dataStore.doctorRequests.push(request);
    }
    return request;
  },
};

export const otpRepository = {
  findAll: () => dataStore.otps,
  findByEmailAndOtpCodeAndUsedFalse: (email: string, otp: string) =>
    dataStore.otps.find(o => o.email === email && o.otpCode === otp && !o.used),
  save: (otp: Otp) => {
    const index = dataStore.otps.findIndex(o => o.id === otp.id);
    if (index >= 0) {
      dataStore.otps[index] = otp;
    } else {
      otp.id = generateNumericId(dataStore.otps.map(o => o.id));
      dataStore.otps.push(otp);
    }
    return otp;
  },
  deleteExpiredOtps: (now: Date) => {
    dataStore.otps = dataStore.otps.filter(o => o.expiresAt > now);
  },
  markOtpAsUsed: (email: string, otp: string) => {
    const otpEntity = dataStore.otps.find(o => o.email === email && o.otpCode === otp);
    if (otpEntity) {
      otpEntity.used = true;
    }
  },
};

// Initialize data on module load
initializeData();

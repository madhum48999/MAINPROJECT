// Additional types for backend entities

export interface MedicalRecord {
  id: number;
  patientId: string;
  doctorId: string;
  hospitalId?: string;
  diagnosis: string;
  prescription?: string;
  report?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: number;
  patientId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Reminder {
  id: number;
  patientId: string;
  type: string;
  message: string;
  reminderDate?: string;
  createdAt: string;
}

export interface Review {
  id: number;
  patientId: string;
  doctorId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Availability {
  id: number;
  doctorId: number;
  availableDate: string;
  availableTimeSlot: string;
  isAvailable: boolean;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface HospitalRegistrationRequest {
  id: number;
  name: string;
  hospitalName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  password: string;
  status: string;
  createdAt: string;
}

export interface DoctorRegistrationRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  password: string;
  status: string;
  createdAt: string;
}

export interface Otp {
  id: number;
  email: string;
  otpCode: string;
  expiresAt: Date;
  used: boolean;
}

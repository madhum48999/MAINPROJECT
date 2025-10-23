// Core Types for HYNO Management System

export interface Patient {
  id: string;
  pid: string;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number;
  dateOfBirth: string;
  password?: string;
  role: string;
  firstName: string;
  lastName: string;
  bloodGroup?: string;
  allergies?: string[];
  medicalHistory?: string[];
  address?: string;
  emergencyContact?: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  did: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  specialization: string;
  licenseNumber: string;
  role: string;
  hospitalId: string;
  qualification?: string;
  experience?: number;
  rating?: number;
  available?: boolean;
  consultationFee?: number;
  avatar?: string;
  status: 'approved' | 'pending' | 'suspended';
}

export interface Hospital {
  id: string;
  hid: string;
  name: string;
  hospitalName: string;
  email: string;
  phone: string;
  password?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  role: string;
  totalDoctors?: number;
  facilities?: string[];
  status: 'approved' | 'pending' | 'rejected';
  registrationNumber?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  hospitalId?: string;
  type: 'video' | 'chat' | 'inperson' | 'hospital';
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  reason?: string;
  prescription?: string;
  notes?: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  manufacturer: string;
  requiresPrescription: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medicines: {
    medicineId: string;
    medicineName: string;
    dosage: string;
    duration: string;
    instructions: string;
  }[];
  date: string;
  diagnosis: string;
}

export interface NutritionPlan {
  id: string;
  patientId: string;
  bmi: number;
  calories: number;
  meals: Meal[];
  waterIntake: number;
  dietaryRestrictions: string[];
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  ingredients: string[];
  recipe: string;
  diseaseCategory?: string[];
  image?: string;
}

export interface YogaTrainer {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  availability: string[];
  sessionFee: number;
  mode: ('virtual' | 'inperson')[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'hospital' | 'admin';
  avatar?: string;
}

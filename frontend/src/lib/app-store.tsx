import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Doctor, Hospital, Appointment, Medicine, Prescription, NutritionPlan, Meal, YogaTrainer } from '../types';
import { AuthService } from '../services/AuthService';
import { AppointmentService } from '../services/AppointmentService';
import { toast } from 'sonner';
import { USE_BACKEND } from './config';
import { adminAPI } from './api-client';

interface AppStoreContextType {
  // Data
  patients: Patient[];
  doctors: Doctor[];
  hospitals: Hospital[];
  appointments: Appointment[];
  medicines: Medicine[];
  prescriptions: Prescription[];
  nutritionPlans: NutritionPlan[];
  yogaTrainers: YogaTrainer[];

  // Patient Actions
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Doctor Actions
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  approveDoctor: (id: string) => void;
  suspendDoctor: (id: string) => void;

  // Hospital Actions
  addHospital: (hospital: Hospital) => void;
  updateHospital: (id: string, hospital: Partial<Hospital>) => void;
  deleteHospital: (id: string) => void;
  approveHospital: (id: string) => void;
  rejectHospital: (id: string) => void;

  // Appointment Actions
  bookAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  completeAppointment: (id: string, notes?: string) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;

  // Medicine Actions
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;

  // Prescription Actions
  addPrescription: (prescription: Prescription) => void;
  getPrescriptionsByPatient: (patientId: string) => Prescription[];

  // Nutrition Actions
  addNutritionPlan: (plan: NutritionPlan) => void;
  updateNutritionPlan: (id: string, plan: Partial<NutritionPlan>) => void;
  getNutritionPlanByPatient: (patientId: string) => NutritionPlan | undefined;

  // Yoga Actions
  addYogaTrainer: (trainer: YogaTrainer) => void;
  updateYogaTrainer: (id: string, trainer: Partial<YogaTrainer>) => void;
}

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined);

const authService = new AuthService();
const appointmentService = new AppointmentService();

export const AppStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [yogaTrainers, setYogaTrainers] = useState<YogaTrainer[]>([]);

  // Initialize data on mount
  useEffect(() => {
    if (USE_BACKEND) {
      // Load data from backend APIs
      const loadData = async () => {
        try {
          const [patientsData, doctorsData, hospitalsData, appointmentsData, medicinesData, prescriptionsData, nutritionPlansData, yogaTrainersData] = await Promise.all([
            adminAPI.getAllPatients(),
            adminAPI.getAllDoctors(),
            adminAPI.getAllHospitals(),
            adminAPI.getAllAppointments(),
            adminAPI.getAllMedicines(),
            adminAPI.getAllPrescriptions(),
            adminAPI.getAllNutritionPlans(),
            adminAPI.getAllYogaTrainers(),
          ]);
          setPatients(patientsData);
          setDoctors(doctorsData);
          setHospitals(hospitalsData);
          setAppointments(appointmentsData);
          setMedicines(medicinesData);
          setPrescriptions(prescriptionsData);
          setNutritionPlans(nutritionPlansData);
          setYogaTrainers(yogaTrainersData);
        } catch (error) {
          console.error('Failed to load data from backend:', error);
          toast.error('Failed to load data from backend');
        }
      };
      loadData();
    } else {
      // Load from data store
      import('./data-store').then(({ dataStore }) => {
        setPatients(dataStore.patients);
        setDoctors(dataStore.doctors);
        setHospitals(dataStore.hospitals);
        setAppointments(dataStore.appointments);
        setMedicines(dataStore.medicines || []);
        setPrescriptions(dataStore.prescriptions || []);
        setNutritionPlans(dataStore.nutritionPlans || []);
        setYogaTrainers(dataStore.yogaTrainers || []);
      });
    }
  }, []);

  // Patient Actions
  const addPatient = (patient: Patient) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Add patient to backend:', patient);
    } else {
      setPatients([...patients, patient]);
    }
    toast.success('Patient added successfully');
  };

  const updatePatient = (id: string, patient: Partial<Patient>) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Update patient in backend:', id, patient);
    } else {
      setPatients(patients.map(p => p.id === id ? { ...p, ...patient } : p));
    }
    toast.success('Patient updated successfully');
  };

  const deletePatient = (id: string) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Delete patient from backend:', id);
    } else {
      setPatients(patients.filter(p => p.id !== id));
    }
    toast.success('Patient deleted successfully');
  };

  // Doctor Actions
  const addDoctor = (doctor: Doctor) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Add doctor to backend:', doctor);
    } else {
      setDoctors([...doctors, doctor]);
    }
    toast.success('Doctor added successfully');
  };

  const updateDoctor = (id: string, doctor: Partial<Doctor>) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Update doctor in backend:', id, doctor);
    } else {
      setDoctors(doctors.map(d => d.id === id ? { ...d, ...doctor } : d));
    }
    toast.success('Doctor updated successfully');
  };

  const deleteDoctor = (id: string) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Delete doctor from backend:', id);
    } else {
      setDoctors(doctors.filter(d => d.id !== id));
    }
    toast.success('Doctor deleted successfully');
  };

  const approveDoctor = (id: string) => {
    updateDoctor(id, { status: 'approved' });
    toast.success('Doctor approved successfully');
  };

  const suspendDoctor = (id: string) => {
    updateDoctor(id, { status: 'suspended' });
    toast.success('Doctor suspended successfully');
  };

  // Hospital Actions
  const addHospital = (hospital: Hospital) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Add hospital to backend:', hospital);
    } else {
      setHospitals([...hospitals, hospital]);
    }
    toast.success('Hospital added successfully');
  };

  const updateHospital = (id: string, hospital: Partial<Hospital>) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Update hospital in backend:', id, hospital);
    } else {
      setHospitals(hospitals.map(h => h.id === id ? { ...h, ...hospital } : h));
    }
    toast.success('Hospital updated successfully');
  };

  const deleteHospital = (id: string) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Delete hospital from backend:', id);
    } else {
      setHospitals(hospitals.filter(h => h.id !== id));
    }
    toast.success('Hospital deleted successfully');
  };

  const approveHospital = (id: string) => {
    updateHospital(id, { status: 'approved' });
    toast.success('Hospital approved successfully');
  };

  const rejectHospital = (id: string) => {
    updateHospital(id, { status: 'rejected' });
    toast.success('Hospital rejected successfully');
  };

  // Appointment Actions
  const bookAppointment = (appointment: Omit<Appointment, 'id'>) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Book appointment in backend:', appointment);
    } else {
      try {
        const bookedAppointment = appointmentService.bookAppointment(appointment as Appointment);
        setAppointments([...appointments, bookedAppointment]);
        toast.success('Appointment booked successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to book appointment');
      }
    }
  };

  const updateAppointment = (id: string, appointment: Partial<Appointment>) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Update appointment in backend:', id, appointment);
    } else {
      setAppointments(appointments.map(a => a.id.toString() === id ? { ...a, ...appointment } : a));
    }
    toast.success('Appointment updated successfully');
  };

  const cancelAppointment = (id: string) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Cancel appointment in backend:', id);
    } else {
      try {
        appointmentService.cancelAppointment(parseInt(id));
        setAppointments(appointments.map(a =>
          a.id.toString() === id ? { ...a, status: 'cancelled' } : a
        ));
        toast.success('Appointment cancelled successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to cancel appointment');
      }
    }
  };

  const completeAppointment = (id: string, notes?: string) => {
    updateAppointment(id, { status: 'completed', notes });
    toast.success('Appointment completed successfully');
  };

  const rescheduleAppointment = (id: string, date: string, time: string) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Reschedule appointment in backend:', id, date, time);
    } else {
      try {
        const newDateTime = `${date}T${time}:00`;
        appointmentService.rescheduleAppointment(parseInt(id), newDateTime);
        setAppointments(appointments.map(a =>
          a.id.toString() === id ? { ...a, date, time, dateTime: newDateTime } : a
        ));
        toast.success('Appointment rescheduled successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to reschedule appointment');
      }
    }
  };

  // Medicine Actions
  const addMedicine = (medicine: Medicine) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Add medicine to backend:', medicine);
    } else {
      setMedicines([...medicines, medicine]);
    }
    toast.success('Medicine added successfully');
  };

  const updateMedicine = (id: string, medicine: Partial<Medicine>) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Update medicine in backend:', id, medicine);
    } else {
      setMedicines(medicines.map(m => m.id === id ? { ...m, ...medicine } : m));
    }
    toast.success('Medicine updated successfully');
  };

  const deleteMedicine = (id: string) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Delete medicine from backend:', id);
    } else {
      setMedicines(medicines.filter(m => m.id !== id));
    }
    toast.success('Medicine deleted successfully');
  };

  // Prescription Actions
  const addPrescription = (prescription: Prescription) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Add prescription to backend:', prescription);
    } else {
      setPrescriptions([...prescriptions, prescription]);
    }
    toast.success('Prescription added successfully');
  };

  const getPrescriptionsByPatient = (patientId: string) => {
    return prescriptions.filter(p => p.patientId === patientId);
  };

  // Nutrition Actions
  const addNutritionPlan = (plan: NutritionPlan) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Add nutrition plan to backend:', plan);
    } else {
      setNutritionPlans([...nutritionPlans, plan]);
    }
    toast.success('Nutrition plan created');
  };

  const updateNutritionPlan = (id: string, updatedData: Partial<NutritionPlan>) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Update nutrition plan in backend:', id, updatedData);
    } else {
      setNutritionPlans(nutritionPlans.map(n => n.id === id ? { ...n, ...updatedData } : n));
    }
    toast.success('Nutrition plan updated');
  };

  const getNutritionPlanByPatient = (patientId: string) => {
    return nutritionPlans.find(n => n.patientId === patientId);
  };

  // Yoga Actions
  const addYogaTrainer = (trainer: YogaTrainer) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Add yoga trainer to backend:', trainer);
    } else {
      setYogaTrainers([...yogaTrainers, trainer]);
    }
    toast.success('Yoga trainer added');
  };

  const updateYogaTrainer = (id: string, updatedData: Partial<YogaTrainer>) => {
    if (USE_BACKEND) {
      // TODO: Call backend API
      console.log('Update yoga trainer in backend:', id, updatedData);
    } else {
      setYogaTrainers(yogaTrainers.map(t => t.id === id ? { ...t, ...updatedData } : t));
    }
    toast.success('Trainer updated');
  };

  const value: AppStoreContextType = {
    patients,
    doctors,
    hospitals,
    appointments,
    medicines,
    prescriptions,
    nutritionPlans,
    yogaTrainers,
    addPatient,
    updatePatient,
    deletePatient,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    approveDoctor,
    suspendDoctor,
    addHospital,
    updateHospital,
    deleteHospital,
    approveHospital,
    rejectHospital,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    rescheduleAppointment,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    addPrescription,
    getPrescriptionsByPatient,
    addNutritionPlan,
    updateNutritionPlan,
    getNutritionPlanByPatient,
    addYogaTrainer,
    updateYogaTrainer,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
};

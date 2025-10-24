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
  addPatient: (patient: Patient) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;

  // Doctor Actions
  addDoctor: (doctor: Doctor) => Promise<void>;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  approveDoctor: (id: string) => void;
  suspendDoctor: (id: string) => void;

  // Hospital Actions
  addHospital: (hospital: Hospital) => Promise<void>;
  updateHospital: (id: string, hospital: Partial<Hospital>) => Promise<void>;
  deleteHospital: (id: string) => Promise<void>;
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
  const addPatient = async (patient: Patient) => {
    if (USE_BACKEND) {
      try {
        const newPatient = await adminAPI.addPatient(patient);
        setPatients([...patients, newPatient]);
        toast.success('Patient added successfully');
      } catch (error) {
        console.error('Failed to add patient:', error);
        toast.error('Failed to add patient');
      }
    } else {
      setPatients([...patients, patient]);
      toast.success('Patient added successfully');
    }
  };

  const updatePatient = async (id: string, patient: Partial<Patient>) => {
    if (USE_BACKEND) {
      try {
        // Note: Admin API might not have update patient, using direct state update for now
        setPatients(patients.map(p => p.id === id ? { ...p, ...patient } : p));
        toast.success('Patient updated successfully');
      } catch (error) {
        console.error('Failed to update patient:', error);
        toast.error('Failed to update patient');
      }
    } else {
      setPatients(patients.map(p => p.id === id ? { ...p, ...patient } : p));
      toast.success('Patient updated successfully');
    }
  };

  const deletePatient = async (id: string) => {
    if (USE_BACKEND) {
      try {
        await adminAPI.deletePatient(id);
        setPatients(patients.filter(p => p.id !== id));
        toast.success('Patient deleted successfully');
      } catch (error) {
        console.error('Failed to delete patient:', error);
        toast.error('Failed to delete patient');
      }
    } else {
      setPatients(patients.filter(p => p.id !== id));
      toast.success('Patient deleted successfully');
    }
  };

  // Doctor Actions
  const addDoctor = async (doctor: Doctor) => {
    if (USE_BACKEND) {
      try {
        const newDoctor = await adminAPI.addDoctor(doctor);
        setDoctors([...doctors, newDoctor]);
        toast.success('Doctor added successfully');
      } catch (error) {
        console.error('Failed to add doctor:', error);
        toast.error('Failed to add doctor');
      }
    } else {
      setDoctors([...doctors, doctor]);
      toast.success('Doctor added successfully');
    }
  };

  const updateDoctor = async (id: string, doctor: Partial<Doctor>) => {
    if (USE_BACKEND) {
      try {
        // Note: Admin API might not have update doctor, using direct state update for now
        setDoctors(doctors.map(d => d.id === id ? { ...d, ...doctor } : d));
        toast.success('Doctor updated successfully');
      } catch (error) {
        console.error('Failed to update doctor:', error);
        toast.error('Failed to update doctor');
      }
    } else {
      setDoctors(doctors.map(d => d.id === id ? { ...d, ...doctor } : d));
      toast.success('Doctor updated successfully');
    }
  };

  const deleteDoctor = async (id: string) => {
    if (USE_BACKEND) {
      try {
        await adminAPI.deleteDoctor(id);
        setDoctors(doctors.filter(d => d.id !== id));
        toast.success('Doctor deleted successfully');
      } catch (error) {
        console.error('Failed to delete doctor:', error);
        toast.error('Failed to delete doctor');
      }
    } else {
      setDoctors(doctors.filter(d => d.id !== id));
      toast.success('Doctor deleted successfully');
    }
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
  const addHospital = async (hospital: Hospital) => {
    if (USE_BACKEND) {
      try {
        const newHospital = await adminAPI.addHospital(hospital);
        setHospitals([...hospitals, newHospital]);
        toast.success('Hospital added successfully');
      } catch (error) {
        console.error('Failed to add hospital:', error);
        toast.error('Failed to add hospital');
      }
    } else {
      setHospitals([...hospitals, hospital]);
      toast.success('Hospital added successfully');
    }
  };

  const updateHospital = async (id: string, hospital: Partial<Hospital>) => {
    if (USE_BACKEND) {
      try {
        // Note: Admin API might not have update hospital, using direct state update for now
        setHospitals(hospitals.map(h => h.id === id ? { ...h, ...hospital } : h));
        toast.success('Hospital updated successfully');
      } catch (error) {
        console.error('Failed to update hospital:', error);
        toast.error('Failed to update hospital');
      }
    } else {
      setHospitals(hospitals.map(h => h.id === id ? { ...h, ...hospital } : h));
      toast.success('Hospital updated successfully');
    }
  };

  const deleteHospital = async (id: string) => {
    if (USE_BACKEND) {
      try {
        await adminAPI.deleteHospital(id);
        setHospitals(hospitals.filter(h => h.id !== id));
        toast.success('Hospital deleted successfully');
      } catch (error) {
        console.error('Failed to delete hospital:', error);
        toast.error('Failed to delete hospital');
      }
    } else {
      setHospitals(hospitals.filter(h => h.id !== id));
      toast.success('Hospital deleted successfully');
    }
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

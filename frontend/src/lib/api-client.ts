import { API_URL } from './config';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
};

export const authAPI = {
  login: async (email: string, password: string): Promise<string> => {
    const response = await fetch(`${API_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.text(); // JWT token as string
  },

  me: async (): Promise<any> => {
    return authenticatedFetch('/auth/me');
  },

  register: async (request: any): Promise<any> => {
    return authenticatedFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await authenticatedFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await authenticatedFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (email: string, otp: string, newPassword: string): Promise<void> => {
    await authenticatedFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    });
  },
};

export const patientAPI = {
  getAppointments: async (patientId: string): Promise<any[]> => {
    return authenticatedFetch(`/patient/appointments/${patientId}`);
  },

  getMedicalHistory: async (patientId: string): Promise<any[]> => {
    return authenticatedFetch(`/patient/history/${patientId}`);
  },

  getDoctors: async (): Promise<any[]> => {
    return authenticatedFetch('/patient/doctors');
  },

  getAvailabilities: async (doctorId: number): Promise<any[]> => {
    return authenticatedFetch(`/patient/availabilities/${doctorId}`);
  },

  getUpcomingAppointments: async (patientId: string): Promise<any[]> => {
    return authenticatedFetch(`/patient/appointments/upcoming/${patientId}`);
  },

  getPrescriptions: async (patientId: string): Promise<any[]> => {
    return authenticatedFetch(`/patient/prescriptions/${patientId}`);
  },

  getLabResults: async (patientId: string): Promise<any[]> => {
    return authenticatedFetch(`/patient/lab-results/${patientId}`);
  },

  getReminders: async (patientId: string): Promise<any[]> => {
    return authenticatedFetch(`/patient/reminders/${patientId}`);
  },

  getNotifications: async (patientId: string): Promise<any[]> => {
    return authenticatedFetch(`/patient/notifications/${patientId}`);
  },

  getProfile: async (): Promise<any> => {
    return authenticatedFetch('/patient/profile');
  },

  updateProfile: async (profile: any): Promise<any> => {
    return authenticatedFetch('/patient/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  bookAppointment: async (appointment: any): Promise<any> => {
    return authenticatedFetch('/patient/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  },

  rescheduleAppointment: async (appointmentId: number, newDateTime: string): Promise<any> => {
    return authenticatedFetch(`/patient/appointments/${appointmentId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(newDateTime),
    });
  },
};

export const doctorAPI = {
  getAppointments: async (doctorId: number): Promise<any[]> => {
    return authenticatedFetch(`/doctor/appointments/${doctorId}`);
  },

  getAvailability: async (doctorId: number): Promise<any[]> => {
    return authenticatedFetch(`/doctor/availability/${doctorId}`);
  },

  setAvailability: async (availability: any): Promise<any> => {
    return authenticatedFetch('/doctor/availability', {
      method: 'POST',
      body: JSON.stringify(availability),
    });
  },

  deleteAvailability: async (id: number): Promise<void> => {
    await authenticatedFetch(`/doctor/availability/${id}`, {
      method: 'DELETE',
    });
  },

  getRecords: async (doctorId: string): Promise<any[]> => {
    return authenticatedFetch(`/doctor/records/${doctorId}`);
  },

  createRecord: async (record: any): Promise<any> => {
    return authenticatedFetch('/doctor/records', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  },

  updateAppointmentStatus: async (id: number, status: string): Promise<any> => {
    return authenticatedFetch(`/doctor/appointments/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  getPatientProfile: async (patientId: string): Promise<any> => {
    return authenticatedFetch(`/doctor/patient/${patientId}`);
  },

  getDoctorsBySpecialization: async (specialization: string): Promise<any[]> => {
    return authenticatedFetch(`/doctor/specialization?specialization=${encodeURIComponent(specialization)}`);
  },
};

export const adminAPI = {
  // Patient management
  getAllPatients: async (): Promise<any[]> => {
    return authenticatedFetch('/admin/patients');
  },

  addPatient: async (patient: any): Promise<any> => {
    return authenticatedFetch('/admin/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  },

  updatePatient: async (id: string, patient: any): Promise<any> => {
    return authenticatedFetch(`/admin/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
  },

  deletePatient: async (id: string): Promise<void> => {
    await authenticatedFetch(`/admin/patients/${id}`, {
      method: 'DELETE',
    });
  },

  // Doctor management
  getAllDoctors: async (): Promise<any[]> => {
    return authenticatedFetch('/admin/doctors');
  },

  addDoctor: async (doctor: any): Promise<any> => {
    return authenticatedFetch('/admin/doctors', {
      method: 'POST',
      body: JSON.stringify(doctor),
    });
  },

  updateDoctor: async (id: string, doctor: any): Promise<any> => {
    return authenticatedFetch(`/admin/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctor),
    });
  },

  deleteDoctor: async (id: string): Promise<void> => {
    await authenticatedFetch(`/admin/doctors/${id}`, {
      method: 'DELETE',
    });
  },

  approveDoctor: async (id: string): Promise<any> => {
    return authenticatedFetch(`/admin/doctors/${id}/approve`, {
      method: 'PUT',
    });
  },

  suspendDoctor: async (id: string): Promise<any> => {
    return authenticatedFetch(`/admin/doctors/${id}/suspend`, {
      method: 'PUT',
    });
  },

  // Hospital management
  getAllHospitals: async (): Promise<any[]> => {
    return authenticatedFetch('/admin/hospitals');
  },

  addHospital: async (hospital: any): Promise<any> => {
    return authenticatedFetch('/admin/hospitals', {
      method: 'POST',
      body: JSON.stringify(hospital),
    });
  },

  updateHospital: async (id: string, hospital: any): Promise<any> => {
    return authenticatedFetch(`/admin/hospitals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hospital),
    });
  },

  deleteHospital: async (id: string): Promise<void> => {
    await authenticatedFetch(`/admin/hospitals/${id}`, {
      method: 'DELETE',
    });
  },

  approveHospital: async (id: string): Promise<any> => {
    return authenticatedFetch(`/admin/hospitals/${id}/approve`, {
      method: 'PUT',
    });
  },

  rejectHospital: async (id: string): Promise<any> => {
    return authenticatedFetch(`/admin/hospitals/${id}/reject`, {
      method: 'PUT',
    });
  },

  // Appointment management
  getAllAppointments: async (): Promise<any[]> => {
    return authenticatedFetch('/admin/appointments');
  },

  updateAppointment: async (id: string, appointment: any): Promise<any> => {
    return authenticatedFetch(`/admin/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
  },

  cancelAppointment: async (id: string): Promise<any> => {
    return authenticatedFetch(`/admin/appointments/${id}/cancel`, {
      method: 'PUT',
    });
  },

  completeAppointment: async (id: string, notes?: string): Promise<any> => {
    return authenticatedFetch(`/admin/appointments/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  },

  // Medicine management
  getAllMedicines: async (): Promise<any[]> => {
    return authenticatedFetch('/admin/medicines');
  },

  addMedicine: async (medicine: any): Promise<any> => {
    return authenticatedFetch('/admin/medicines', {
      method: 'POST',
      body: JSON.stringify(medicine),
    });
  },

  updateMedicine: async (id: string, medicine: any): Promise<any> => {
    return authenticatedFetch(`/admin/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicine),
    });
  },

  deleteMedicine: async (id: string): Promise<void> => {
    await authenticatedFetch(`/admin/medicines/${id}`, {
      method: 'DELETE',
    });
  },

  // Prescription management
  getAllPrescriptions: async (): Promise<any[]> => {
    return authenticatedFetch('/admin/prescriptions');
  },

  addPrescription: async (prescription: any): Promise<any> => {
    return authenticatedFetch('/admin/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescription),
    });
  },

  // Nutrition management
  getAllNutritionPlans: async (): Promise<any[]> => {
    return authenticatedFetch('/admin/nutrition-plans');
  },

  addNutritionPlan: async (plan: any): Promise<any> => {
    return authenticatedFetch('/admin/nutrition-plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  updateNutritionPlan: async (id: string, plan: any): Promise<any> => {
    return authenticatedFetch(`/admin/nutrition-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plan),
    });
  },

  // Yoga trainer management
  getAllYogaTrainers: async (): Promise<any[]> => {
    return authenticatedFetch('/admin/yoga-trainers');
  },

  addYogaTrainer: async (trainer: any): Promise<any> => {
    return authenticatedFetch('/admin/yoga-trainers', {
      method: 'POST',
      body: JSON.stringify(trainer),
    });
  },

  updateYogaTrainer: async (id: string, trainer: any): Promise<any> => {
    return authenticatedFetch(`/admin/yoga-trainers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trainer),
    });
  },
};

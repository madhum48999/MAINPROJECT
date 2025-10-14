import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface HospitalRequest {
  id: number;
  hospitalName: string;
  email: string;
  status: string;
}

interface DoctorRequest {
  id: number;
  doctorName: string;
  email: string;
  specialization: string;
  status: string;
}

interface Patient {
  id: number;
  patientId: string;
  name: string;
  email: string;
  role: string;
}

interface Hospital {
  id: number;
  hospitalName: string;
  email: string;
  address: string;
  contact: string;
  role: string;
}

interface Doctor {
  id: number;
  doctorName: string;
  email: string;
  specialization: string;
  hospitalId: number | null;
  role: string;
}

interface Appointment {
  id: number;
  patientId: string;
  doctorId: number;
  hospitalId: number;
  dateTime: string;
  status: string;
}

const AdminDashboard = () => {
  const [hospitalRequests, setHospitalRequests] = useState<HospitalRequest[]>([]);
  const [doctorRequests, setDoctorRequests] = useState<DoctorRequest[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingHospitalsMgmt, setLoadingHospitalsMgmt] = useState(false);
  const [loadingDoctorsMgmt, setLoadingDoctorsMgmt] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [openAddPatientDialog, setOpenAddPatientDialog] = useState(false);
  const [openAddHospitalDialog, setOpenAddHospitalDialog] = useState(false);
  const [openAddDoctorDialog, setOpenAddDoctorDialog] = useState(false);
  const [openAddAppointmentDialog, setOpenAddAppointmentDialog] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', email: '', password: '' });
  const [newHospital, setNewHospital] = useState({ hospitalName: '', email: '', password: '', address: '', contact: '' });
  const [newDoctor, setNewDoctor] = useState({ doctorName: '', email: '', password: '', specialization: '' });
  const [newAppointment, setNewAppointment] = useState({ patientId: '', doctorId: '', hospitalId: '', dateTime: '' });
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchHospitalRequests();
    fetchDoctorRequests();
    fetchPatients();
    fetchHospitals();
    fetchDoctors();
    fetchAppointments();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchHospitalRequests();
      fetchDoctorRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchHospitalRequests = async () => {
    setLoadingHospitals(true);
    try {
      const response = await axios.get('http://localhost:8080/api/admin/hospital-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHospitalRequests(response.data);
    } catch (error) {
      setError('Error fetching hospital requests');
    } finally {
      setLoadingHospitals(false);
    }
  };

  const fetchDoctorRequests = async () => {
    setLoadingDoctors(true);
    try {
      const response = await axios.get('http://localhost:8080/api/admin/doctor-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctorRequests(response.data);
    } catch (error) {
      setError('Error fetching doctor requests');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await axios.get('http://localhost:8080/api/admin/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      setError('Error fetching patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchHospitals = async () => {
    setLoadingHospitalsMgmt(true);
    try {
      const response = await axios.get('http://localhost:8080/api/admin/hospitals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHospitals(response.data);
    } catch (error) {
      setError('Error fetching hospitals');
    } finally {
      setLoadingHospitalsMgmt(false);
    }
  };

  const fetchDoctors = async () => {
    setLoadingDoctorsMgmt(true);
    try {
      const response = await axios.get('http://localhost:8080/api/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data);
    } catch (error) {
      setError('Error fetching doctors');
    } finally {
      setLoadingDoctorsMgmt(false);
    }
  };

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await axios.get('http://localhost:8080/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (error) {
      setError('Error fetching appointments');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const approveHospital = async (id: number) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/approve/hospital/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Hospital approved successfully');
      fetchHospitalRequests();
    } catch (error) {
      setError('Error approving hospital');
    }
  };

  const rejectHospital = async (id: number) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/reject/hospital/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Hospital rejected successfully');
      fetchHospitalRequests();
    } catch (error) {
      setError('Error rejecting hospital');
    }
  };

  const approveDoctor = async (id: number) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/approve/doctor/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Doctor approved successfully');
      fetchDoctorRequests();
    } catch (error) {
      setError('Error approving doctor');
    }
  };

  const rejectDoctor = async (id: number) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/reject/doctor/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Doctor rejected successfully');
      fetchDoctorRequests();
    } catch (error) {
      setError('Error rejecting doctor');
    }
  };

  const deletePatient = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      setError('Error deleting patient');
    }
  };

  const addPatient = async () => {
    try {
      await axios.post('http://localhost:8080/api/admin/patients', newPatient, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Patient added successfully');
      setNewPatient({ name: '', email: '', password: '' });
      setOpenAddPatientDialog(false);
      fetchPatients();
    } catch (error) {
      setError('Error adding patient');
    }
  };

  const addHospital = async () => {
    try {
      await axios.post('http://localhost:8080/api/admin/hospitals', newHospital, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Hospital added successfully');
      setNewHospital({ hospitalName: '', email: '', password: '', address: '', contact: '' });
      setOpenAddHospitalDialog(false);
      fetchHospitals();
    } catch (error) {
      setError('Error adding hospital');
    }
  };

  const addDoctor = async () => {
    try {
      await axios.post('http://localhost:8080/api/admin/doctors', newDoctor, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Doctor added successfully');
      setNewDoctor({ doctorName: '', email: '', password: '', specialization: '' });
      setOpenAddDoctorDialog(false);
      fetchDoctors();
    } catch (error) {
      setError('Error adding doctor');
    }
  };

  const addAppointment = async () => {
    try {
      await axios.post('http://localhost:8080/api/admin/appointments', newAppointment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Appointment added successfully');
      setNewAppointment({ patientId: '', doctorId: '', hospitalId: '', dateTime: '' });
      setOpenAddAppointmentDialog(false);
      fetchAppointments();
    } catch (error) {
      setError('Error adding appointment');
    }
  };

  const deleteHospital = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/hospitals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Hospital deleted successfully');
      fetchHospitals();
    } catch (error) {
      setError('Error deleting hospital');
    }
  };

  const deleteDoctor = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      setError('Error deleting doctor');
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Appointment deleted successfully');
      fetchAppointments();
    } catch (error) {
      setError('Error deleting appointment');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/change-password')}>
            Change Password
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 3 }}>
        <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} aria-label="admin tabs">
          <Tab label="Requests" />
          <Tab label="Patients" />
          <Tab label="Hospitals" />
          <Tab label="Doctors" />
          <Tab label="Appointments" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 3 }}>
            <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Pending Hospital Requests
                </Typography>
                {loadingHospitals ? (
                  <CircularProgress />
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Hospital Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {hospitalRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              No pending hospital requests
                            </TableCell>
                          </TableRow>
                        ) : (
                          hospitalRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.hospitalName}</TableCell>
                              <TableCell>{request.email}</TableCell>
                              <TableCell align="center">
                                <IconButton
                                  color="success"
                                  onClick={() => approveHospital(request.id)}
                                  aria-label="approve hospital"
                                >
                                  <CheckIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => rejectHospital(request.id)}
                                  aria-label="reject hospital"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Box>

            <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Pending Doctor Requests
                </Typography>
                {loadingDoctors ? (
                  <CircularProgress />
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Doctor Name</TableCell>
                          <TableCell>Specialization</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {doctorRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              No pending doctor requests
                            </TableCell>
                          </TableRow>
                        ) : (
                          doctorRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.doctorName}</TableCell>
                              <TableCell>{request.specialization}</TableCell>
                              <TableCell>{request.email}</TableCell>
                              <TableCell align="center">
                                <IconButton
                                  color="success"
                                  onClick={() => approveDoctor(request.id)}
                                  aria-label="approve doctor"
                                >
                                  <CheckIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => rejectDoctor(request.id)}
                                  aria-label="reject doctor"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ padding: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Patient Management
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddPatientDialog(true)}>
                  Add Patient
                </Button>
              </Box>
              {loadingPatients ? (
                <CircularProgress />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No patients found
                          </TableCell>
                        </TableRow>
                      ) : (
                        patients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell>{patient.patientId}</TableCell>
                            <TableCell>{patient.name}</TableCell>
                            <TableCell>{patient.email}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                color="error"
                                onClick={() => deletePatient(patient.id)}
                                aria-label="delete patient"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ padding: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Hospital Management
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddHospitalDialog(true)}>
                  Add Hospital
                </Button>
              </Box>
              {loadingHospitalsMgmt ? (
                <CircularProgress />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Hospital Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {hospitals.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No hospitals found
                          </TableCell>
                        </TableRow>
                      ) : (
                        hospitals.map((hospital) => (
                          <TableRow key={hospital.id}>
                            <TableCell>{hospital.hospitalName}</TableCell>
                            <TableCell>{hospital.email}</TableCell>
                            <TableCell>{hospital.address}</TableCell>
                            <TableCell>{hospital.contact}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                color="error"
                                onClick={() => deleteHospital(hospital.id)}
                                aria-label="delete hospital"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        )}

        {activeTab === 3 && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ padding: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Doctor Management
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddDoctorDialog(true)}>
                  Add Doctor
                </Button>
              </Box>
              {loadingDoctorsMgmt ? (
                <CircularProgress />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Doctor Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Specialization</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {doctors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No doctors found
                          </TableCell>
                        </TableRow>
                      ) : (
                        doctors.map((doctor) => (
                          <TableRow key={doctor.id}>
                            <TableCell>{doctor.doctorName}</TableCell>
                            <TableCell>{doctor.email}</TableCell>
                            <TableCell>{doctor.specialization}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                color="error"
                                onClick={() => deleteDoctor(doctor.id)}
                                aria-label="delete doctor"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        )}
        {activeTab === 4 && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ padding: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Appointment Management
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddAppointmentDialog(true)}>
                  Add Appointment
                </Button>
              </Box>
              {loadingAppointments ? (
                <CircularProgress />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient ID</TableCell>
                        <TableCell>Doctor ID</TableCell>
                        <TableCell>Hospital ID</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No appointments found
                          </TableCell>
                        </TableRow>
                      ) : (
                        appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>{appointment.patientId}</TableCell>
                            <TableCell>{appointment.doctorId}</TableCell>
                            <TableCell>{appointment.hospitalId}</TableCell>
                            <TableCell>{new Date(appointment.dateTime).toLocaleString()}</TableCell>
                            <TableCell>{appointment.status}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                color="error"
                                onClick={() => deleteAppointment(appointment.id)}
                                aria-label="delete appointment"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        )}
      </Box>

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <Dialog open={openAddPatientDialog} onClose={() => setOpenAddPatientDialog(false)}>
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPatient.password}
            onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPatientDialog(false)}>Cancel</Button>
          <Button onClick={addPatient} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddHospitalDialog} onClose={() => setOpenAddHospitalDialog(false)}>
        <DialogTitle>Add New Hospital</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Hospital Name"
            fullWidth
            variant="outlined"
            value={newHospital.hospitalName}
            onChange={(e) => setNewHospital({ ...newHospital, hospitalName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={newHospital.email}
            onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newHospital.password}
            onChange={(e) => setNewHospital({ ...newHospital, password: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            variant="outlined"
            value={newHospital.address}
            onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contact"
            fullWidth
            variant="outlined"
            value={newHospital.contact}
            onChange={(e) => setNewHospital({ ...newHospital, contact: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddHospitalDialog(false)}>Cancel</Button>
          <Button onClick={addHospital} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDoctorDialog} onClose={() => setOpenAddDoctorDialog(false)}>
        <DialogTitle>Add New Doctor</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Doctor Name"
            fullWidth
            variant="outlined"
            value={newDoctor.doctorName}
            onChange={(e) => setNewDoctor({ ...newDoctor, doctorName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={newDoctor.email}
            onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newDoctor.password}
            onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Specialization"
            fullWidth
            variant="outlined"
            value={newDoctor.specialization}
            onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDoctorDialog(false)}>Cancel</Button>
          <Button onClick={addDoctor} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddAppointmentDialog} onClose={() => setOpenAddAppointmentDialog(false)}>
        <DialogTitle>Add New Appointment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Patient ID"
            fullWidth
            variant="outlined"
            value={newAppointment.patientId}
            onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Doctor ID"
            fullWidth
            variant="outlined"
            value={newAppointment.doctorId}
            onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Hospital ID"
            fullWidth
            variant="outlined"
            value={newAppointment.hospitalId}
            onChange={(e) => setNewAppointment({ ...newAppointment, hospitalId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date & Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={newAppointment.dateTime}
            onChange={(e) => setNewAppointment({ ...newAppointment, dateTime: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddAppointmentDialog(false)}>Cancel</Button>
          <Button onClick={addAppointment} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDashboard;

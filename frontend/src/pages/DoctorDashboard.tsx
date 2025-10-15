import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../components/ConfirmationDialog';
import FileUpload from '../components/FileUpload';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decoded: any = token ? jwtDecode(token) : null;
  const doctorId = decoded ? decoded.sub : '';

  const [tabValue, setTabValue] = useState<number>(0);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // For availability form
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // For record form
  const [recordPatientId, setRecordPatientId] = useState('');
  const [recordDiagnosis, setRecordDiagnosis] = useState('');
  const [recordTreatment, setRecordTreatment] = useState('');
  const [recordPrescription, setRecordPrescription] = useState('');
  const [recordReport, setRecordReport] = useState('');
  const [prescriptionFilePath, setPrescriptionFilePath] = useState('');
  const [prescriptionFileName, setPrescriptionFileName] = useState('');
  const [reportFilePath, setReportFilePath] = useState('');
  const [reportFileName, setReportFileName] = useState('');

  // For patient profile
  const [searchPatientId, setSearchPatientId] = useState('');

  // Confirmation dialog state
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchAvailabilities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/doctor/availability/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAvailabilities(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load availabilities',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [doctorId, token]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/doctor/appointments/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load appointments',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [doctorId, token]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/doctor/records/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecords(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load records',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [doctorId, token]);

  const addAvailability = async () => {
    if (!selectedDate || !selectedTime) return;
    try {
      const availability = {
        doctorId: parseInt(doctorId),
        date: selectedDate,
        time: selectedTime,
      };
      await axios.post('http://localhost:8080/api/doctor/availability', availability, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: 'Availability added successfully',
        severity: 'success',
      });
      fetchAvailabilities();
      setSelectedDate('');
      setSelectedTime('');
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Failed to add availability';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const deleteAvailability = async (availabilityId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/doctor/availability/${availabilityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: 'Availability deleted successfully',
        severity: 'success',
      });
      fetchAvailabilities();
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Failed to delete availability';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      await axios.put(`http://localhost:8080/api/doctor/appointments/${appointmentId}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: 'Appointment status updated',
        severity: 'success',
      });
      fetchAppointments();
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Failed to update status';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const createRecord = async () => {
    if (!recordPatientId || !recordDiagnosis || !recordTreatment) return;
    try {
      const record = {
        doctorId: doctorId,
        patientId: recordPatientId,
        diagnosis: recordDiagnosis,
        treatment: recordTreatment,
        prescription: recordPrescription,
        report: recordReport,
        prescriptionFilePath: prescriptionFilePath,
        reportFilePath: reportFilePath,
      };
      await axios.post('http://localhost:8080/api/doctor/records', record, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: 'Record created successfully',
        severity: 'success',
      });
      fetchRecords();
      // Reset form
      setRecordPatientId('');
      setRecordDiagnosis('');
      setRecordTreatment('');
      setRecordPrescription('');
      setRecordReport('');
      setPrescriptionFilePath('');
      setPrescriptionFileName('');
      setReportFilePath('');
      setReportFileName('');
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Failed to create record';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const fetchPatientProfile = async () => {
    if (!searchPatientId) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/doctor/patient/${searchPatientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPatientProfile(response.data);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: 'Failed to load patient profile',
        severity: 'error',
      });
      setPatientProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchAvailabilities();
      fetchAppointments();
      fetchRecords();
    }
  }, [doctorId, fetchAvailabilities, fetchAppointments, fetchRecords]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Doctor Dashboard
            </Typography>
            <Button color="inherit" onClick={() => navigate('/change-password')}>
              Change Password
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Doctor Dashboard
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Manage Availability" />
            <Tab label="Appointments" />
            <Tab label="Medical Records" />
            <Tab label="Patient Profiles" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current Availabilities
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availabilities.map((avail) => (
                        <TableRow key={avail.id}>
                          <TableCell>{avail.date}</TableCell>
                          <TableCell>{avail.time}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => {
                                setConfirmationDialog({
                                  open: true,
                                  title: 'Delete Availability',
                                  message: `Are you sure you want to delete the availability slot on ${avail.date} at ${avail.time}?`,
                                  onConfirm: () => {
                                    deleteAvailability(avail.id);
                                    setConfirmationDialog({ open: false, title: '', message: '', onConfirm: () => {} });
                                  },
                                });
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Add New Availability
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate ? dayjs(selectedDate) : null}
                    onChange={(newDate: Dayjs | null) =>
                      setSelectedDate(newDate ? newDate.format('YYYY-MM-DD') : '')
                    }
                    slotProps={{ textField: { fullWidth: false } }}
                  />
                  <TimePicker
                    label="Select Time"
                    value={selectedTime ? dayjs(`2025-01-01T${selectedTime}`) : null}
                    onChange={(newTime: Dayjs | null) =>
                      setSelectedTime(newTime ? newTime.format('HH:mm') : '')
                    }
                    slotProps={{ textField: { fullWidth: false } }}
                  />
                  <Button variant="contained" onClick={addAvailability}>
                    Add Availability
                  </Button>
                </Box>
              </Box>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Appointments
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((appt) => (
                        <TableRow key={appt.id}>
                          <TableCell>{appt.patientName}</TableCell>
                          <TableCell>{appt.dateTime}</TableCell>
                          <TableCell>{appt.status}</TableCell>
                          <TableCell>
                            <FormControl size="small">
                              <Select
                                value=""
                                onChange={(e) => {
                                  if ((e.target.value as string) === 'CANCELLED') {
                                    setConfirmationDialog({
                                      open: true,
                                      title: 'Cancel Appointment',
                                      message: `Are you sure you want to cancel the appointment with ${appt.patientName} on ${appt.dateTime}?`,
                                      onConfirm: () => {
                                        updateAppointmentStatus(appt.id, 'CANCELLED');
                                        setConfirmationDialog({ open: false, title: '', message: '', onConfirm: () => {} });
                                      },
                                    });
                                  } else {
                                    updateAppointmentStatus(appt.id, e.target.value as string);
                                  }
                                }}
                              >
                                <MenuItem value="COMPLETED">Mark Completed</MenuItem>
                                <MenuItem value="CANCELLED">Cancel</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Medical Records
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient</TableCell>
                        <TableCell>Diagnosis</TableCell>
                        <TableCell>Treatment</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.patientName}</TableCell>
                          <TableCell>{record.diagnosis}</TableCell>
                          <TableCell>{record.treatment}</TableCell>
                          <TableCell>{record.createdAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Create New Record
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Patient ID"
                    value={recordPatientId}
                    onChange={(e) => setRecordPatientId(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Diagnosis"
                    value={recordDiagnosis}
                    onChange={(e) => setRecordDiagnosis(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="Treatment"
                    value={recordTreatment}
                    onChange={(e) => setRecordTreatment(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="Prescription (optional)"
                    value={recordPrescription}
                    onChange={(e) => setRecordPrescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="Report (optional)"
                    value={recordReport}
                    onChange={(e) => setRecordReport(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />

                  <FileUpload
                    label="Prescription File"
                    onFileUploaded={(filePath, fileName) => {
                      setPrescriptionFilePath(filePath);
                      setPrescriptionFileName(fileName);
                    }}
                    onFileRemoved={() => {
                      setPrescriptionFilePath('');
                      setPrescriptionFileName('');
                    }}
                    currentFilePath={prescriptionFilePath}
                    currentFileName={prescriptionFileName}
                  />

                  <FileUpload
                    label="Report File"
                    onFileUploaded={(filePath, fileName) => {
                      setReportFilePath(filePath);
                      setReportFileName(fileName);
                    }}
                    onFileRemoved={() => {
                      setReportFilePath('');
                      setReportFileName('');
                    }}
                    currentFilePath={reportFilePath}
                    currentFileName={reportFileName}
                  />

                  <Button variant="contained" onClick={createRecord}>
                    Create Record
                  </Button>
                </Box>
              </Box>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Patient Profile Search
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <TextField
                  label="Patient ID"
                  value={searchPatientId}
                  onChange={(e) => setSearchPatientId(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={fetchPatientProfile}>
                  Search
                </Button>
              </Box>
              {patientProfile && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Patient Details
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Patient ID:</strong></TableCell>
                          <TableCell>{patientProfile.patientId}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Name:</strong></TableCell>
                          <TableCell>{patientProfile.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Email:</strong></TableCell>
                          <TableCell>{patientProfile.email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Phone:</strong></TableCell>
                          <TableCell>{patientProfile.phone}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Date of Birth:</strong></TableCell>
                          <TableCell>{patientProfile.dateOfBirth}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Age:</strong></TableCell>
                          <TableCell>{patientProfile.age}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Gender:</strong></TableCell>
                          <TableCell>{patientProfile.gender}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Weight:</strong></TableCell>
                          <TableCell>{patientProfile.weight}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Paper>
          </TabPanel>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <ConfirmationDialog
          open={confirmationDialog.open}
          title={confirmationDialog.title}
          message={confirmationDialog.message}
          onConfirm={confirmationDialog.onConfirm}
          onCancel={() => setConfirmationDialog({ open: false, title: '', message: '', onConfirm: () => {} })}
        />
      </>
    </LocalizationProvider>
  );
};

export default DoctorDashboard;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

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

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded: any = token ? jwtDecode(token) : null;
  const patientId = decoded ? decoded.sub : "";

  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<any>(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAvailabilities, setLoadingAvailabilities] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [tabValue, setTabValue] = useState<number>(0);

  // New states for additional tabs
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [loadingMedicalHistory, setLoadingMedicalHistory] = useState(false);

  const [prescriptions, setPrescriptions] = useState<string[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  const [labResults, setLabResults] = useState<string[]>([]);
  const [loadingLabResults, setLoadingLabResults] = useState(false);

  const [reminders, setReminders] = useState<any[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(false);

  const [profile, setProfile] = useState<any>({});
  const [loadingProfile, setLoadingProfile] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/patient/doctors",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDoctors(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load doctors",
        severity: "error",
      });
    } finally {
      setLoadingDoctors(false);
    }
  }, [token]);

  const fetchAvailabilities = useCallback(async (doctorId: number) => {
    setLoadingAvailabilities(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/patient/availabilities/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAvailabilities(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load availabilities",
        severity: "error",
      });
    } finally {
      setLoadingAvailabilities(false);
    }
  }, [token]);



  const bookAppointment = async () => {
    if (!selectedDoctor || !selectedAvailability) return;
    try {
      const appointment = {
        patientId,
        doctorId: selectedDoctor.id,
        hospitalId: selectedDoctor.hospitalId,
        dateTime: selectedAvailability.dateTime,
      };
      await axios.post("http://localhost:8080/api/patient/appointments", appointment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: "Appointment booked successfully",
        severity: "success",
      });
      // Refresh appointments after booking
      fetchAppointments();
      // Reset selections
      setSelectedDoctor(null);
      setAvailabilities([]);
      setSelectedAvailability(null);
    } catch (error: any) {
      const errorMessage = error.response?.data || "Failed to book appointment";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // New fetch functions for additional tabs
  const fetchAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/patient/appointments/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load appointments",
        severity: "error",
      });
    } finally {
      setLoadingAppointments(false);
    }
  }, [patientId, token]);

  const fetchMedicalHistory = useCallback(async () => {
    setLoadingMedicalHistory(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/patient/history/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedicalHistory(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load medical history",
        severity: "error",
      });
    } finally {
      setLoadingMedicalHistory(false);
    }
  }, [patientId, token]);

  const fetchPrescriptions = useCallback(async () => {
    setLoadingPrescriptions(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/patient/prescriptions/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPrescriptions(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load prescriptions",
        severity: "error",
      });
    } finally {
      setLoadingPrescriptions(false);
    }
  }, [patientId, token]);

  const fetchLabResults = useCallback(async () => {
    setLoadingLabResults(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/patient/lab-results/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLabResults(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load lab results",
        severity: "error",
      });
    } finally {
      setLoadingLabResults(false);
    }
  }, [patientId, token]);

  const fetchReminders = useCallback(async () => {
    setLoadingReminders(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/patient/reminders/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReminders(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load reminders",
        severity: "error",
      });
    } finally {
      setLoadingReminders(false);
    }
  }, [patientId, token]);

  const fetchPatientProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/patient/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load patient profile",
        severity: "error",
      });
    } finally {
      setLoadingProfile(false);
    }
  }, [token]);

  const updateProfile = async () => {
    try {
      await axios.put("http://localhost:8080/api/patient/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchMedicalHistory();
    fetchPrescriptions();
    fetchLabResults();
    fetchReminders();
    fetchPatientProfile();
  }, [
    fetchDoctors,
    fetchAppointments,
    fetchMedicalHistory,
    fetchPrescriptions,
    fetchLabResults,
    fetchReminders,
    fetchPatientProfile,
  ]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patient Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate("/change-password")}>
            Change Password
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Book Appointment" />
          <Tab label="My Appointments" />
          <Tab label="Medical History" />
          <Tab label="Prescriptions" />
          <Tab label="Lab Results" />
          <Tab label="Reminders" />
          <Tab label="Patient Profile" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {/* Doctor Dropdown */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Select Doctor</InputLabel>
                  {loadingDoctors ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Select
                      value={selectedDoctor ? selectedDoctor.id : ""}
                      onChange={(e) => {
                        const doctor = doctors.find(
                          (d) => d.id === e.target.value
                        );
                        setSelectedDoctor(doctor);
                        setAvailabilities([]);
                        setSelectedAvailability(null);
                        if (doctor) {
                          fetchAvailabilities(doctor.id);
                        }
                      }}
                    >
                      {doctors.map((doc) => (
                        <MenuItem key={doc.id} value={doc.id}>
                          {doc.doctorName} ({doc.specialization})
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
              </Grid>

              {/* Availability Dropdown */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Select Available Slot</InputLabel>
                  {loadingAvailabilities ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Select
                      value={selectedAvailability ? selectedAvailability.id : ""}
                      onChange={(e) => {
                        const availability = availabilities.find(
                          (a) => a.id === e.target.value
                        );
                        setSelectedAvailability(availability);
                      }}
                      disabled={!selectedDoctor}
                    >
                      {availabilities.map((avail) => (
                        <MenuItem key={avail.id} value={avail.id}>
                          {dayjs(avail.dateTime).format("MMM DD, YYYY hh:mm A")}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedDoctor || !selectedAvailability}
                onClick={bookAppointment}
              >
                Book Appointment
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setSelectedDoctor(null);
                  setAvailabilities([]);
                  setSelectedAvailability(null);
                }}
              >
                Reset
              </Button>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Appointments
            </Typography>
            {loadingAppointments ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell>{appt.doctorName}</TableCell>
                        <TableCell>{appt.dateTime}</TableCell>
                        <TableCell>{appt.status}</TableCell>
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
              Medical History
            </Typography>
            {loadingMedicalHistory ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Diagnosis</TableCell>
                      <TableCell>Treatment</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicalHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.doctorName}</TableCell>
                        <TableCell>{record.diagnosis}</TableCell>
                        <TableCell>{record.treatment}</TableCell>
                        <TableCell>{record.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Prescriptions
            </Typography>
            {loadingPrescriptions ? (
              <CircularProgress />
            ) : (
              <ul>
                {prescriptions.map((prescription, index) => (
                  <li key={index}>{prescription}</li>
                ))}
              </ul>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lab Results
            </Typography>
            {loadingLabResults ? (
              <CircularProgress />
            ) : (
              <ul>
                {labResults.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reminders
            </Typography>
            {loadingReminders ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Message</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reminders.map((reminder) => (
                      <TableRow key={reminder.id}>
                        <TableCell>{reminder.message}</TableCell>
                        <TableCell>{reminder.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </TabPanel>
        <TabPanel value={tabValue} index={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Profile
            </Typography>
            {loadingProfile ? (
              <CircularProgress />
            ) : (
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="First Name"
                  value={profile.firstName || ""}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  value={profile.lastName || ""}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Phone"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Age"
                  type="number"
                  value={profile.age || ""}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  fullWidth
                />
                <TextField
                  label="Weight"
                  type="number"
                  value={profile.weight || ""}
                  onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                  fullWidth
                />
                <TextField
                  label="Gender"
                  value={profile.gender || ""}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  fullWidth
                />
                  <TextField
                    label="Date of Birth"
                    type="date"
                    value={profile.dateOfBirth || ""}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                <Button variant="contained" onClick={updateProfile}>
                  Save Profile
                </Button>
              </Box>
            )}
          </Paper>
        </TabPanel>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PatientDashboard;

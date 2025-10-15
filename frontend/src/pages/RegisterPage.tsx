import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const steps = ['Account Type', 'Personal Information', 'Professional Details', 'Review'];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    hospitalName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    gender: '',
    weight: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 0:
        if (!formData.role) newErrors.role = 'Please select an account type';
        break;
      case 1:
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (formData.role === 'USER') {
          if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
          if (!formData.gender) newErrors.gender = 'Gender is required';
        }
        break;
      case 2:
        if (formData.role === 'DOCTOR') {
          if (!formData.specialization) newErrors.specialization = 'Specialization is required';
          if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
        } else if (formData.role === 'HOSPITAL') {
          if (!formData.hospitalName) newErrors.hospitalName = 'Hospital name is required';
          if (!formData.address) newErrors.address = 'Address is required';
          if (!formData.city) newErrors.city = 'City is required';
          if (!formData.state) newErrors.state = 'State is required';
          if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      const registrationData = {
        ...formData,
        role: formData.role.toUpperCase(),
      };

      await axios.post('http://localhost:8080/api/auth/register', registrationData);
      setSnackbar({
        open: true,
        message: 'Registration successful! Please wait for admin approval.',
        severity: 'success',
      });
      setTimeout(() => navigate('/approval-pending'), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Registration failed';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Account Type</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                label="Account Type"
              >
                <MenuItem value="USER">Patient</MenuItem>
                <MenuItem value="DOCTOR">Doctor</MenuItem>
                <MenuItem value="HOSPITAL">Hospital</MenuItem>
              </Select>
              {errors.role && <Typography color="error" variant="caption">{errors.role}</Typography>}
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
            />
            {formData.role === 'USER' && (
              <>
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    label="Gender"
                  >
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                  {errors.gender && <Typography color="error" variant="caption">{errors.gender}</Typography>}
                </FormControl>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  fullWidth
                />
              </>
            )}
          </Box>
        );
      case 2:
        if (formData.role === 'DOCTOR') {
          return (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Specialization"
                value={formData.specialization}
                onChange={(e) => handleChange('specialization', e.target.value)}
                error={!!errors.specialization}
                helperText={errors.specialization}
                fullWidth
              />
              <TextField
                label="License Number"
                value={formData.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                error={!!errors.licenseNumber}
                helperText={errors.licenseNumber}
                fullWidth
              />
            </Box>
          );
        } else if (formData.role === 'HOSPITAL') {
          return (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Hospital Name"
                value={formData.hospitalName}
                onChange={(e) => handleChange('hospitalName', e.target.value)}
                error={!!errors.hospitalName}
                helperText={errors.hospitalName}
                fullWidth
              />
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
              />
              <TextField
                label="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                error={!!errors.city}
                helperText={errors.city}
                fullWidth
              />
              <TextField
                label="State"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                error={!!errors.state}
                helperText={errors.state}
                fullWidth
              />
              <TextField
                label="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                fullWidth
              />
            </Box>
          );
        }
        return null;
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Typography><strong>Account Type:</strong> {formData.role}</Typography>
            <Typography><strong>Name:</strong> {formData.name}</Typography>
            <Typography><strong>Email:</strong> {formData.email}</Typography>
            <Typography><strong>Phone:</strong> {formData.phone}</Typography>
            {formData.role === 'USER' && (
              <>
                <Typography><strong>Date of Birth:</strong> {formData.dateOfBirth}</Typography>
                <Typography><strong>Gender:</strong> {formData.gender}</Typography>
                <Typography><strong>Weight:</strong> {formData.weight} kg</Typography>
              </>
            )}
            {formData.role === 'DOCTOR' && (
              <>
                <Typography><strong>Specialization:</strong> {formData.specialization}</Typography>
                <Typography><strong>License Number:</strong> {formData.licenseNumber}</Typography>
              </>
            )}
            {formData.role === 'HOSPITAL' && (
              <>
                <Typography><strong>Hospital Name:</strong> {formData.hospitalName}</Typography>
                <Typography><strong>Address:</strong> {formData.address}</Typography>
                <Typography><strong>City:</strong> {formData.city}</Typography>
                <Typography><strong>State:</strong> {formData.state}</Typography>
                <Typography><strong>ZIP Code:</strong> {formData.zipCode}</Typography>
              </>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Register for Healthcare System
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} variant="contained">
                Register
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained">
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;

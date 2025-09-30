import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from '@mui/material';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [specialization, setSpecialization] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    setSpecialization('');
    setHospitalId('');
    setAddress('');
    setPhone('');
    setPatientPhone('');
  }, [role]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (role === 'USER') {
        await axios.post('http://localhost:8080/api/auth/register/patient', { name, email, password, phone: patientPhone });
        alert('Registration successful. Please login.');
        navigate('/login');
      } else if (role === 'HOSPITAL') {
        await axios.post('http://localhost:8080/api/auth/register/hospital', { hospitalName: name, email, password, address, phone });
        alert('Registration successful. Please wait for admin approval before logging in.');
      } else if (role === 'DOCTOR') {
        await axios.post('http://localhost:8080/api/auth/register/doctor', { doctorName: name, email, password, specialization, hospitalId: Number(hospitalId) });
        alert('Registration successful. Please login.');
        navigate('/login');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Register
          </Typography>
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {role === 'USER' && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Phone"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
              />
            )}

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="USER">Patient</MenuItem>
                <MenuItem value="HOSPITAL">Hospital</MenuItem>
                <MenuItem value="DOCTOR">Doctor</MenuItem>
              </Select>
            </FormControl>

            {role === 'HOSPITAL' && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            {role === 'DOCTOR' && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Hospital ID"
                  type="number"
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                />
              </>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;

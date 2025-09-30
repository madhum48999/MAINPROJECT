import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HospitalDashboard: React.FC = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Hospital Dashboard
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
          Welcome to the Hospital Dashboard
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Manage Appointments
              </Typography>
              <Typography variant="body2">
                View and manage patient appointments.
              </Typography>
              {/* TODO: Implement appointment management */}
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Medical Records
              </Typography>
              <Typography variant="body2">
                Manage patient medical records.
              </Typography>
              {/* TODO: Implement medical record management */}
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default HospitalDashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
} from '@mui/material';
import axios from 'axios';

const ApprovalPendingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checking, setChecking] = useState(true);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      const requestId = localStorage.getItem('pendingRequestId');
      const requestType = localStorage.getItem('pendingRequestType');

      if (!requestId || !requestType) {
        setChecking(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/auth/${requestType}-request-status/${requestId}`);
        if (response.data === 'APPROVED') {
          setIsApproved(true);
          setShowApprovalMessage(true);
          localStorage.removeItem('pendingRequestId');
          localStorage.removeItem('pendingRequestType');
          // Auto redirect immediately
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkApproval();

    // Check every 5 seconds
    const interval = setInterval(checkApproval, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (isApproved) {
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
          <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
            <Typography component="h1" variant="h4" gutterBottom color="success.main">
              Account Approved!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Congratulations! Your registration has been approved.
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You can now login to your account and start using the system.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Redirecting to login page...
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginRedirect}
              sx={{ mt: 3 }}
            >
              Go to Login Now
            </Button>
          </Paper>
        </Box>
        <Snackbar
          open={showApprovalMessage}
          autoHideDuration={3000}
          onClose={() => setShowApprovalMessage(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Your profile has been approved successfully! Please login.
          </Alert>
        </Snackbar>
      </Container>
    );
  }

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
        <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Registration Successful
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress size={60} />
          </Box>
          <Typography variant="h6" gutterBottom>
            Your registration request has been submitted.
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Please wait while an admin reviews and approves your request.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page will automatically refresh when your account is approved.
          </Typography>
          <Alert severity="info" sx={{ mt: 3 }}>
            This process may take some time. Please check back later or contact support if you have any questions.
          </Alert>
          <Button
            variant="outlined"
            onClick={handleLoginRedirect}
            sx={{ mt: 2 }}
          >
            Back to Login
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default ApprovalPendingPage;

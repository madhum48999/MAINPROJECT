import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, IconButton, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import Breadcrumb from './components/Breadcrumb';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApprovalPendingPage from './pages/ApprovalPendingPage';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SearchResultsPage from './pages/SearchResultsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const decoded: any = jwtDecode(token);
    if (requiredRole && decoded.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    return element;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
          background: {
            default: darkMode ? '#121212' : '#fafafa',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: darkMode
                  ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                  : '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? 'dark' : 'light'}
        />
        <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <Breadcrumb />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/approval-pending" element={<ApprovalPendingPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/change-password" element={<ProtectedRoute element={<ChangePasswordPage />} />} />
              <Route path="/patient" element={<ProtectedRoute element={<PatientDashboard />} requiredRole="USER" />} />
              <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="ADMIN" />} />
              <Route path="/hospital" element={<ProtectedRoute element={<HospitalDashboard />} requiredRole="HOSPITAL" />} />
              <Route path="/doctor" element={<ProtectedRoute element={<DoctorDashboard />} requiredRole="DOCTOR" />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/doctor-profile/:doctorId" element={<DoctorProfilePage />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

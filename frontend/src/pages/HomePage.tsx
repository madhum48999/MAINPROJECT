import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const sections = [
  {
    title: 'Instant Video Consultation',
    description: 'Connect within 60 secs',
    image: 'img1.jpg',
  },
  {
    title: 'Find Doctors Near You',
    description: 'Confirmed appointments',
    image: 'https://static.practo.com/consult/consult-home/consult-home-2.svg',
  },
  {
    title: 'Surgeries',
    description: 'Safe and trusted surgery centers',
    image: 'https://static.practo.com/consult/consult-home/consult-home-3.svg',
  },
];

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Healthcare Appointment Booking System
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Book appointments with doctors and hospitals easily.
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search doctors, clinics, hospitals, etc."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Sections */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
        {sections.map((section) => (
          <Box key={section.title} sx={{ flex: '1 1 300px', maxWidth: 400 }}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardMedia
                component="img"
                image={section.image}
                alt={section.title}
                sx={{ width: '80%', height: 'auto', mx: 'auto', mb: 2 }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {section.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Login/Register Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 6 }}>
        <Button component={Link} to="/login" variant="contained" size="large">
          Login
        </Button>
        <Button component={Link} to="/register" variant="outlined" size="large">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;

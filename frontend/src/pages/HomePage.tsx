import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            fontWeight: 700,
          }}
        >
          Healthcare Appointment Booking System
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          gutterBottom
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            px: { xs: 1, sm: 0 },
          }}
        >
          Book appointments with doctors and hospitals easily.
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ maxWidth: { xs: '100%', sm: 600 }, mx: 'auto', mb: { xs: 4, md: 6 }, px: { xs: 1, sm: 0 } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search doctors, clinics, hospitals, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            },
          }}
        />
      </Box>

      {/* Sections */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: 2, md: 4 },
          px: { xs: 1, sm: 0 },
        }}
      >
        {sections.map((section) => (
          <Box
            key={section.title}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 300px' },
              maxWidth: { xs: '100%', sm: 350, md: 400 },
              minWidth: { xs: '100%', sm: 280 },
            }}
          >
            <Card
              sx={{
                textAlign: 'center',
                p: { xs: 1.5, sm: 2 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <CardMedia
                component="img"
                image={section.image}
                alt={section.title}
                sx={{
                  width: { xs: '60%', sm: '70%', md: '80%' },
                  height: 'auto',
                  mx: 'auto',
                  mb: 2,
                  borderRadius: 1,
                }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                    fontWeight: 600,
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  }}
                >
                  {section.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Login/Register Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 2, sm: 2 },
          mt: { xs: 4, md: 6 },
          px: { xs: 2, sm: 0 },
        }}
      >
        <Button
          component={Link}
          to="/login"
          variant="contained"
          size="large"
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: { xs: '100%', sm: 120 },
            fontSize: { xs: '1rem', sm: '1.1rem' },
          }}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/register"
          variant="outlined"
          size="large"
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: { xs: '100%', sm: 120 },
            fontSize: { xs: '1rem', sm: '1.1rem' },
          }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;

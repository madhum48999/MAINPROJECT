import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  SelectChangeEvent,
  Skeleton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';

interface Doctor {
  did: number;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  hospitalId?: string;
}

interface Hospital {
  hid: number;
  name: string;
  hospitalName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  phone: string;
}

interface SearchResults<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '0'));
  const [size] = useState(10);

  const [doctorResults, setDoctorResults] = useState<SearchResults<Doctor> | null>(null);
  const [hospitalResults, setHospitalResults] = useState<SearchResults<Hospital> | null>(null);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      searchDoctors();
    } else {
      searchHospitals();
    }
  }, [activeTab, query, specialization, city, page]);

  const fetchFilters = async () => {
    try {
      const [specRes, cityRes] = await Promise.all([
        axios.get('/api/search/specializations'),
        axios.get('/api/search/cities')
      ]);
      setSpecializations(specRes.data);
      setCities(cityRes.data);
      showSuccessToast('Filters loaded successfully');
    } catch (err) {
      console.error('Error fetching filters:', err);
      showErrorToast('Failed to load filters');
    }
  };

  const searchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (specialization) params.append('specialization', specialization);
      params.append('page', page.toString());
      params.append('size', size.toString());

      const response = await axios.get(`/api/search/doctors?${params}`);
      setDoctorResults(response.data);
    } catch (err) {
      setError('Failed to search doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchHospitals = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (city) params.append('city', city);
      params.append('page', page.toString());
      params.append('size', size.toString());

      const response = await axios.get(`/api/search/hospitals?${params}`);
      setHospitalResults(response.data);
    } catch (err) {
      setError('Failed to search hospitals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (specialization) params.set('specialization', specialization);
    if (city) params.set('city', city);
    params.set('page', '0');
    setSearchParams(params);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  const renderDoctorCard = (doctor: Doctor): React.JSX.Element => (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doctor.did}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h3">
              {doctor.name}
            </Typography>
          </Box>
          <Chip
            label={doctor.specialization}
            color="primary"
            size="small"
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {doctor.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {doctor.phone}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => navigate(`/doctor-profile/${doctor.did}`)}
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderHospitalCard = (hospital: Hospital) => (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={hospital.hid}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="h3">
              {hospital.hospitalName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, fontSize: '1rem' }} />
            <Typography variant="body2" color="text.secondary">
              {hospital.city}, {hospital.state}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {hospital.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hospital.phone}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => navigate(`/hospital-profile/${hospital.hid}`)}
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results
      </Typography>

      {/* Search Filters */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Search"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          {activeTab === 0 ? (
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Specialization</InputLabel>
                <Select
                  value={specialization}
                  label="Specialization"
                  onChange={(e: SelectChangeEvent) => setSpecialization(e.target.value)}
                >
                  <MenuItem value="">All Specializations</MenuItem>
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : (
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <Select
                  value={city}
                  label="City"
                  onChange={(e: SelectChangeEvent) => setCity(e.target.value)}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {cities.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Search for doctors or hospitals by name, specialization, or location.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Doctors" />
          <Tab label="Hospitals" />
        </Tabs>
      </Box>

      {/* Results */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            <Skeleton width={200} />
          </Typography>
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width="40%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <>
          {activeTab === 0 && doctorResults && (
            <>
              <Typography variant="h6" gutterBottom>
                Found {doctorResults.totalElements} doctors
              </Typography>
              <Grid container spacing={3}>
                {doctorResults.content.map((doctor) => renderDoctorCard(doctor))}
              </Grid>
              {doctorResults.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={doctorResults.totalPages}
                    page={doctorResults.number + 1}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}

          {activeTab === 1 && hospitalResults && (
            <>
              <Typography variant="h6" gutterBottom>
                Found {hospitalResults.totalElements} hospitals
              </Typography>
              <Grid container spacing={3}>
                {hospitalResults.content.map((hospital) => renderHospitalCard(hospital))}
              </Grid>
              {hospitalResults.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={hospitalResults.totalPages}
                    page={hospitalResults.number + 1}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchResultsPage;

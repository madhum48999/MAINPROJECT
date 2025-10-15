import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Rating,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import StarIcon from '@mui/icons-material/Star';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface Doctor {
  did: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  hospitalId?: string;
  licenseNumber: string;
}

interface Review {
  id: number;
  reviewerId: string;
  reviewedEntityId: string;
  reviewedEntityType: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

interface RatingSummary {
  averageRating: number;
  reviewCount: number;
}

const DoctorProfilePage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, reviewText: '' });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    fetchDoctorProfile();
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const [doctorRes, reviewsRes, ratingRes] = await Promise.all([
        axios.get(`/api/doctors/${doctorId}`),
        axios.get(`/api/reviews/entity/${doctorId}?entityType=DOCTOR`),
        axios.get(`/api/reviews/rating/${doctorId}?entityType=DOCTOR`),
      ]);

      setDoctor(doctorRes.data);
      setReviews(reviewsRes.data);
      setRatingSummary(ratingRes.data);
    } catch (err: any) {
      setError('Failed to load doctor profile');
      console.error('Error fetching doctor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!currentUser || newReview.rating === 0) {
      showErrorToast('Please provide a rating');
      return;
    }

    try {
      const reviewData = {
        reviewerId: currentUser.sub,
        reviewedEntityId: doctorId,
        reviewedEntityType: 'DOCTOR',
        rating: newReview.rating,
        reviewText: newReview.reviewText,
      };

      await axios.post('/api/reviews', reviewData);
      setReviewDialogOpen(false);
      setNewReview({ rating: 0, reviewText: '' });
      showSuccessToast('Review submitted successfully');
      fetchDoctorProfile(); // Refresh reviews
    } catch (err: any) {
      showErrorToast('Failed to submit review');
      console.error('Error submitting review:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !doctor) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Doctor not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Doctor Profile Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Dr. {doctor.name}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {doctor.specialization}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={ratingSummary?.averageRating || 0} readOnly precision={0.1} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({ratingSummary?.reviewCount || 0} reviews)
                  </Typography>
                </Box>
                <Chip
                  icon={<LocalHospitalIcon />}
                  label={`License: ${doctor.licenseNumber}`}
                  variant="outlined"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/book-appointment/${doctor.did}`)}
              >
                Book Appointment
              </Button>
              {currentUser && (
                <Button
                  variant="outlined"
                  onClick={() => setReviewDialogOpen(true)}
                >
                  Write Review
                </Button>
              )}
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {doctor.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Phone:</strong> {doctor.phone}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Hospital ID:</strong> {doctor.hospitalId || 'Not specified'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Reviews ({reviews.length})
            </Typography>
          </Box>

          {reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No reviews yet. Be the first to review this doctor!
            </Typography>
          ) : (
            <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
              {reviews.map((review, index) => (
                <Box key={review.id} sx={{ mb: index < reviews.length - 1 ? 3 : 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body1">{review.reviewText}</Typography>
                  {index < reviews.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography component="legend" gutterBottom>
              Rating
            </Typography>
            <Rating
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview(prev => ({ ...prev, rating: newValue || 0 }));
              }}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={newReview.reviewText}
              onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorProfilePage;

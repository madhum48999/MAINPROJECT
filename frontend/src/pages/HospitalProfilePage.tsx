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
  CircularProgress,
  Alert,
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface Hospital {
  hid: string;
  name: string;
  hospitalName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  contact: string;
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

const HospitalProfilePage: React.FC = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState<Hospital | null>(null);
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
    fetchHospitalProfile();
  }, [hospitalId]);

  const fetchHospitalProfile = async () => {
    try {
      setLoading(true);
      const [hospitalRes, reviewsRes, ratingRes] = await Promise.all([
        axios.get(`/api/hospital/${hospitalId}`),
        axios.get(`/api/reviews/entity/${hospitalId}?entityType=HOSPITAL`),
        axios.get(`/api/reviews/rating/${hospitalId}?entityType=HOSPITAL`),
      ]);

      setHospital(hospitalRes.data);
      setReviews(reviewsRes.data);
      setRatingSummary(ratingRes.data);
    } catch (err: any) {
      setError('Failed to load hospital profile');
      console.error('Error fetching hospital profile:', err);
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
        reviewedEntityId: hospitalId,
        reviewedEntityType: 'HOSPITAL',
        rating: newReview.rating,
        reviewText: newReview.reviewText,
      };

      await axios.post('/api/reviews', reviewData);
      setReviewDialogOpen(false);
      setNewReview({ rating: 0, reviewText: '' });
      showSuccessToast('Review submitted successfully');
      fetchHospitalProfile(); // Refresh reviews
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

  if (error || !hospital) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Hospital not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hospital Profile Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
              <LocalHospitalIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {hospital.hospitalName}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {hospital.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={ratingSummary?.averageRating || 0} readOnly precision={0.1} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({ratingSummary?.reviewCount || 0} reviews)
                  </Typography>
                </Box>
                <Chip
                  icon={<LocationOnIcon />}
                  label={`${hospital.city}, ${hospital.state}`}
                  variant="outlined"
                />
              </Box>
            </Box>
            {currentUser && (
              <Button
                variant="contained"
                onClick={() => setReviewDialogOpen(true)}
                startIcon={<StarIcon />}
              >
                Write Review
              </Button>
            )}
          </Box>

          {/* Hospital Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {hospital.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Phone:</strong> {hospital.phone}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Address:</strong> {hospital.address}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>ZIP Code:</strong> {hospital.zipCode}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Reviews
          </Typography>
          {reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No reviews yet. Be the first to review this hospital!
            </Typography>
          ) : (
            reviews.map((review) => (
              <Box key={review.id} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body1">{review.reviewText}</Typography>
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Rating:
            </Typography>
            <Rating
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview({ ...newReview, rating: newValue || 0 });
              }}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={newReview.reviewText}
              onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
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

export default HospitalProfilePage;

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axios';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';

export default function DeletePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setError('Post id is missing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axiosInstance.delete(`post/admin/delete/${id}/`);
      navigate('/admin/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to delete post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4,
          border: '1px solid #e5e7eb',
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Delete Post
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: '#374151' }}>
          Are you sure you want to delete this post?
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ minWidth: 220, py: 1.5 }}
        >
          {loading ? (
            <>
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              Deleting...
            </>
          ) : (
            'Confirm Delete'
          )}
        </Button>
      </Box>
    </Container>
  );
}
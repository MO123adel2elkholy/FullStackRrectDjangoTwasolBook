// ...existing code...
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
}));

const StyledPaper = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: '2px solid rgba(245, 158, 11, 0.3)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(245, 158, 11, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#f59e0b',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
      opacity: 1,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#f59e0b',
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
  color: '#111827',
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  marginTop: theme.spacing(2),
  marginRight: theme.spacing(1),
  '&:hover': {
    background: 'linear-gradient(90deg, #fbbf24 0%, #fcd34d 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(245, 158, 11, 0.4)',
  },
  transition: 'all 0.3s ease',
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  borderColor: 'rgba(255, 255, 255, 0.3)',
  textTransform: 'none',
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  marginTop: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
}));

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const initialFormData = {
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    let isMounted = true;
    const endpoint = `post/admin/edit/postdetail/${id}/`;

    setLoading(true);
    setError('');
    setSuccess('');

    (async () => {
      try {
        const res = await axiosInstance.get(endpoint);
        if (!isMounted) return;
        setFormData({
          id: res.data.id ?? id ?? '',
          title: res.data.title ?? '',
          slug: res.data.slug ?? '',
          excerpt: res.data.excerpt ?? '',
          content: res.data.content ?? '',
        });
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading post:', err);
        const msg =
          err?.response?.data?.detail ||
          err?.response?.data ||
          'Failed to load post.';
        setError(typeof msg === 'string' ? msg : 'Failed to load post.');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'title' || name === 'slug' || name === 'excerpt') {
      setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content,
      author: 1,
    };

    if (!payload.title || !payload.slug || !payload.excerpt || !payload.content) {
      setError('All fields are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    // Use same endpoint as the GET that populated the form
    const endpoint = `post/admin/edit/postdetail/${id}/`;
    console.log('PUT ->', axiosInstance.defaults?.baseURL ? axiosInstance.defaults.baseURL + endpoint : endpoint, payload);

    try {
      const res = await axiosInstance.put(endpoint, payload);
      console.log('update response', res?.data);
      setSuccess('Post updated successfully.');
      setTimeout(() => navigate('/admin/'), 600);
    } catch (err) {
      console.error('Error updating post:', err);
      console.error('request url:', err?.config?.url, 'status:', err?.response?.status, 'data:', err?.response?.data);
      const msg =
        err?.response?.data?.detail ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        'Failed to update post. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Failed to update post.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StyledContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress sx={{ color: '#f59e0b' }} />
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer component="main" maxWidth="md">
      <CssBaseline />
      <StyledPaper>
        <HeaderBox>
          <EditIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
            Edit Post
          </Typography>
        </HeaderBox>

        {error && (
          <Alert
            severity="error"
            sx={{
              marginBottom: 2,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#fca5a5',
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              marginBottom: 2,
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#86efac',
            }}
          >
            {success}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item='true' xs={12}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 1 }}>
                Post Title *
              </Typography>
              <StyledTextField
                variant="outlined"
                required
                fullWidth
                id="title"
                name="title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 1 }}>
                Slug *
              </Typography>
              <StyledTextField
                variant="outlined"
                required
                fullWidth
                id="slug"
                name="slug"
                placeholder="post-slug"
                value={formData.slug}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 1 }}>
                Excerpt *
              </Typography>
              <StyledTextField
                variant="outlined"
                required
                fullWidth
                id="excerpt"
                name="excerpt"
                placeholder="Brief description"
                value={formData.excerpt}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 1 }}>
                Content *
              </Typography>
              <StyledTextField
                variant="outlined"
                required
                fullWidth
                id="content"
                name="content"
                placeholder="Write your content here..."
                value={formData.content}
                onChange={handleChange}
                multiline
                rows={10}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1, marginTop: 3 }}>
            <SubmitButton
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </SubmitButton>

            <CancelButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/')}
              disabled={submitting}
            >
              Cancel
            </CancelButton>
          </Box>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
}
// ...existing code...
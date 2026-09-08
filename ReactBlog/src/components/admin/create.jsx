import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  CssBaseline,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CreateIcon from '@mui/icons-material/Create';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FormCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 20,
  boxShadow: '0 14px 32px rgba(15, 23, 42, 0.08)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  padding: theme.spacing(4),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    '&:hover fieldset': {
      borderColor: '#93c5fd',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: 2,
    },
  },
  '& .MuiInputBase-input': {
    color: '#0f172a',
    fontSize: '0.98rem',
  },
}));

const ImageUploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #cbd5e1',
  borderRadius: 18,
  background: 'linear-gradient(135deg, rgba(59,130,246,0.04), rgba(59,130,246,0.08))',
  minHeight: 220,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#60a5fa',
    background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.12))',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2, #1565c0)',
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 700,
  padding: '10px 22px',
  boxShadow: '0 8px 20px rgba(25,118,210,0.25)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 22px',
  borderColor: '#cbd5e1',
  color: '#334155',
  '&:hover': {
    borderColor: '#94a3b8',
    backgroundColor: 'rgba(148,163,184,0.06)',
  },
}));

export default function Create() {
  const navigate = useNavigate();

  function slugify(string) {
    const a =
      'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b =
      'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(p, (c) => b.charAt(a.indexOf(c)))
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  const initialFormData = Object.freeze({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
  });

  const [postData, updateFormData] = useState(initialFormData);
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await axiosInstance.get('category/');
        if (!mounted) return;
        setCategories(res.data);
      } catch (err) {
        console.error('Failed loading categories', err);
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      if (files && files[0]) {
        const file = files[0];

        if (file.size > 10 * 1024 * 1024) {
          setError('Image must be <= 10MB');
          return;
        }

        setPostImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }

      setError('');
      return;
    }

    if (name === 'title') {
      updateFormData((prev) => ({
        ...prev,
        title: value,
        slug: slugify(value),
      }));
    } else {
      updateFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = (postData.title || '').trim();
    const slug = (postData.slug || '').trim() || slugify(title);
    const excerpt = (postData.excerpt || '').trim();
    const content = (postData.content || '').trim();
    const category = (postData.category || '').toString().trim();

    if (!title || !slug || !excerpt || !content || !category) {
      setError('All fields are required (including category)');
      return;
    }

    if (postImage && postImage.size > 10 * 1024 * 1024) {
      setError('Image must be <= 10MB');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('excerpt', excerpt);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('author', localStorage.getItem('user_id') || '1');

      if (postImage) {
        formData.append('image', postImage);
      }

      await axiosInstance.post('post/admin/create/', formData);

      setSuccess('Post created successfully!');

      setTimeout(() => {
        setSubmitting(false);
        navigate('/admin/');
      }, 700);
    } catch (err) {
      console.error('Error creating post:', err);

      setError(
        err.response?.data?.detail ||
          (err.response?.data && JSON.stringify(err.response.data)) ||
          'Failed to create post. Please try again.'
      );

      setSubmitting(false);

      if (err.response?.status === 401) {
        navigate('/login/');
      }
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <CssBaseline />
      <FormCard>
        <HeaderBox>
          <CreateIcon sx={{ fontSize: 30, color: '#1976d2' }} />
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
            Create New Post
          </Typography>
        </HeaderBox>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>
                Post Title *
              </Typography>
              <StyledTextField
                fullWidth
                id="title"
                name="title"
                placeholder="Enter post title"
                value={postData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>
                Slug *
              </Typography>
              <StyledTextField
                fullWidth
                id="slug"
                name="slug"
                placeholder="auto-generated-slug"
                value={postData.slug}
                onChange={handleChange}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>
                Excerpt *
              </Typography>
              <StyledTextField
                fullWidth
                id="excerpt"
                name="excerpt"
                placeholder="Brief description"
                value={postData.excerpt}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>
                Content *
              </Typography>
              <StyledTextField
                fullWidth
                id="content"
                name="content"
                placeholder="Write your content here..."
                value={postData.content}
                onChange={handleChange}
                multiline
                rows={10}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>
                Category *
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="category-label">Select category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={postData.category}
                  label="Select category"
                  onChange={handleChange}
                >
                  {loadingCategories ? (
                    <MenuItem value="">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={18} />
                        <Typography variant="body2">Loading...</Typography>
                      </Box>
                    </MenuItem>
                  ) : (
                    categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name || cat.title || cat.slug || `Category ${cat.id}`}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>
                Featured Image (Optional)
              </Typography>

              <input
                accept="image/*"
                id="post-image"
                name="image"
                type="file"
                onChange={handleChange}
                style={{ display: 'none' }}
              />

              <label htmlFor="post-image" style={{ display: 'block', cursor: 'pointer' }}>
                <ImageUploadBox component="div">
                  {imagePreview ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxHeight: '200px',
                          maxWidth: '100%',
                          borderRadius: '8px',
                          marginBottom: '12px',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                        Click to change image
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <PhotoCameraIcon sx={{ fontSize: 46, color: '#1976d2', mb: 1 }} />
                      <Typography variant="body1" sx={{ color: '#111827', mb: 0.5, fontWeight: 500 }}>
                        Click to upload image
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        PNG, JPG, GIF up to 10MB
                      </Typography>
                    </Box>
                  )}
                </ImageUploadBox>
              </label>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1, mt: 3, flexWrap: 'wrap' }}>
            <SubmitButton
              type="submit"
              variant="contained"
              startIcon={<CreateIcon />}
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Post'}
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
      </FormCard>
    </Container>
  );
}
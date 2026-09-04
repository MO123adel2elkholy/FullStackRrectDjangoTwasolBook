// ...existing code...
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';
import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  CssBaseline,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CreateIcon from '@mui/icons-material/Create';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FormCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: '0 4px 18px rgba(15, 23, 42, 0.06)',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: '1px solid #e5e7eb',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: 10,
    '& fieldset': {
      borderColor: '#d1d5db',
    },
    '&:hover fieldset': {
      borderColor: '#94a3b8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
  '& .MuiInputBase-input': {
    color: '#111827',
  },
  '& .MuiInputLabel-root': {
    color: '#374151',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: '#ffffff',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: 10,
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    backgroundColor: '#1565c0',
  },
  '&:disabled': {
    backgroundColor: '#9ca3af',
    color: '#e5e7eb',
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: '#374151',
  borderColor: '#cbd5e1',
  textTransform: 'none',
  borderRadius: 10,
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    backgroundColor: '#f3f4f6',
    borderColor: '#94a3b8',
  },
}));

const ImageUploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #d1d5db',
  borderRadius: 12,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  minHeight: 190,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#94a3b8',
    backgroundColor: '#f1f5f9',
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
  });

  const [postData, updateFormData] = useState(initialFormData);
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      if (files && files[0]) {
        const file = files[0];
        // optional size check (10MB)
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

    // Avoid trimming on every keystroke (prevents caret jumps).
    if (name === 'title') {
      updateFormData((prev) => ({
        ...prev,
        title: value,
        slug: slugify(value), // auto-generate slug from raw title
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

    // Trim and validate before sending
    const title = (postData.title || '').trim();
    const slug = (postData.slug || '').trim() || slugify(title);
    const excerpt = (postData.excerpt || '').trim();
    const content = (postData.content || '').trim();

    if (!title || !slug || !excerpt || !content) {
      setError('All fields are required');
      return;
    }

    // optional image size check again
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
      formData.append('author', 1); // keep if backend expects it; otherwise remove
      formData.append('excerpt', excerpt);
      formData.append('content', content);

      if (postImage) {
        formData.append('image', postImage);
      }

      // Do NOT set Content-Type manually so browser can add the boundary header
      const res = await axiosInstance.post('post/admin/create/', formData);
      setSuccess('Post created successfully!');
      // small delay to show success then redirect
      setTimeout(() => {
        setSubmitting(false);
        navigate('/admin/');
      }, 800);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.detail || (err.response?.data && JSON.stringify(err.response.data)) || 'Failed to create post. Please try again.');
      setSubmitting(false);
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
            <Grid  item="true" xs={12}>
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
// ...existing code...
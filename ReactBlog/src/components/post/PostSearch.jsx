// ...existing code...
import axiosInstance from '../../axios';
import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Chip,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const PostsContainer = styled('div')(({ theme }) => ({
  background: '#f6fafc',
  minHeight: '100vh',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(8),
  display: 'flex',
  justifyContent: 'center',
}));

const Inner = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

const GridCard = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  background: '#ffffff',
  boxShadow: '0 6px 20px rgba(16,24,40,0.06)',
  transition: 'transform .22s ease, box-shadow .22s ease',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 16px 40px rgba(16,24,40,0.12)',
  },
}));

const MediaWrap = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 220,
  overflow: 'hidden',
  background: '#e6eef7',
}));

const MediaImg = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  transition: 'transform .35s ease',
  transformOrigin: 'center center',
}));

const MediaOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(180deg, rgba(15,23,42,0.06) 0%, rgba(255,255,255,0) 40%, rgba(15,23,42,0.22) 100%)',
}));

const CardBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  flexGrow: 1,
}));

const MetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const TitleLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': { textDecoration: 'underline' },
}));

function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false);

  const title = post.title || 'Untitled Post';
  const category = (post.category && (post.category.name || post.category)) || 'General';
  const fullText = post.excerpt || post.content || post.description || '';
  const image =
    (post.image && post.image.startsWith && post.image.startsWith('http')) ||
    (post.image && post.image !== '')
      ? post.image
      : post.cover_image || post.thumbnail || 'https://via.placeholder.com/900x600?text=Blog+Image';
  const createdAtValue = post.created_at || post.published || post.date || null;
  const createdAt = (() => {
    if (!createdAtValue) return 'Just now';
    const date = new Date(createdAtValue);
    if (Number.isNaN(date.getTime())) return 'Just now';
    return date.toLocaleDateString();
  })();
  const authorName = post.author?.username || post.author_name || post.author || 'Admin';
  const authorAvatar =
    post.author?.avatar || post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}`;
  const postId = post.id || title;

  const limit = 140;
  const needsToggle = (fullText || '').length > limit;
  const displayText = expanded ? fullText : (fullText || '').slice(0, limit) + (needsToggle && !expanded ? '…' : '');

  return (
    <GridCard>
      <MediaWrap>
        <MediaImg src={image} alt={title} />
        <MediaOverlay />
        <Box sx={{ position: 'absolute', left: 12, bottom: 12, zIndex: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={authorAvatar} sx={{ width: 36, height: 36, border: '2px solid rgba(255,255,255,0.85)' }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>
                {authorName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#e6eef7', display: 'block' }}>
                {createdAt}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </MediaWrap>

      <CardBody>
        <MetaRow>
          <Chip
            label={category}
            size="small"
            sx={{
              bgcolor: '#e6f0ff',
              color: '#0369a1',
              fontWeight: 700,
              borderRadius: 8,
              px: 1.2,
            }}
          />
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            {createdAt}
          </Typography>
        </MetaRow>

        <TitleLink to={`/post/${postId}`}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            {title}
          </Typography>
        </TitleLink>

        <Typography variant="body2" sx={{ color: '#475569', mt: 0.5, minHeight: 48 }}>
          {displayText}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Button component={RouterLink} to={`/post/${postId}`} size="small" variant="contained" sx={{ textTransform: 'none', borderRadius: 8, background: 'linear-gradient(90deg,#60a5fa,#3b82f6)' }}>
            Read more
          </Button>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {needsToggle && (
              <Button
                size="small"
                variant="text"
                onClick={() => setExpanded((s) => !s)}
                sx={{ textTransform: 'none', color: '#2563eb' }}
              >
                {expanded ? 'Show less' : 'Show more'}
              </Button>
            )}
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              {post.read_time ? `${post.read_time} min` : ''}
            </Typography>
          </Box>
        </Box>
      </CardBody>
    </GridCard>
  );
}

export default function PostSearch() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('search') || '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setPosts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    axiosInstance
      .get(`post/?search=${encodeURIComponent(query)}`)
      .then((res) => {
        if (cancelled) return;
        setPosts(Array.isArray(res.data) ? res.data : res.data.results || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.detail || 'Failed to load posts.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <PostsContainer>
      <Inner maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {query ? `Search results for “${query}”` : 'Search posts'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            {query ? `Showing results matching "${query}"` : 'Enter a search term to find posts.'}
          </Typography>
        </Box>

        {loading && (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <GridCard>
                  <MediaWrap>
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  </MediaWrap>
                  <CardBody>
                    <Skeleton width="80%" height={28} />
                    <Skeleton width="100%" height={16} />
                    <Skeleton width="60%" height={16} />
                  </CardBody>
                </GridCard>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && error && (
          <Box sx={{ py: 6 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {!loading && !error && posts.length === 0 && query && (
          <Box sx={{ py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No posts found matching “{query}”.
            </Typography>
          </Box>
        )}

        {!loading && !error && posts.length > 0 && (
          <Grid container spacing={3}>
            {posts.map((post) => {
              const key = post.slug || post.id || post.title || Math.random();
              return (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <PostCard post={post} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Inner>
    </PostsContainer>
  );
}
// ...existing code...
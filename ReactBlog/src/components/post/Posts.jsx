import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';


const BrandLink = styled(RouterLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  marginRight: theme.spacing(3),
}));



const formatTimeAgo = (dateValue) => {
  if (!dateValue) return 'Just now'

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Just now'

  const diffMs = Date.now() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  if (diffDays < 30) return `${diffDays} day ago`
  if (diffMonths < 12) return `${diffMonths} month ago`
  return `${diffYears} year ago`
}

const PostsContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(5)
}))

const StyledCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 320,
  minWidth: 260,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: '#ffffff',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: 18,
  overflow: 'hidden',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
  transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 18px 40px rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.25)'
  }
}))

const PostImageWrap = styled(Box)({
  position: 'relative',
  height: 240,
  overflow: 'hidden'
})

const PostImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
})

const ImageOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.7) 100%)'
})

const PostBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  gap: theme.spacing(1.5),
  padding: theme.spacing(2.2)
}))

const PostMeta = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8
})

const AuthorRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  zIndex: 1
})

const AuthorAvatar = styled(Avatar)({
  width: 34,
  height: 34,
  border: '2px solid rgba(255,255,255,0.4)',
  background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)'
})

const PostTitle = styled(Typography)({
  fontWeight: 700,
  lineHeight: 1.35,
  color: '#0f172a'
})

const PostDescription = styled(Typography)(({ theme }) => ({
  color: '#475569',
  lineHeight: 1.75,
  fontSize: '0.94rem',
  flexGrow: 1
}))

const ReadMoreButton = styled(Button)({
  alignSelf: 'flex-start',
  textTransform: 'none',
  borderRadius: 999,
  padding: '8px 16px',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
  color: '#fff',
  boxShadow: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #0ea5e9, #1d4ed8)',
    boxShadow: '0 10px 24px rgba(37, 99, 235, 0.35)'
  }
})

const Posts = ({ posts }) => {
  const [expandedPosts, setExpandedPosts] = useState({})

  const toggleExpanded = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  if (!posts || posts.length === 0) {
    return (
      <PostsContainer>
        <Typography variant="h6" color="text.secondary">
          No posts found.
        </Typography>
      </PostsContainer>
    )
  }

  return (
    <PostsContainer>
      <Grid container spacing={3}>
        {posts.map((post) => {
          const title = post.title || 'Untitled Post'
          const category = post.category || 'General'
          const description =
            post.content ||
            post.description ||
            post.body ||
            'No description available.'

          const image =
            post.image ||
            post.cover_image ||
            post.thumbnail ||
            'https://via.placeholder.com/900x600?text=Blog+Image'

          const createdAtValue =
            post.created_at || post.published || post.date || new Date().toISOString()

          const createdAt = formatTimeAgo(createdAtValue)

          const authorName =
            post.author_name ||
            post.author ||
            post.user?.username ||
            'Admin User'

          const authorAvatar =
            post.author_avatar ||
            post.user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}`

          const postId = post.id || title
          const isExpanded = !!expandedPosts[postId]
          const shouldShowReadMore = description.length > 200
          const displayText =
            shouldShowReadMore && !isExpanded
              ? `${description.slice(0, 100)}...`
              : description

          return (
            <Grid
              item='true'
              xs={12}
              sm={6}
              md={4}
              key={postId}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <StyledCard>
                <PostImageWrap>
                  <PostImage src={image} alt={title} />
                  <ImageOverlay />

                  <Box
                    sx={{
                      position: 'absolute',
                      left: 16,
                      right: 16,
                      bottom: 16,
                      zIndex: 1
                    }}
                  >
                    <AuthorRow>
                      <AuthorAvatar src={authorAvatar} alt={authorName} />
                      <Stack spacing={0}>
                        <Typography
                          variant="caption"
                          sx={{ color: '#e2e8f0', fontWeight: 600 }}
                        >
                          {authorName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                          {createdAt}
                        </Typography>
                      </Stack>
                    </AuthorRow>
                  </Box>
                </PostImageWrap>

                <PostBody>
                  <PostMeta>
                    <Chip
                      label={category}
                      size="small"
                      sx={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        fontWeight: 600,
                        borderRadius: 999,
                        border: '1px solid rgba(56, 189, 248, 0.25)'
                      }}
                    />

                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {createdAt}
                    </Typography>
                  </PostMeta>
                    <BrandLink to={`/post/${post.id}`}>
                  <PostTitle variant="h6" component="h3">
                    {title} 
                  </PostTitle>
                  </BrandLink>

                  <PostDescription variant="body2">
                    {displayText}
                  </PostDescription>

                  {shouldShowReadMore && !isExpanded && (
                    <ReadMoreButton
                      variant="contained"
                      size="small"
                      onClick={() => toggleExpanded(postId)}
                    >
                      Read more
                    </ReadMoreButton>
                  )}

                  {shouldShowReadMore && isExpanded && (
                    <ReadMoreButton
                      variant="outlined"
                      size="small"
                      onClick={() => toggleExpanded(postId)}
                    >
                      Show less
                    </ReadMoreButton>
                  )}
                </PostBody>
              </StyledCard>
            </Grid>
          )
        })}
      </Grid>
    </PostsContainer>
  )
}

export default Posts
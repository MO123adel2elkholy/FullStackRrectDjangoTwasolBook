import { Box, CircularProgress, Stack, Typography } from '@mui/material'

const PostDataLoading = ({ loading }) => {
  if (!loading) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <CircularProgress size={24} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Loading posts...
        </Typography>
      </Stack>
    </Box>
  )
}

export default PostDataLoading
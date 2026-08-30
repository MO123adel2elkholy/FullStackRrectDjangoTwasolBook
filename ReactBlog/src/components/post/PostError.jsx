import { Box, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

const getFriendlyMessage = (error) => {
  if (typeof error === 'string') return error

  const status = error?.response?.status || error?.status || 500

  switch (status) {
    case 400:
      return 'Please check the information and try again.'
    case 401:
      return 'Your session has expired. Please log in again.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The post you are looking for could not be found.'
    case 409:
      return 'This action conflicts with the current data. Please try again.'
    case 429:
      return 'Too many requests. Please wait a moment and try again.'
    case 500:
    default:
      return 'Something went wrong on our side. Please try again later.'
  }
}

const PostError = ({ error }) => {
  if (!error) return null

  const message = getFriendlyMessage(error)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 640,
          p: 2.5,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'error.light',
          backgroundColor: (theme) =>
            alpha(theme.palette.error.main, theme.palette.action.hoverOpacity),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: 'error.main',
              color: 'common.white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            !
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: 'error.dark',
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            {message}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}

export default PostError
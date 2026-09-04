import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const SafeGrid = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'item'
})(({ theme }) => ({
  // styles
}));

const PostDataLoading = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress size={24} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Loading posts...
        </Typography>
      </Stack>
    </Box>
  );
};

export default PostDataLoading;
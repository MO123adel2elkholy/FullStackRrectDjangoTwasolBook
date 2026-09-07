import React, { useState } from 'react';
import axiosInstance from '../../axios/login';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FacebookLogin from '@greatsumini/react-facebook-login';
import FacebookSocialLogin from '../../axios/facebookLogin';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || '';
  const clientId = import.meta.env.VITE_CLIENT_ID || '';
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET || '';
  const grantType = import.meta.env.VITE_GRANT_TYPE || 'password';

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post('auth/token/', {
        username: formData.email,
        password: formData.password,
        grant_type: grantType,
        client_id: clientId,
        client_secret: clientSecret,
      });

      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your credentials.');
    }
  };

  const responseFacebook = async (response) => {
    if (!response?.accessToken) return;
    FacebookSocialLogin(response.accessToken);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          {/* <FacebookLogin
            appId={facebookAppId}
            onSuccess={(response) => {
              console.log('Login Success!', response);
              responseFacebook(response);
            }}
            onFail={(error) => {
              console.log('Login Failed!', error);
            }}
            render={({ onClick }) => (
              <Button
                fullWidth
                variant="outlined"
                onClick={onClick}
                sx={{
                  mb: 2,
                  borderColor: '#1877F2',
                  color: '#1877F2',
                  '&:hover': {
                    borderColor: '#1877F2',
                    backgroundColor: '#e8f0fe',
                  },
                }}
              >
                Login with Facebook
              </Button>
            )}
          /> */}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}




























































// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../axios/login';
// import { useNavigate } from 'react-router-dom';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// export default function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Load Facebook SDK
//     window.fbAsyncInit = function () {
//       window.FB.init({
//         appId: 'YOUR_FACEBOOK_APP_ID',
//         cookie: true,
//         xfbml: true,
//         version: 'v18.0',
//       });
//     };

//     // Insert SDK script if not already loaded
//     if (!document.getElementById('facebook-jssdk')) {
//       const script = document.createElement('script');
//       script.id = 'facebook-jssdk';
//       script.src = 'https://connect.facebook.net/en_US/sdk.js';
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);
//     }
//   }, []);

//   const handleFacebookLogin = () => {
//     window.FB.login(
//       (response) => {
//         if (response.authResponse) {
//           window.FB.api('/me', { fields: 'name,email,picture' }, (userInfo) => {
//             console.log('Facebook Login Success:', userInfo);
//             // handle your backend login here if needed
//           });
//         } else {
//           console.log('Facebook Login Failed or cancelled');
//         }
//       },
//       { scope: 'public_profile,email' }
//     );
//   };

//   const handleChange = (e) => {
//     setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axiosInstance.post('auth/token/', {
//         username: formData.email,
//         password: formData.password,
//         grant_type: 'password',
//         client_id: '8UoT6yLQ1fIEcxeKrkG6udvZw0zL6ygqJDeOEl5u',
//         client_secret:
//           'y2gLGqDt8H1eznpkwqP1ISLPU97YBdKZKKNQMs3PgDjnSAzQtVGm9qs0wN3de5zLgdcz5sIwntPFyvf1v3IZIdwnbTbYGuhwHtomkQ3sjd8ssZTWRsEuVR1ahJdYwuOt',
//       });
//       localStorage.setItem('access_token', res.data.access_token);
//       localStorage.setItem('refresh_token', res.data.refresh_token);
//       navigate('/');
//       window.location.reload();
//     } catch (err) {
//       console.error(err);
//       setError('Login failed. Please check your credentials.');
//     }
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <CssBaseline />
//       <Box
//         sx={{
//           marginTop: 8,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//         }}
//       >
//         <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//           <LockOutlinedIcon />
//         </Avatar>
//         <Typography component="h1" variant="h5">
//           Sign in
//         </Typography>

//         {error && (
//           <Typography color="error" variant="body2" sx={{ mt: 1 }}>
//             {error}
//           </Typography>
//         )}

//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={formData.email}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//             value={formData.password}
//             onChange={handleChange}
//           />
//           <FormControlLabel
//             control={<Checkbox value="remember" color="primary" />}
//             label="Remember me"
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Sign In
//           </Button>

//           <Button
//             fullWidth
//             variant="outlined"
//             onClick={handleFacebookLogin}
//             sx={{
//               mb: 2,
//               borderColor: '#1877F2',
//               color: '#1877F2',
//               '&:hover': {
//                 borderColor: '#1877F2',
//                 backgroundColor: '#e8f0fe',
//               },
//             }}
//           >
//             Login with Facebook
//           </Button>

//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <Link href="#" variant="body2">
//                 Forgot password?
//               </Link>
//             </Grid>
//             <Grid item xs={12}>
//               <Link href="/register" variant="body2">
//                 {"Don't have an account? Sign Up"}
//               </Link>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </Container>
//   );
// }
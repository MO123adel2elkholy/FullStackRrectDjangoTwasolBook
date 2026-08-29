import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 'none',
}));

const BrandLink = styled(RouterLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  marginRight: theme.spacing(3),
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: 12,
  padding: '8px 12px',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
}));

const WriteButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#f59e0b',
  color: '#111827',
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: 12,
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: '#fbbf24',
  },
}));

const SearchIconButton = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 12,
}));

export default function Header() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = React.useState(false);

  React.useEffect(() => {
    const token =
      localStorage.getItem('access_token') ||
      localStorage.getItem('access') ||
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token');
    setIsAuth(Boolean(token));

    const onStorage = () => {
      const t =
        localStorage.getItem('access_token') ||
        localStorage.getItem('access') ||
        localStorage.getItem('token') ||
        localStorage.getItem('auth_token');
      setIsAuth(Boolean(t));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    // remove common token keys used in JWT setups
    ['access_token', 'refresh_token', 'access', 'refresh', 'token', 'auth_token'].forEach(
      (k) => localStorage.removeItem(k)
    );
    setIsAuth(false);
    navigate('/'); // or navigate('/login') if preferred
  };

  return (
    <HeaderAppBar position="static" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={{ minHeight: 72, px: { xs: 0, sm: 0 } }}>
          <BrandLink to="/">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="logo"
              sx={{
                mr: 1,
                p: 0.8,
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <MenuBookIcon />
            </IconButton>

            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, letterSpacing: 0.5 }}
            >
              TwasolBook
            </Typography>
          </BrandLink>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (
              <NavButton key={item.label} component={RouterLink} to={item.to}>
                {item.label}
              </NavButton>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIconButton aria-label="search">
              <SearchIcon />
            </SearchIconButton>

            {/* Auth buttons */}
            {!isAuth ? (
              <>
                <NavButton component={RouterLink} to="/login">
                  Login
                </NavButton>
                <NavButton component={RouterLink} to="/register">
                  Register
                </NavButton>
              </>
            ) : (
              <NavButton onClick={handleLogout}>Logout</NavButton>
            )}

            <WriteButton component={RouterLink} to="/create">
              create post
            </WriteButton>
          </Box>
        </Toolbar>
      </Container>
    </HeaderAppBar>
  );
}
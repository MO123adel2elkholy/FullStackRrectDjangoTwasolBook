import * as React from 'react';
import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#0f172a',
  color: '#e2e8f0',
  marginTop: theme.spacing(8),
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(3),
}));

const FooterSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'rgba(255,255,255,0.8)',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  backgroundColor: 'rgba(255,255,255,0.08)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
}));

export default function Footer() {
  return (
    <FooterWrapper component="footer">
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box sx={{ flex: '1 1 260px', maxWidth: 360 }}>
            <FooterSectionTitle variant="h6">TwasolBook</FooterSectionTitle>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}
            >
              A modern blog platform for sharing ideas, tutorials, and stories
              with the world.
            </Typography>
          </Box>

          <Box sx={{ flex: '1 1 180px' }}>
            <FooterSectionTitle variant="h6">Quick Links</FooterSectionTitle>
            <Stack spacing={1}>
              <FooterLink href="/" underline="hover">Home</FooterLink>
              <FooterLink href="/blog" underline="hover">Blog</FooterLink>
              <FooterLink href="/about" underline="hover">About</FooterLink>
              <FooterLink href="/contact" underline="hover">Contact</FooterLink>
            </Stack>
          </Box>

          <Box sx={{ flex: '1 1 200px' }}>
            <FooterSectionTitle variant="h6">Follow Us</FooterSectionTitle>

            <Stack direction="row" spacing={1}>
              <SocialButton size="small" aria-label="facebook">
                <FacebookIcon fontSize="small" />
              </SocialButton>
              <SocialButton size="small" aria-label="instagram">
                <InstagramIcon fontSize="small" />
              </SocialButton>
              <SocialButton size="small" aria-label="twitter">
                <TwitterIcon fontSize="small" />
              </SocialButton>
              <SocialButton size="small" aria-label="github">
                <GitHubIcon fontSize="small" />
              </SocialButton>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <FooterLink
                href="mailto:hello@myblog.com"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <EmailIcon fontSize="small" />
                adel333mahmoud@gmail.com
              </FooterLink>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 5,
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            © {new Date().getFullYear()} TwasolBook. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
}
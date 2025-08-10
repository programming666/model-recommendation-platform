import React from 'react'
import { Box, Typography, Link, Container } from '@mui/material'
import { useLanguage } from '../contexts/LanguageContext'
import { GitHub, Mail } from '@mui/icons-material'

const Footer = () => {
  const { t, language } = useLanguage()

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.05)',
        borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          {/* Copyright */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="body2">
              {t('footer.copyright')} © {new Date().getFullYear()} AI Models Platform. {t('footer.allRightsReserved')}
            </Typography>
          </Box>

          {/* Contact and Links */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3, textAlign: { xs: 'center', md: 'right' } }}>
            {/* Contact */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Mail sx={{ fontSize: 18 }} />
              <Link 
                href={`mailto:${t('footer.supportEmail')}`} 
                color="inherit"
                underline="hover"
                sx={{ fontSize: '0.9rem' }}
              >
                {t('footer.supportEmail')}
              </Link>
            </Box>

            {/* Disclaimer */}
            <Typography variant="body2" sx={{ fontSize: '0.8rem', maxWidth: 300 }}>
              <Link 
                href="#" 
                color="inherit"
                underline="hover"
                onClick={(e) => {
                  e.preventDefault()
                  alert(t('footer.disclaimerText'))
                }}
              >
                {t('footer.disclaimer')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
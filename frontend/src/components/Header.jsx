import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Tooltip
} from '@mui/material'
import { Search, Menu, AutoAwesome, Language, LightMode, DarkMode } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSearch } from '../hooks/useSearch'
import { useLanguage } from '../contexts/LanguageContext'
import { useThemeContext } from '../contexts/ThemeContext'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { handleSearch } = useSearch()
  const { t, language, toggleLanguage, isEnglish, isChinese } = useLanguage()
  const { toggleTheme, isDarkMode } = useThemeContext()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }

  const navItems = [
    { label: t('header.home'), path: '/' },
    { label: 'OpenRouter', path: '/openrouter' },
    { label: 'HuggingFace', path: '/huggingface' }
  ]

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: isDarkMode
          ? 'rgba(30, 30, 30, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: isDarkMode
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ minHeight: 70 }}>
        <Grow in timeout={500}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 0,
              mr: 4,
              cursor: 'pointer',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            onClick={() => navigate('/')}
          >
            <AutoAwesome sx={{ fontSize: 28, color: '#1976d2' }} />
            {t('header.title')}
          </Typography>
        </Grow>

        {!isMobile && (
          <Fade in timeout={800}>
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    backgroundColor: location.pathname === item.path
                      ? 'rgba(25, 118, 210, 0.1)'
                      : 'transparent',
                    color: location.pathname === item.path
                      ? '#1976d2'
                      : 'text.primary',
                    '&:hover': {
                      backgroundColor: location.pathname === item.path
                        ? 'rgba(25, 118, 210, 0.15)'
                        : 'rgba(0, 0, 0, 0.04)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Fade>
        )}

        <Fade in timeout={1000}>
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: isMobile ? 1 : 0,
              mx: 2
            }}
          >
            <TextField
              size="small"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      size="small"
                      disabled={!searchQuery.trim()}
                      sx={{
                        color: searchQuery.trim() ? '#1976d2' : 'text.disabled',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        }
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: 3,
                minWidth: isMobile ? 200 : 300,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                    borderWidth: 1,
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(25, 118, 210, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: 2,
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        </Fade>

        {/* Language Toggle Button */}
        <Fade in timeout={1200}>
          <Tooltip title={isEnglish ? '切换到中文' : 'Switch to English'} arrow>
            <IconButton
              onClick={toggleLanguage}
              sx={{
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                color: '#1976d2',
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Language />
            </IconButton>
          </Tooltip>
        </Fade>

        {/* Theme Toggle Button */}
        <Fade in timeout={1300}>
          <Tooltip
            title={
              isDarkMode
                ? (isEnglish ? 'Switch to Light Mode' : '切换到亮色模式')
                : (isEnglish ? 'Switch to Dark Mode' : '切换到暗色模式')
            }
            arrow
          >
            <IconButton
              onClick={toggleTheme}
              sx={{
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                color: '#1976d2',
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
        </Fade>

        {isMobile && (
          <IconButton
            color="inherit"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            <Menu />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
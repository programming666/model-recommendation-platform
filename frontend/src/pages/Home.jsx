import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Fade,
  Grow,
  Container,
  Paper
} from '@mui/material'
import { TrendingUp, Star, Download, Visibility as Eye, AutoAwesome, Explore, Speed } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLanguage } from '../contexts/LanguageContext'

const Home = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/models/stats')
        setStats(response.data.data)
      } catch (err) {
        setError('Failed to load statistics')
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: t('home.stats.openrouterModels'),
      value: stats?.openrouter?.total || 0,
      subtitle: `${stats?.openrouter?.free || 0} ${t('common.free')}, ${stats?.openrouter?.paid || 0} ${t('common.paid')}`,
      color: '#1976d2',
      icon: <TrendingUp />,
      path: '/openrouter',
      description: t('home.features.unified.description')
    },
    {
      title: t('home.stats.huggingfaceModels'),
      value: stats?.huggingface?.total || 0,
      subtitle: `${stats?.huggingface?.trending || 0} ${t('common.trending')}, ${stats?.huggingface?.popular || 0} ${t('common.popular')}`,
      color: '#dc004e',
      icon: <Star />,
      path: '/huggingface',
      description: t('home.features.comparison.description')
    },
    {
      title: t('home.stats.totalModels'),
      value: stats?.total || 0,
      subtitle: t('common.allAvailable'),
      color: '#388e3c',
      icon: <Download />,
      path: '/',
      description: t('home.features.pricing.description')
    }
  ]

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Hero Section */}
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <AutoAwesome sx={{ fontSize: 48, color: '#1976d2', mr: 2 }} />
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800
              }}
            >
              {t('home.title')}
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}
          >
            {t('home.subtitle')}
          </Typography>
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Grow in timeout={1000}>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }
                }}
                onClick={() => navigate(card.path)}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      backgroundColor: card.color,
                      color: 'white',
                      borderRadius: '50%',
                      p: 2,
                      mx: 'auto',
                      mb: 3,
                      width: 80,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {React.cloneElement(card.icon, { sx: { fontSize: 36 } })}
                  </Box>
                  <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 700 }}>
                    {card.value.toLocaleString()}
                  </Typography>
                  <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {card.subtitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grow>

      {/* Quick Actions */}
      <Fade in timeout={1200}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
            {t('home.quickActions')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/openrouter')}
              startIcon={<TrendingUp />}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                }
              }}
            >
              {t('home.exploreOpenRouter')}
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/huggingface')}
              startIcon={<Star />}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #dc004e 0%, #ff5983 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #9a0036 0%, #dc004e 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(220, 0, 78, 0.3)',
                }
              }}
            >
              {t('home.exploreHuggingFace')}
            </Button>
          </Box>
        </Box>
      </Fade>

      {/* Features Section */}
      <Fade in timeout={1400}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
            {t('home.features.title')}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      color: '#1976d2',
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {t('home.features.openrouter.title')}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {t('home.features.openrouter.description')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(220, 0, 78, 0.1)',
                      color: '#dc004e',
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2
                    }}
                  >
                    <Star sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {t('home.features.huggingface.title')}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {t('home.features.huggingface.description')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(56, 142, 60, 0.1)',
                      color: '#388e3c',
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2
                    }}
                  >
                    <Explore sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {t('home.features.searchFilter.title')}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {t('home.features.searchFilter.description')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 152, 0, 0.1)',
                      color: '#ff9800',
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2
                    }}
                  >
                    <Speed sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {t('home.features.performance.title')}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {t('home.features.performance.description')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Box>
  )
}

export default Home

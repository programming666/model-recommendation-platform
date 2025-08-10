import React, { useState, useEffect } from 'react'
import config from '../config/env'
import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Paper,
  Fade,
  Grow,
  InputAdornment
} from '@mui/material'
import { Star, Search, FilterList, Sort } from '@mui/icons-material'
import axios from 'axios'
import ModelCard from '../components/ModelCard'
import { useLanguage } from '../contexts/LanguageContext'
import { useThemeContext } from '../contexts/ThemeContext'

const HuggingFaceModels = () => {
  const { t } = useLanguage()
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('trending')
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(12)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${config.apiBaseUrl}${config.endpoints.models.huggingface}`)
        setModels(response.data.data)
      } catch (err) {
        setError(t('common.error'))
        console.error('Error fetching models:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  const filteredModels = models.filter(model =>
    model.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedModels = [...filteredModels].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || a.id).localeCompare(b.name || b.id)
      case 'trending':
        return (b.trendingScore || 0) - (a.trendingScore || 0)
      case 'likes':
        return (b.likes || 0) - (a.likes || 0)
      case 'downloads':
        return (b.downloads || 0) - (a.downloads || 0)
      case 'date':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      default:
        return 0
    }
  })

  const paginatedModels = sortedModels.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const totalPages = Math.ceil(sortedModels.length / itemsPerPage)

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
      {/* Header Section */}
      <Fade in timeout={600}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          backgroundColor: 'rgba(220, 0, 78, 0.05)',
          borderRadius: 3,
          border: '1px solid rgba(220, 0, 78, 0.1)'
        }}>
          <Box
            sx={{
              backgroundColor: '#dc004e',
              color: 'white',
              borderRadius: 2,
              p: 2,
              mr: 3
            }}
          >
            <Star sx={{ fontSize: 32 }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              {t('huggingface.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('huggingface.subtitle')}
            </Typography>
          </Box>
          <Chip 
            label={t('huggingface.modelsCount', { count: models.length })} 
            color="secondary" 
            sx={{ 
              fontSize: '1.1rem',
              height: 40,
              '& .MuiChip-label': { px: 2 }
            }}
          />
        </Box>
      </Fade>

      {/* Search and Filter Section */}
      <Grow in timeout={800}>
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4, 
            p: 3,
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            color: (theme) => theme.palette.mode === 'dark' ? '#fff' : 'inherit'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <TextField
              label={t('huggingface.searchPlaceholder')}
              variant="outlined"
              size="medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ 
                minWidth: 350,
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="medium" sx={{ minWidth: 180 }}>
              <InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Sort sx={{ fontSize: 18 }} />
                  {t('huggingface.sortBy')}
                </Box>
              </InputLabel>
              <Select
                value={sortBy}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Sort sx={{ fontSize: 18 }} />
                    {t('huggingface.sortBy')}
                  </Box>
                }
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="trending">{t('huggingface.sortOptions.trending')}</MenuItem>
                <MenuItem value="likes">{t('huggingface.sortOptions.likes')}</MenuItem>
                <MenuItem value="downloads">{t('huggingface.sortOptions.downloads')}</MenuItem>
                <MenuItem value="name">{t('huggingface.sortOptions.name')}</MenuItem>
                <MenuItem value="date">{t('huggingface.sortOptions.date')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {searchQuery && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {t('huggingface.showingResults', { filtered: filteredModels.length, total: models.length })}
              </Typography>
            </Box>
          )}
        </Paper>
      </Grow>

      {/* Results Section */}
      {filteredModels.length === 0 ? (
        <Fade in timeout={1000}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '1.1rem' }
            }}
          >
            {t('huggingface.noResults')}
          </Alert>
        </Fade>
      ) : (
        <>
          <Grow in timeout={1000}>
            <Grid container spacing={3}>
              {paginatedModels.map((model, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={model.id}>
                  <ModelCard model={model} type="huggingface" />
                </Grid>
              ))}
            </Grid>
          </Grow>

          {totalPages > 1 && (
            <Fade in timeout={1200}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: 3
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="secondary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Paper>
              </Box>
            </Fade>
          )}
        </>
      )}
    </Box>
  )
}

export default HuggingFaceModels

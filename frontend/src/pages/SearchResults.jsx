import React, { useState, useEffect } from 'react'
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
  Tabs,
  Tab
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ModelCard from '../components/ModelCard'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState({ openrouter: [], huggingface: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(12)

  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm) => {
    try {
      setLoading(true)
      setError(null)

      const [openrouterResponse, huggingfaceResponse] = await Promise.all([
        axios.get(`/api/models/search?q=${encodeURIComponent(searchTerm)}&type=openrouter`),
        axios.get(`/api/models/search?q=${encodeURIComponent(searchTerm)}&type=huggingface`)
      ])

      setResults({
        openrouter: openrouterResponse.data.data || [],
        huggingface: huggingfaceResponse.data.data || []
      })
    } catch (err) {
      setError('Failed to perform search')
      console.error('Error searching:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery })
    }
  }

  const getSortedResults = (models) => {
    return [...models].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || a.id).localeCompare(b.name || b.id)
        case 'relevance':
          return 0 // Keep original order for relevance
        case 'date':
          const dateA = a.created_date || a.createdAt || 0
          const dateB = b.created_date || b.createdAt || 0
          return new Date(dateB) - new Date(dateA)
        default:
          return 0
      }
    })
  }

  const getCurrentResults = () => {
    const allResults = [...results.openrouter, ...results.huggingface]
    const sortedResults = getSortedResults(allResults)
    return sortedResults.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    )
  }

  const getTabResults = (type) => {
    const models = type === 'openrouter' ? results.openrouter : results.huggingface
    const sortedResults = getSortedResults(models)
    return sortedResults.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    )
  }

  const totalResults = results.openrouter.length + results.huggingface.length
  const totalPages = Math.ceil(totalResults / itemsPerPage)

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Search sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Search Results
        </Typography>
        <Chip 
          label={`${totalResults} results`} 
          color="primary" 
          sx={{ ml: 2 }}
        />
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search models"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {totalResults === 0 ? (
        <Alert severity="info">
          No models found matching "{query}"
        </Alert>
      ) : (
        <>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab 
              label={`All (${totalResults})`} 
              icon={<Search />} 
              iconPosition="start"
            />
            <Tab 
              label={`OpenRouter (${results.openrouter.length})`} 
              icon={<Search />} 
              iconPosition="start"
            />
            <Tab 
              label={`HuggingFace (${results.huggingface.length})`} 
              icon={<Search />} 
              iconPosition="start"
            />
          </Tabs>

          <Grid container spacing={3}>
            {activeTab === 0 && getCurrentResults().map((model) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${model.type}-${model.id}`}>
                <ModelCard model={model} type={model.type} />
              </Grid>
            ))}
            {activeTab === 1 && getTabResults('openrouter').map((model) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={model.id}>
                <ModelCard model={model} type="openrouter" />
              </Grid>
            ))}
            {activeTab === 2 && getTabResults('huggingface').map((model) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={model.id}>
                <ModelCard model={model} type="huggingface" />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default SearchResults

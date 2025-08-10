import React, { useState, useEffect } from 'react'
import config from '../config/env'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Divider,
  Paper,
  Fade,
  Grow,
  Container
} from '@mui/material'
import { OpenInNew, ArrowBack, Star, TrendingUp, Download, CalendarToday, Info, Code, Description } from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { useLanguage } from '../contexts/LanguageContext'

const ModelDetail = () => {
  const { t, language } = useLanguage()
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/models/${type}`)
        const models = response.data.data
        const foundModel = models.find(m => m.id === decodeURIComponent(id))
        
        if (foundModel) {
          setModel(foundModel)
          
          // 如果是HuggingFace模型且没有readme_html，则延迟加载
          if (type === 'huggingface' && !foundModel.readme_html) {
            setLoadingDetails(true)
            try {
              const encodedModelId = encodeURIComponent(foundModel.id)
              const detailsResponse = await axios.get(`/api/models/huggingface/${encodedModelId}/details`)
              setModel(prevModel => ({
                ...prevModel,
                readme_html: detailsResponse.data.data.readme_html
              }))
            } catch (detailsError) {
              console.error('Error loading model details:', detailsError)
              // 静默失败，不显示错误给用户
            } finally {
              setLoadingDetails(false)
            }
          }
        } else {
          setError(t('common.error'))
        }
      } catch (err) {
        setError(t('common.error'))
        console.error('Error fetching model:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchModel()
  }, [type, id])

  const formatPrice = (price) => {
    if (!price || Math.abs(price) < Number.EPSILON) return t('common.free')
    
    // 使用更精确的数值判断，考虑JavaScript浮点数精度限制
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || Math.abs(numPrice) < Number.EPSILON) return t('common.free')
    
    // 统一使用正常小数显示，避免科学计数法
    return `$${(numPrice * 1000000).toFixed(2)}/1M`
  }

const formatPricing = (pricing) => {
    // 特殊处理 openrouter/auto 模型
    if (model && model.id === 'openrouter/auto') {
        return t('modelCard.autoSelection')
    }

    if (!pricing) return `${t('openrouter.input')}: ${t('common.free')} | ${t('openrouter.output')}: ${t('common.free')}`
    
    // 更精确的价格判断，使用更严格的精度检查
    const promptPrice = parseFloat(pricing.prompt) || 0
    const completionPrice = parseFloat(pricing.completion) || 0
    
    const hasPromptPrice = Math.abs(promptPrice) >= Number.EPSILON
    const hasCompletionPrice = Math.abs(completionPrice) >= Number.EPSILON
    
    if (!hasPromptPrice && !hasCompletionPrice) {
        return `${t('openrouter.input')}: ${t('common.free')} | ${t('openrouter.output')}: ${t('common.free')}`
    } else if (!hasCompletionPrice) {
        return `${t('openrouter.input')}: ${formatPrice(promptPrice)} | ${t('openrouter.output')}: ${t('common.free')}`
    } else if (!hasPromptPrice) {
        return `${t('openrouter.input')}: ${t('common.free')} | ${t('openrouter.output')}: ${formatPrice(completionPrice)}`
    } else {
        return `${t('openrouter.input')}: ${formatPrice(promptPrice)} | ${t('openrouter.output')}: ${formatPrice(completionPrice)}`
    }
}

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getModelIcon = (iconName) => {
    return `/api/icons/${iconName}`
  }

  const handleExternalLink = (url) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

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

  if (!model) {
    return (
      <Alert severity="warning">
        Model not found
      </Alert>
    )
  }

  return (
    <Container maxWidth="xl">
      {/* Header with Back Button */}
      <Fade in timeout={600}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          backgroundColor: type === 'openrouter' 
            ? 'rgba(25, 118, 210, 0.05)' 
            : 'rgba(220, 0, 78, 0.05)',
          borderRadius: 3,
          border: `1px solid ${type === 'openrouter' 
            ? 'rgba(25, 118, 210, 0.1)' 
            : 'rgba(220, 0, 78, 0.1)'}`
        }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              mr: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              {model.name || model.id}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {model.id}
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* Model Information Card */}
      <Grow in timeout={800}>
        <Card sx={{ 
          mb: 4,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              {/* Avatar Section */}
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={getModelIcon(model.icon)}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      // 如果有图标，使用白色背景；如果没有图标，使用默认颜色
                      backgroundColor: model.icon && model.icon !== 'default.png' 
                        ? '#ffffff' 
                        : (type === 'openrouter' ? '#1976d2' : '#dc004e'),
                      // 为有图标的模型添加边框
                      border: model.icon && model.icon !== 'default.png' ? '3px solid #e0e0e0' : 'none',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    {model.name?.charAt(0)}
                  </Avatar>
                  
                  {/* External Links */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                    {type === 'openrouter' && model.openrouter_link && (
                      <Tooltip title={t('openrouter.openInOpenRouter')} arrow>
                        <IconButton 
                          onClick={() => handleExternalLink(model.openrouter_link)}
                          sx={{
                            color: '#1976d2',
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <OpenInNew />
                        </IconButton>
                      </Tooltip>
                    )}
                    {type === 'huggingface' && model.huggingface_link && (
                      <Tooltip title={t('huggingface.openInHuggingFace')} arrow>
                        <IconButton 
                          onClick={() => handleExternalLink(model.huggingface_link)}
                          sx={{
                            color: '#dc004e',
                            backgroundColor: 'rgba(220, 0, 78, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(220, 0, 78, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <OpenInNew />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* Model Details Section */}
              <Grid item xs={12} md={9}>
                <Box sx={{ mb: 3 }}>
                  {/* Pricing Chip */}
                  {type === 'openrouter' && (
                    <Chip
                      label={model.id === 'openrouter/auto' ? t('modelCard.autoSelection') : formatPricing(model.pricing_converted || model.pricing)}
                      color={model.id === 'openrouter/auto' ? "primary" : (Math.abs(model.pricing_converted?.prompt || 0) < Number.EPSILON && Math.abs(model.pricing_converted?.completion || 0) < Number.EPSILON ? "success" : "default")}
                      size="large"
                      sx={{ 
                        mb: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&.MuiChip-colorSuccess': {
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          color: '#2e7d32',
                          border: '2px solid rgba(76, 175, 80, 0.3)'
                        },
                        '&.MuiChip-colorPrimary': {
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                          color: '#1976d2',
                          border: '2px solid rgba(25, 118, 210, 0.3)'
                        }
                      }}
                    />
                  )}

                  {/* Stats Chips */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                    {type === 'huggingface' && model.downloads && (
                      <Chip
                        icon={<Download />}
                        label={`${model.downloads.toLocaleString()} ${t('huggingface.downloads')}`}
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(220, 0, 78, 0.3)',
                          color: '#dc004e',
                          fontWeight: 500
                        }}
                      />
                    )}
                    {type === 'huggingface' && model.likes && (
                      <Chip
                        icon={<Star />}
                        label={`${model.likes.toLocaleString()} ${t('huggingface.likes')}`}
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(255, 193, 7, 0.3)',
                          color: '#f57c00',
                          fontWeight: 500
                        }}
                      />
                    )}
                    {type === 'huggingface' && model.trendingScore && (
                      <Chip
                        icon={<TrendingUp />}
                        label={`${model.trendingScore.toLocaleString()} ${t('huggingface.trendingScore')}`}
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(76, 175, 80, 0.3)',
                          color: '#388e3c',
                          fontWeight: 500
                        }}
                      />
                    )}
                  </Box>

                  {/* Model Information Grid */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          borderRadius: 2
                        }}
                      >
                        <CalendarToday sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {t('modelDetail.created')}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {type === 'openrouter' 
                            ? formatDate(model.created_date)
                            : formatDate(model.createdAt)
                          }
                        </Typography>
                      </Paper>
                    </Grid>

                    {type === 'openrouter' && model.context_length && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper 
                          elevation={0}
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: 2
                          }}
                        >
                          <Info sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t('modelDetail.contextLength')}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {model.context_length.toLocaleString()} {t('common.tokens')}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    {type === 'huggingface' && model.pipeline_tag && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper 
                          elevation={0}
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: 2
                          }}
                        >
                          <Code sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t('modelDetail.modality')}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {model.pipeline_tag}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    {type === 'huggingface' && model.library_name && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper 
                          elevation={0}
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: 2
                          }}
                        >
                          <Code sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t('modelDetail.architecture')}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {model.library_name}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Tags and Parameters */}
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {type === 'huggingface' && model.tags && model.tags.length > 0 && (
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Info sx={{ fontSize: 20 }} />
                        标签
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {model.tags.slice(0, 10).map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                            sx={{
                              borderColor: 'rgba(0, 0, 0, 0.2)',
                              color: 'text.primary',
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {type === 'openrouter' && model.supported_parameters && model.id !== 'openrouter/auto' && (
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Code sx={{ fontSize: 20 }} />
                        {t('modelDetail.supportedParameters')}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {model.supported_parameters.slice(0, 10).map((param, index) => (
                          <Chip 
                            key={index} 
                            label={param} 
                            size="small" 
                            variant="outlined"
                            sx={{
                              borderColor: 'rgba(25, 118, 210, 0.3)',
                              color: '#1976d2',
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grow>

      {/* Description Card */}
      {model.description && (
        <Fade in timeout={1000}>
          <Card sx={{ 
            mb: 4,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 3,
                fontWeight: 600
              }}>
                <Description sx={{ fontSize: 24, color: 'text.secondary' }} />
                {t('modelDetail.description')}
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
                {type === 'openrouter' && model.description_zh && language === 'zh' 
                  ? model.description_zh 
                  : model.description}
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Documentation Card */}
      {(model.readme_html || loadingDetails) && (
        <Fade in timeout={1200}>
          <Card sx={{ 
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 3,
                fontWeight: 600
              }}>
                <Code sx={{ fontSize: 24, color: 'text.secondary' }} />
                {t('modelDetail.readme')}
              </Typography>
              
              {loadingDetails ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <LinearProgress sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    {t('common.loading')}
                  </Typography>
                </Box>
              ) : (
                <MarkdownRenderer 
                  content={type === 'openrouter' && model.readme_html_zh && language === 'zh' 
                    ? model.readme_html_zh 
                    : model.readme_html} 
                  variant={type}
                  model={model}
                />
              )}
            </CardContent>
          </Card>
        </Fade>
      )}
    </Container>
  )
}

export default ModelDetail

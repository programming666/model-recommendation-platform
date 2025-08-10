import React from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material'
import { OpenInNew, Star, TrendingUp, Download, CalendarToday } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const ModelCard = ({ model, type }) => {
  const navigate = useNavigate()
  const { t, language } = useLanguage()

  const formatPrice = (price) => {
    if (!price || Math.abs(price) < Number.EPSILON) return t('modelCard.free')

    // 使用更精确的数值判断，考虑JavaScript浮点数精度限制
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || Math.abs(numPrice) < Number.EPSILON) return t('modelCard.free')

    // OpenRouter价格是每token价格，转换为更易读的格式
    if (numPrice >= 0.001) {
      // 对于较大数值，显示为每1K tokens，保留4位小数
      return `$${(numPrice * 1000).toFixed(4)}${t('modelCard.per1K')}`
    } else if (numPrice >= 0.00001) {
      // 小数值，显示为每token，保留6位小数
      return `$${numPrice.toFixed(6)}${t('modelCard.perToken')}`
    } else {
      // 极小数值，显示为每1M tokens，避免科学计数法
      return `$${(numPrice * 1000000).toFixed(2)}${t('modelCard.per1M')}`
    }
  }

  const formatPricing = (pricing) => {
    if (!pricing) return `${t('modelCard.input')}: ${t('modelCard.free')} | ${t('modelCard.output')}: ${t('modelCard.free')}`

    // 更精确的价格判断，使用更严格的精度检查
    const promptPrice = parseFloat(pricing.prompt) || 0
    const completionPrice = parseFloat(pricing.completion) || 0

    const hasPromptPrice = Math.abs(promptPrice) >= Number.EPSILON
    const hasCompletionPrice = Math.abs(completionPrice) >= Number.EPSILON

    if (!hasPromptPrice && !hasCompletionPrice) {
        return `${t('modelCard.input')}: ${t('modelCard.free')} | ${t('modelCard.output')}: ${t('modelCard.free')}`
    } else if (!hasCompletionPrice) {
        return `${t('modelCard.input')}: ${formatPrice(promptPrice)} | ${t('modelCard.output')}: ${t('modelCard.free')}`
    } else if (!hasPromptPrice) {
        return `${t('modelCard.input')}: ${t('modelCard.free')} | ${t('modelCard.output')}: ${formatPrice(completionPrice)}`
    } else {
        return `${t('modelCard.input')}: ${formatPrice(promptPrice)} | ${t('modelCard.output')}: ${formatPrice(completionPrice)}`
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getModelTypeDescription = (architecture) => {
    if (!architecture) return '';

    // 处理architecture可能是对象的情况，提取字符串值
    let archStr = '';
    if (typeof architecture === 'object') {
      // 如果是对象，尝试获取modality属性或其他可能的字符串属性
      archStr = architecture.modality || architecture.name || JSON.stringify(architecture);
    } else {
      // 如果已经是字符串，直接使用
      archStr = architecture;
    }

    // 将架构字符串转换为自然语言描述
    const lowerArch = archStr.toLowerCase();
    if (lowerArch.includes('text->text')) {
      return '文本到文本';
    } else if (lowerArch.includes('text+image->text')) {
      return '文本+图片到文本';
    } else if (lowerArch.includes('text->image')) {
      return '文本到图片';
    } else if (lowerArch.includes('image->text')) {
      return '图片到文本';
    } else if (lowerArch.includes('text+image->image')) {
      return '文本+图片到图片';
    } else if (lowerArch.includes('image->image')) {
      return '图片到图片';
    } else if (lowerArch.includes('audio->text')) {
      return '音频到文本';
    } else if (lowerArch.includes('text->audio')) {
      return '文本到音频';
    } else if (lowerArch.includes('multimodal')) {
      return '多模态';
    }

    // 如果没有匹配到已知模式，返回处理后的架构字符串
    return archStr;
  }

  const getModelIcon = (iconName) => {
    return `/api/icons/${iconName}`
  }

  const handleViewDetails = () => {
    navigate(`/model/${type}/${encodeURIComponent(model.id)}`)
  }

  const handleExternalLink = (url) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <Fade in timeout={800}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            '& .model-avatar': {
              transform: 'scale(1.1)',
            },
            '& .view-details-btn': {
              backgroundColor: type === 'openrouter' ? '#1976d2' : '#dc004e',
              color: 'white',
            }
          }
        }}
        onClick={handleViewDetails}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Header with Avatar and Model Info */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <Avatar
              src={getModelIcon(model.icon)}
              className="model-avatar"
              sx={{
                width: 56,
                height: 56,
                mr: 3,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                // 如果有图标，使用白色背景；如果没有图标，使用默认颜色
                backgroundColor: model.icon && model.icon !== 'default.png'
                  ? '#ffffff'
                  : (type === 'openrouter' ? '#1976d2' : '#dc004e'),
                // 为有图标的模型添加边框
                border: model.icon && model.icon !== 'default.png' ? '2px solid #e0e0e0' : 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {model.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                component="div"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {model.name || model.id}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  opacity: 0.8
                }}
              >
                {model.id}
              </Typography>
              {type === 'openrouter' && (
                <Chip
                  label={model.id === 'openrouter/auto' ? t('modelCard.autoSelection') : formatPricing(model.pricing_converted)}
                  size="small"
                  color={model.id === 'openrouter/auto' ? "primary" : (Math.abs(model.pricing_converted?.prompt || 0) < Number.EPSILON && Math.abs(model.pricing_converted?.completion || 0) < Number.EPSILON ? "success" : "default")}
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    '&.MuiChip-colorSuccess': {
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      color: '#2e7d32',
                      border: '1px solid rgba(76, 175, 80, 0.3)'
                    },
                    '&.MuiChip-colorPrimary': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      color: '#1976d2',
                      border: '1px solid rgba(25, 118, 210, 0.3)'
                    }
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
              lineHeight: 1.6,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              minHeight: '4.8em'
            }}
          >
            {(() => {
              const desc = type === 'openrouter' && model.description_zh && language === 'zh' 
                ? model.description_zh 
                : model.description;

              if (desc) {
                return desc.substring(0, 150) + (desc.length > 150 ? '...' : '');
              }
              return '';
            })()}
          </Typography>

          {/* Model Stats */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {type === 'openrouter' && model.architecture && (
              <Chip
                label={getModelTypeDescription(model.architecture)}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(25, 118, 210, 0.3)',
                  color: '#1976d2',
                  fontWeight: 500
                }}
              />
            )}
            {type === 'openrouter' && model.context_length && (
              <Chip
                label={`${model.context_length.toLocaleString()} tokens`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(25, 118, 210, 0.3)',
                  color: '#1976d2',
                  fontWeight: 500
                }}
              />
            )}
            {type === 'huggingface' && model.downloads && (
              <Chip
                icon={<Download sx={{ fontSize: 16 }} />}
                label={`${model.downloads.toLocaleString()}`}
                size="small"
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
                icon={<Star sx={{ fontSize: 16 }} />}
                label={`${model.likes.toLocaleString()}`}
                size="small"
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
                icon={<TrendingUp sx={{ fontSize: 16 }} />}
                label={`${model.trendingScore.toLocaleString()}`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(76, 175, 80, 0.3)',
                  color: '#388e3c',
                  fontWeight: 500
                }}
              />
            )}
          </Box>

          {/* Creation Date */}
          {(type === 'openrouter' && model.created_date) || (type === 'huggingface' && model.createdAt) ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.7 }} />
              <Typography variant="caption" color="text.secondary">
                {t('modelCard.created')}: {formatDate(type === 'openrouter' ? model.created_date : model.createdAt)}
              </Typography>
            </Box>
          ) : null}
        </CardContent>

        {/* Actions */}
        <CardActions sx={{
          justifyContent: 'space-between',
          p: 3,
          pt: 0,
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          <Button
            size="medium"
            onClick={handleViewDetails}
            variant="outlined"
            className="view-details-btn"
            sx={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderColor: type === 'openrouter' ? '#1976d2' : '#dc004e',
              color: type === 'openrouter' ? '#1976d2' : '#dc004e',
              fontWeight: 600,
              '&:hover': {
                borderColor: type === 'openrouter' ? '#1976d2' : '#dc004e',
                backgroundColor: type === 'openrouter' ? '#1976d2' : '#dc004e',
                color: 'white',
                transform: 'translateY(-1px)',
                boxShadow: type === 'openrouter'
                  ? '0 8px 25px rgba(25, 118, 210, 0.3)'
                  : '0 8px 25px rgba(220, 0, 78, 0.3)'
              }
            }}
          >
            {t('modelCard.viewDetails')}
          </Button>
          <Box>
            {type === 'openrouter' && model.openrouter_link && (
              <Tooltip title={t('openrouter.openInOpenRouter')} arrow>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleExternalLink(model.openrouter_link)
                  }}
                  sx={{
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
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
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleExternalLink(model.huggingface_link)
                  }}
                  sx={{
                    color: '#dc004e',
                    '&:hover': {
                      backgroundColor: 'rgba(220, 0, 78, 0.1)',
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
        </CardActions>
      </Card>
    </Fade>
  )
}

export default ModelCard
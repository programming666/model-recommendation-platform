import React from 'react';
import { Paper, Typography } from '@mui/material';

import { useLanguage } from '../contexts/LanguageContext';
import { useThemeContext } from '../contexts/ThemeContext';

const MarkdownRenderer = ({ content, title = "Documentation", variant = "default", model }) => {
  const { t, language } = useLanguage();
  const { isDarkMode } = useThemeContext();
  const getTitle = () => {
    switch (variant) {
      case 'openrouter':
        return "Model Details";
      case 'huggingface':
        return "Documentation";
      default:
        return title;
    }
  };

  const filterContent = (htmlContent) => {
    // 对于 openrouter/auto 模型，过滤掉 pricing 相关内容
    if (model && model.id === 'openrouter/auto' && htmlContent) {
      // 创建一个临时的 DOM 元素来解析 HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;

      // 更全面的 pricing 相关关键词
      const pricingKeywords = [
        'pricing', 'price', 'cost', 'rate', 'fee', 'charge',
        '$', '¥', '€', '£', 'usd', 'dollar',
        'per token', 'input tokens', 'output tokens', 'token',
        'prompt tokens', 'completion tokens', 'input pricing', 'output pricing',
        '/1k', '/1m', 'per 1k', 'per 1m', '1k tokens', '1m tokens',
        '0.', 'free', 'paid', 'subscription', 'billing',
        'input:', 'output:', 'prompt:', 'completion:',
        'model pricing', 'api pricing', 'usage cost'
      ];

      // 查找所有元素并标记要删除的
      const elementsToRemove = new Set();

      // 递归查找包含 pricing 关键词的元素及其父元素
      const findPricingElements = (element) => {
        if (!element || !element.tagName) return;

        const text = (element.textContent || element.innerText || '').toLowerCase();
        const containsPricing = pricingKeywords.some(keyword => text.includes(keyword));

        if (containsPricing) {
          // 标记当前元素
          elementsToRemove.add(element);

          // 如果是表格单元格，标记整行
          if (element.tagName.toLowerCase() === 'td' || element.tagName.toLowerCase() === 'th') {
            let parent = element.parentElement;
            while (parent && parent.tagName.toLowerCase() !== 'tr') {
              parent = parent.parentElement;
            }
            if (parent) elementsToRemove.add(parent);
          }

          // 如果是列表项，可能需要标记整个列表
          if (element.tagName.toLowerCase() === 'li') {
            const listText = element.parentElement?.textContent?.toLowerCase() || '';
            const pricingListKeywords = ['pricing', 'cost', 'rate', 'fee', '$'];
            if (pricingListKeywords.some(keyword => listText.includes(keyword))) {
              elementsToRemove.add(element.parentElement);
            } else {
              elementsToRemove.add(element);
            }
          }

          // 如果包含pricing标题，也标记其后续的兄弟元素
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(element.tagName.toLowerCase())) {
            let nextSibling = element.nextElementSibling;
            while (nextSibling) {
              const siblingText = (nextSibling.textContent || '').toLowerCase();
              // 如果下一个兄弟元素也包含pricing信息，或者是表格/列表，也删除
              if (pricingKeywords.some(keyword => siblingText.includes(keyword)) ||
                  ['table', 'ul', 'ol', 'div'].includes(nextSibling.tagName.toLowerCase()) &&
                  pricingKeywords.some(keyword => siblingText.includes(keyword))) {
                elementsToRemove.add(nextSibling);
                nextSibling = nextSibling.nextElementSibling;
              } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(nextSibling.tagName.toLowerCase())) {
                // 遇到下一个标题就停止
                break;
              } else {
                nextSibling = nextSibling.nextElementSibling;
              }
            }
          }
        }

        // 递归检查子元素
        for (let child of Array.from(element.children)) {
          findPricingElements(child);
        }
      };

      // 开始查找
      findPricingElements(tempDiv);

      // 移除标记的元素
      elementsToRemove.forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });

      return tempDiv.innerHTML;
    }

    return htmlContent;
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {getTitle()}
      </Typography>
      <Paper
        sx={{
          p: 2,
          backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa',
          '&:hover': {
            boxShadow: 1
          }
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: filterContent(variant === 'openrouter' && model.readme_html_zh && language === 'zh' ? model.readme_html_zh : content) }}
          style={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: '1rem',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: isDarkMode ? '#90caf9' : '#1976d2'
            },
            '& p': {
              marginBottom: '1rem',
              lineHeight: '1.6',
              color: isDarkMode ? '#e0e0e0' : '#333'
            },
            '& code': {
              backgroundColor: isDarkMode ? '#333333' : '#e9ecef',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '0.9em',
              color: isDarkMode ? '#f48fb1' : '#d63384'
            },
            '& pre': {
              backgroundColor: isDarkMode ? '#2d2d2d' : '#f8f9fa',
              padding: '1rem',
              borderRadius: '0.25rem',
              overflow: 'auto',
              border: isDarkMode ? '1px solid #444444' : '1px solid #e0e0e0',
              marginBottom: '1rem',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
                color: isDarkMode ? '#e0e0e0' : '#333'
              }
            },
            '& ul, & ol': {
              marginBottom: '1rem',
              paddingLeft: '2rem'
            },
            '& li': {
              marginBottom: '0.25rem',
              lineHeight: '1.5',
              color: isDarkMode ? '#e0e0e0' : 'inherit'
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            },
            '& th, & td': {
              padding: '0.75rem',
              border: isDarkMode ? '1px solid #444444' : '1px solid #e0e0e0',
              textAlign: 'left',
              verticalAlign: 'top',
              color: isDarkMode ? '#e0e0e0' : 'inherit'
            },
            '& th': {
              backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
              fontWeight: 'bold',
              color: isDarkMode ? '#90caf9' : '#495057'
            },
            '& tr:nth-of-type(even)': {
              backgroundColor: isDarkMode ? '#2a2a2a' : '#fafafa'
            },
            '& blockquote': {
              borderLeft: isDarkMode ? '4px solid #555555' : '4px solid #dee2e6',
              paddingLeft: '1rem',
              margin: '1rem 0',
              fontStyle: 'italic',
              color: isDarkMode ? '#bbbbbb' : '#6c757d'
            },
            '& a': {
              color: isDarkMode ? '#90caf9' : '#1976d2',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            // 图片自适应缩放样式
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              margin: '1rem 0',
              borderRadius: '4px',
              boxShadow: isDarkMode ? '0 2px 8px rgba(255, 255, 255, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
            }
          }}
        />
      </Paper>
    </>
  );
};

export default MarkdownRenderer;
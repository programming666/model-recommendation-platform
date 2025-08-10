import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '../locales/en'
import zh from '../locales/zh'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // 从localStorage获取保存的语言设置，默认为英文
    const saved = localStorage.getItem('language')
    return saved || 'zh'
  })

  const [translations, setTranslations] = useState(() => {
    return language === 'zh' ? zh : en
  })

  // 当语言改变时更新翻译
  useEffect(() => {
    setTranslations(language === 'zh' ? zh : en)
    localStorage.setItem('language', language)
  }, [language])

  // 切换语言
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en')
  }

  // 设置特定语言
  const setLanguageTo = (lang) => {
    if (['en', 'zh'].includes(lang)) {
      setLanguage(lang)
    }
  }

  // 获取翻译文本，支持嵌套路径
  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    if (typeof value === 'string') {
      // 替换参数占位符
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match
      })
    }

    return value
  }

  const value = {
    language,
    translations,
    t,
    toggleLanguage,
    setLanguageTo,
    isEnglish: language === 'en',
    isChinese: language === 'zh'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

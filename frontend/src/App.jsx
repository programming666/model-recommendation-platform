import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, Container, CssBaseline } from '@mui/material'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import OpenRouterModels from './pages/OpenRouterModels'
import HuggingFaceModels from './pages/HuggingFaceModels'
import ModelDetail from './pages/ModelDetail'
import SearchResults from './pages/SearchResults'

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', 
          backgroundAttachment: 'fixed'
        }}>
          <Header />
          <Box sx={{ flexGrow: 1 }}>
            <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/openrouter" element={<OpenRouterModels />} />
              <Route path="/huggingface" element={<HuggingFaceModels />} />
              <Route path="/model/:type/:id" element={<ModelDetail />} />
              <Route path="/search" element={<SearchResults />} />
            </Routes>
          </Container>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App

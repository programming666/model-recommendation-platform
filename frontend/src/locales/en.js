export default {
  // Header
  header: {
    title: 'AI Models',
    home: 'Home',
    openrouter: 'OpenRouter',
    huggingface: 'HuggingFace',
    searchPlaceholder: 'Search models...',
  },

  // Home page
  home: {
    title: 'AI Model Recommendation Platform',
    subtitle: 'Discover and compare the best AI models for your needs',
    description: 'Explore hundreds of AI models from leading providers like OpenAI, Anthropic, Google, and more. Compare pricing, performance, and features to find the perfect model for your project.',
    getStarted: 'Get Started',
    exploreModels: 'Explore Models',
    stats: {
      totalModels: 'Total Models',
      openrouterModels: 'OpenRouter Models',
      huggingfaceModels: 'HuggingFace Models',
    },
    features: {
      title: 'Why Choose Our Platform?',
      unified: {
        title: 'Unified Access',
        description: 'Access multiple AI providers through a single interface'
      },
      comparison: {
        title: 'Easy Comparison',
        description: 'Compare models side by side with detailed metrics'
      },
      pricing: {
        title: 'Transparent Pricing',
        description: 'Clear pricing information for all models'
      },
      search: {
        title: 'Smart Search',
        description: 'Find models quickly with advanced search and filtering'
      },
      openrouter: {
        title: 'OpenRouter Integration',
        description: 'Access to hundreds of AI models through OpenRouter\'s unified API. Compare pricing, capabilities, and performance across different providers. Get real-time model availability and pricing information.'
      },
      huggingface: {
        title: 'HuggingFace Models',
        description: 'Explore thousands of open-source models from HuggingFace. Find trending models, read comprehensive documentation, and download directly. Stay updated with the latest model releases and community favorites.'
      },
      searchFilter: {
        title: 'Advanced Search & Filtering',
        description: 'Powerful search capabilities with real-time filtering and sorting options. Find models by name, provider, pricing, or capabilities. Save your favorite models and create custom collections.'
      },
      performance: {
        title: 'Multiple comparisons',
        description: 'Documentation, pricing, and types for each model are clearly displayed at a glance, making selection effortless without the need to search across multiple platforms.'
      }
    },
    quickActions: 'Quick Actions',
    exploreModels: 'Explore Models',
    exploreOpenRouter: 'Explore OpenRouter Models',
    exploreHuggingFace: 'Explore HuggingFace Models'
  },

  // OpenRouter Models page
  openrouter: {
    title: 'OpenRouter Models',
    subtitle: 'Access to hundreds of AI models through OpenRouter\'s unified API',
    searchPlaceholder: 'Search models',
    sortBy: 'Sort by',
    sortOptions: {
      name: 'Name',
      priceAsc: 'Price (Low to High)',
      priceDesc: 'Price (High to Low)',
      context: 'Context Length',
      date: 'Date Created'
    },
    noResults: 'No models found matching your search criteria. Try adjusting your search terms.',
    showingResults: 'Showing {filtered} of {total} models',
    modelsCount: '{count} models',
    free: 'Free',
    input: 'Input',
    output: 'Output',
    tokens: 'tokens',
    viewDetails: 'View Details',
    openInOpenRouter: 'Open in OpenRouter'
  },

  // HuggingFace Models page
  huggingface: {
    title: 'HuggingFace Models',
    subtitle: 'Explore thousands of open-source AI models from the HuggingFace community',
    searchPlaceholder: 'Search models',
    sortBy: 'Sort by',
    sortOptions: {
      name: 'Name',
      downloads: 'Downloads',
      likes: 'Likes',
      trending: 'Trending Score',
      date: 'Date Created'
    },
    noResults: 'No models found matching your search criteria. Try adjusting your search terms.',
    showingResults: 'Showing {filtered} of {total} models',
    modelsCount: '{count} models',
    downloads: 'Downloads',
    likes: 'Likes',
    trendingScore: 'Trending Score',
    created: 'Created',
    viewDetails: 'View Details',
    openInHuggingFace: 'Open in HuggingFace'
  },

  // Model Card
  modelCard: {
    free: 'Free',
    input: 'Input',
    output: 'Output',
    perToken: '/token',
    per1K: '/1K',
    per1M: '/1M',
    created: 'Created',
    viewDetails: 'View Details',
    autoSelection: 'Multi-Model Auto Selection'
  },

  // Search Results
  search: {
    title: 'Search Results',
    query: 'Search Query',
    results: 'Results',
    noResults: 'No models found for "{query}"',
    tryDifferent: 'Try a different search term or browse all models.',
    browseAll: 'Browse All Models'
  },

  // Model Detail
  modelDetail: {
    backToList: 'Back to List',
    overview: 'Overview',
    description: 'Description',
    modelDetails: 'Model Details',
    modelId: 'Model ID',
    provider: 'Provider',
    contextLength: 'Context Length',
    architecture: 'Architecture',
    modality: 'Modality',
    tokenizer: 'Tokenizer',
    pricing: 'Pricing',
    notSpecified: 'Not specified',
    supportedParameters: 'Supported Parameters',
    usage: 'Usage',
    links: 'Links',
    openInProvider: 'Open in {provider}',
    readme: 'README',
    noReadme: 'No README available',
    created: 'Created',
    // Model type descriptions
    modelTypes: {
      'text->text': 'text to text',
      'text+image->text': 'text and image to text',
      'text->image': 'text to image',
      'image->text': 'image to text',
      'text+image->image': 'text and image to image',
      'image->image': 'image to image',
      'audio->text': 'audio to text',
      'text->audio': 'text to audio',
      'multimodal': 'multimodal',
      'unknown': 'unknown'
    },
    // Model specialization descriptions
    modelSpecialization: 'This model specializes in {type} tasks.',
    modelSpecializationChinese: 'This model specializes in {type} tasks.'  // 英文版保持原样，实际显示时会根据语言切换
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    open: 'Open',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    more: 'More',
    less: 'Less',
    all: 'All',
    none: 'None',
    unknown: 'Unknown',
    notAvailable: 'Not Available',
    free: 'free',
    paid: 'paid',
    trending: 'trending',
    popular: 'popular',
    allAvailable: 'All available models',
    tokens: 'tokens'
  },
  
  // Footer
  footer: {
    copyright: 'Copyright',
    allRightsReserved: 'All rights reserved.',
    contact: 'Contact',
    supportEmail: 'support@qinyining.cn',
    disclaimer: 'Disclaimer',
    disclaimerText: 'This platform provides information about AI models for reference purposes only. We do not guarantee the accuracy, completeness, or reliability of the information displayed. The use of AI models should comply with applicable laws and regulations. We are not responsible for any damages or losses resulting from the use of this platform or the models listed herein.',
    poweredBy: 'Powered by'
  }
}

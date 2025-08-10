export default {
  // Header
  header: {
    title: 'AI 模型',
    home: '首页',
    openrouter: 'OpenRouter',
    huggingface: 'HuggingFace',
    searchPlaceholder: '搜索模型...',
  },

  // Home page
  home: {
    title: 'AI 模型推荐平台',
    subtitle: '发现并比较最适合您需求的 AI 模型',
    description: '探索来自 OpenAI、Anthropic、Google 等领先提供商的数百个 AI 模型。比较价格、性能和功能，为您的项目找到完美的模型。',
    getStarted: '开始使用',
    exploreModels: '探索模型',
    stats: {
      totalModels: '模型总数',
      openrouterModels: 'OpenRouter 模型',
      huggingfaceModels: 'HuggingFace 模型',
    },
    features: {
      title: '为什么选择我们的平台？',
      unified: {
        title: '统一访问',
        description: '通过单一界面访问多个 AI 提供商'
      },
      comparison: {
        title: '轻松比较',
        description: '并排比较模型，查看详细指标'
      },
      pricing: {
        title: '透明定价',
        description: '所有模型的清晰定价信息'
      },
      search: {
        title: '智能搜索',
        description: '通过高级搜索和过滤快速找到模型'
      },
      openrouter: {
        title: 'OpenRouter 集成',
        description: '通过 OpenRouter 的统一 API 访问数百个 AI 模型。比较不同模型的价格、功能和性能。获取实时模型可用性和定价信息。'
      },
      huggingface: {
        title: 'HuggingFace 模型',
        description: '探索来自 HuggingFace 的数千个开源模型。查找热门模型，阅读详细文档。了解最新模型发布和社区喜爱的模型。'
      },
      searchFilter: {
        title: '高级搜索和过滤',
        description: '强大的搜索功能，具有实时过滤和排序选项。按名称、提供商、价格或功能查找模型。'
      },
      performance: {
        title: '多方比较',
        description: '每个模型的文档、价格与类型，一目了然，方便选择，无需再费心去各个平台查找。'
      }
    },
    quickActions: '快速操作',
    exploreModels: '探索模型',
    exploreOpenRouter: '探索 OpenRouter 模型',
    exploreHuggingFace: '探索 HuggingFace 模型'
  },

  // OpenRouter Models page
  openrouter: {
    title: 'OpenRouter 模型',
    subtitle: '通过 OpenRouter 的统一 API 访问数百个 AI 模型',
    searchPlaceholder: '搜索模型',
    sortBy: '排序方式',
    sortOptions: {
      name: '名称',
      priceAsc: '价格从小到大',
      priceDesc: '价格从大到小',
      context: '上下文长度',
      date: '创建日期'
    },
    noResults: '未找到匹配搜索条件的模型。请尝试调整搜索词。',
    showingResults: '显示 {filtered} 个，共 {total} 个模型',
    modelsCount: '{count} 个模型',
    free: '免费',
    input: '输入',
    output: '输出',
    tokens: '个 token',
    created: '创建于',
    viewDetails: '查看详情',
    openInOpenRouter: '在 OpenRouter 中打开'
  },

  // HuggingFace Models page
  huggingface: {
    title: 'HuggingFace 模型',
    subtitle: '探索来自 HuggingFace 社区的数千个开源 AI 模型',
    searchPlaceholder: '搜索模型',
    sortBy: '排序方式',
    sortOptions: {
      name: '名称',
      downloads: '下载量',
      likes: '点赞数',
      trending: '热度评分',
      date: '创建日期'
    },
    noResults: '未找到匹配搜索条件的模型。请尝试调整搜索词。',
    showingResults: '显示 {filtered} 个，共 {total} 个模型',
    modelsCount: '{count} 个模型',
    downloads: '下载量',
    likes: '点赞数',
    trendingScore: '热度评分',
    created: '创建于',
    viewDetails: '查看详情',
    openInHuggingFace: '在 HuggingFace 中打开'
  },

  // Model Card
  modelCard: {
    free: '免费',
    input: '输入',
    output: '输出',
    perToken: '/token',
    per1K: '/1K',
    per1M: '/1M',
    created: '创建于',
    viewDetails: '查看详情',
    autoSelection: '多模型自动选择'
  },

  // Search Results
  search: {
    title: '搜索结果',
    query: '搜索查询',
    results: '结果',
    noResults: '未找到匹配 "{query}" 的模型',
    tryDifferent: '尝试不同的搜索词或浏览所有模型。',
    browseAll: '浏览所有模型'
  },

  // Model Detail
  modelDetail: {
    backToList: '返回列表',
    overview: '概述',
    description: '描述',
    modelDetails: '模型详情',
    modelId: '模型 ID',
    provider: '提供商',
    contextLength: '上下文长度',
    architecture: '架构',
    modality: '模态',
    tokenizer: '分词器',
    pricing: '定价',
    notSpecified: '未指定',
    supportedParameters: '支持的参数',
    usage: '使用方法',
    links: '链接',
    openInProvider: '在 {provider} 中打开',
    readme: 'README',
    noReadme: '暂无 README',
    created: '创建于', 
  },

  // Common
  common: {
    loading: '加载中...',
    error: '错误',
    retry: '重试',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    close: '关闭',
    open: '打开',
    search: '搜索',
    filter: '过滤',
    sort: '排序',
    more: '更多',
    less: '更少',
    all: '全部',
    none: '无',
    unknown: '未知',
    notAvailable: '不可用',
    free: '免费',
    paid: '付费',
    trending: '热门',
    popular: '流行',
    allAvailable: '所有可用模型',
    tokens: '个 token'
  },
  
  // Footer
  footer: {
    copyright: '版权所有',
    allRightsReserved: '保留所有权利',
    contact: '联系方式',
    supportEmail: 'support@qinyining.cn',
    disclaimer: '免责声明',
    disclaimerText: '本平台提供AI模型信息仅供参考，不保证信息的准确性、完整性或可靠性。使用AI模型应遵守相关法律法规。对于因使用本平台或所列模型而导致的任何损害或损失，我们不承担责任。',
    poweredBy: '技术支持'
  }
}

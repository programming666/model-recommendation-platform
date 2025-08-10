// 环境配置文件
const config = {
  // API基础URL，从环境变量中获取
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',

  // API端点
  endpoints: {
    models: {
      openrouter: '/api/models/openrouter',
      huggingface: '/api/models/huggingface',
      huggingfaceDetails: (modelId) => `/api/models/huggingface/${encodeURIComponent(modelId)}/details`,
      modelDetails: (type, modelId) => `/api/models/${type}/${encodeURIComponent(modelId)}`
    },
    icons: {
      get: (iconName) => `/api/icons/${iconName}`
    }
  }
};

export default config;

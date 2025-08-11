import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCachedModels, updateModelsData, getHuggingFaceModelDetails, getProcessingStatus, formatPriceDisplay } from './dataFetcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors()); // 允许跨域请求
app.use(express.json());

// 静态文件服务 - 图标
app.use('/api/icons', express.static(path.join(__dirname, '../../models-icons')));

// 获取所有模型数据
app.get('/api/models', (req, res) => {
    const { type } = req.query;
    const models = getCachedModels(type);
    
    if (models) {
        res.json({
            success: true,
            data: models,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            success: false,
            message: 'Models data is being updated. Please try again in a moment.',
            timestamp: new Date().toISOString()
        });
    }
});

// 获取OpenRouter模型
app.get('/api/models/openrouter', (req, res) => {
    const models = getCachedModels('openrouter');
    
    if (models) {
        res.json({
            success: true,
            data: models,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            success: false,
            message: 'OpenRouter models data is being updated. Please try again in a moment.',
            timestamp: new Date().toISOString()
        });
    }
});

// 获取HuggingFace模型
app.get('/api/models/huggingface', (req, res) => {
    const models = getCachedModels('huggingface');
    
    if (models) {
        res.json({
            success: true,
            data: models,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            success: false,
            message: 'HuggingFace models data is being updated. Please try again in a moment.',
            timestamp: new Date().toISOString()
        });
    }
});

// 搜索模型
app.get('/api/models/search', (req, res) => {
    const { q, type } = req.query;
    
    if (!q) {
        return res.status(400).json({
            success: false,
            message: 'Search query is required'
        });
    }
    
    const allModels = getCachedModels(type);
    let modelsToSearch = [];
    
    if (type === 'openrouter') {
        modelsToSearch = allModels;
    } else if (type === 'huggingface') {
        modelsToSearch = allModels;
    } else {
        modelsToSearch = [...allModels.openrouter, ...allModels.huggingface];
    }
    
    const searchResults = modelsToSearch.filter(model => 
        model.name?.toLowerCase().includes(q.toLowerCase()) ||
        model.id?.toLowerCase().includes(q.toLowerCase()) ||
        model.description?.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json({
        success: true,
        data: searchResults,
        query: q,
        count: searchResults.length,
        timestamp: new Date().toISOString()
    });
});

// 获取模型统计信息
app.get('/api/models/stats', (req, res) => {
    const allModels = getCachedModels();
    
    const stats = {
        openrouter: {
            total: allModels.openrouter.length,
            free: allModels.openrouter.filter(m => m.pricing?.prompt === "0").length,
            paid: allModels.openrouter.filter(m => m.pricing?.prompt !== "0").length
        },
        huggingface: {
            total: allModels.huggingface.length,
            trending: allModels.huggingface.filter(m => m.trendingScore > 100).length,
            popular: allModels.huggingface.filter(m => m.likes > 1000).length
        },
        total: allModels.openrouter.length + allModels.huggingface.length
    };
    
    res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
    });
});

// 手动触发数据更新
app.post('/api/models/refresh', (req, res) => {
    updateModelsData();
    res.json({
        success: true,
        message: 'Models data refresh initiated',
        timestamp: new Date().toISOString()
    });
});

// 获取HuggingFace模型详情（延迟加载）
// 使用正则表达式来匹配包含斜杠的模型ID
app.get(/^\/api\/models\/huggingface\/(.+)\/details$/, async (req, res) => {
    const modelId = req.params[0];
    
    if (!modelId) {
        return res.status(400).json({
            success: false,
            message: 'Model ID is required',
            timestamp: new Date().toISOString()
        });
    }
    
    try {
        const details = await getHuggingFaceModelDetails(modelId);
        res.json({
            success: true,
            data: details,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(`Error fetching details for ${modelId}:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch model details',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 获取模型处理状态
app.get('/api/models/status', (req, res) => {
    const status = getProcessingStatus();
    res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
    });
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// 在后台异步更新数据
updateModelsData();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  GET  /api/models - Get all models`);
    console.log(`  GET  /api/models/openrouter - Get OpenRouter models`);
    console.log(`  GET  /api/models/huggingface - Get HuggingFace models`);
    console.log(`  GET  /api/models/huggingface/<model-id>/details - Get HuggingFace model details (lazy loading)`);
    console.log(`  GET  /api/models/search?q=<query> - Search models`);
    console.log(`  GET  /api/models/stats - Get model statistics`);
    console.log(`  POST /api/models/refresh - Refresh model data`);
    console.log(`  GET  /api/icons/<filename> - Get model icons`);
});
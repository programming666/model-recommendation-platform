import fetch from 'node-fetch';
import NodeCache from 'node-cache';
import axios from 'axios';
import { marked } from 'marked';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cache = new NodeCache({ stdTTL: 7200, checkperiod: 120 }); // 缓存10分钟
const modelDetailsCache = new NodeCache({ stdTTL: 7200, checkperiod: 600 }); // 模型详情缓存1小时

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/models';
const HUGGINGFACE_API_URL = 'https://huggingface.co/api/models';
const HUGGINGFACE_BASE_URL = 'https://huggingface.co';

// 价格转换函数：保持原始每token价格，但添加转换后的价格用于显示
function convertPricing(pricing) {
    if (!pricing) return null;
    
    const formatPrice = (value) => {
        // 处理空值、null、undefined
        if (value === null || value === undefined || value === '') return 0;
        
        const num = parseFloat(value);
        if (isNaN(num)) return 0;
        
        // 只有当数值真正为0时才返回0
        if (num === 0) return 0;
        
        // 保持原始每token价格，不进行除法运算
        // 这样前端可以根据需要选择显示格式
        return num;
    };
    
    const converted = {
        prompt: formatPrice(pricing.prompt),
        completion: formatPrice(pricing.completion),
        request: formatPrice(pricing.request),
        image: formatPrice(pricing.image),
        web_search: formatPrice(pricing.web_search),
        internal_reasoning: formatPrice(pricing.internal_reasoning)
    };
    
    return converted;
}

// 获取模型图标路径
function getModelIcon(modelId) {
    if (!modelId) return 'default.png';
    
    const iconsDir = path.join(__dirname, '../../models-icons');
    
    try {
        // 读取models-icons目录中的所有图标文件
        const iconFiles = fs.readdirSync(iconsDir);
        
        // 过滤出图片文件（排除default.png，避免循环引用）
        const imageFiles = iconFiles.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return file !== 'default.png' && ['.svg', '.png', '.jpg', '.jpeg'].includes(ext);
        });
        
        // 将模型ID转换为小写，用于不区分大小写的匹配
        const modelIdLower = modelId.toLowerCase();
        
        // 存储匹配的图标和它们在文件名中的位置
        const matchedIcons = [];
        
        // 检查模型名称是否包含任何图标文件名（不含扩展名）
        for (const iconFile of imageFiles) {
            const iconName = path.parse(iconFile).name; // 获取文件名（不含扩展名）
            const iconNameLower = iconName.toLowerCase();
            
            // 如果模型名称包含图标文件名，记录匹配位置
            if (modelIdLower.includes(iconNameLower)) {
                const position = modelIdLower.indexOf(iconNameLower);
                matchedIcons.push({ iconFile, position, iconName: iconNameLower });
            }
        }
        
        // 如果有匹配的图标，选择位置最靠前的（优先级最高）
        if (matchedIcons.length > 0) {
            // 按位置排序，位置越小优先级越高
            matchedIcons.sort((a, b) => a.position - b.position);
            return matchedIcons[0].iconFile;
        }
        
        // 如果没有匹配的图标，尝试使用provider作为图标（原有逻辑作为备选）
        const provider = modelId.split('/')[0];
        const providerLower = provider.toLowerCase();
        
        // 优先尝试精确匹配provider名称
        for (const iconFile of imageFiles) {
            const iconName = path.parse(iconFile).name;
            if (iconName.toLowerCase() === providerLower) {
                return iconFile;
            }
        }
        
        // 如果没有精确匹配，尝试使用provider作为图标文件名
        const possibleExtensions = ['.svg', '.png', '.jpg', '.jpeg'];
        for (const ext of possibleExtensions) {
            const iconPath = path.join(iconsDir, `${provider}${ext}`);
            if (fs.existsSync(iconPath)) {
                return `${provider}${ext}`;
            }
        }
        
        // 最后返回默认图标
        return 'default.png';
    } catch (error) {
        console.error('Error reading models-icons directory:', error);
        return 'default.png';
    }
}

// 获取OpenRouter模型链接
function getOpenRouterLink(modelId) {
    return `https://openrouter.ai/models/${modelId}`;
}

// 获取HuggingFace模型链接
function getHuggingFaceLink(modelId) {
    return `${HUGGINGFACE_BASE_URL}/${modelId}`;
}

// 生成OpenRouter模型的描述（英文）
function generateOpenRouterDescription(model) {
    const name = model.name || model.id;
    let description = `${name} is an AI model available through OpenRouter's unified API.`;
    
    if (model.context_length) {
        description += ` It supports up to ${model.context_length.toLocaleString()} tokens of context.`;
    }
    
    if (model.architecture && model.architecture.modality) {
        // 使用多语言支持的模型类型描述
        const modality = model.architecture.modality;
        let typeDescription = modality;
        
        // 根据模型类型生成自然语言描述
        if (modality.toLowerCase().includes('text->text')) {
            typeDescription = 'text to text';
        } else if (modality.toLowerCase().includes('text+image->text')) {
            typeDescription = 'text and image to text';
        } else if (modality.toLowerCase().includes('text->image')) {
            typeDescription = 'text to image';
        } else if (modality.toLowerCase().includes('image->text')) {
            typeDescription = 'image to text';
        } else if (modality.toLowerCase().includes('text+image->image')) {
            typeDescription = 'text and image to image';
        } else if (modality.toLowerCase().includes('image->image')) {
            typeDescription = 'image to image';
        } else if (modality.toLowerCase().includes('audio->text')) {
            typeDescription = 'audio to text';
        } else if (modality.toLowerCase().includes('text->audio')) {
            typeDescription = 'text to audio';
        } else if (modality.toLowerCase().includes('multimodal')) {
            typeDescription = 'multimodal';
        }
        
        description += ` This model specializes in ${typeDescription} tasks.`;
    }
    
    return description;
}

// 生成OpenRouter模型的描述（中文）
function generateOpenRouterDescriptionChinese(model) {
    const name = model.name || model.id;
    let description = `${name} 是一个通过 OpenRouter 统一 API 提供的 AI 模型。`;
    
    if (model.context_length) {
        description += ` 它支持最多 ${model.context_length.toLocaleString()} 个 token 的上下文。`;
    }
    
    if (model.architecture && model.architecture.modality) {
        // 使用多语言支持的模型类型描述
        const modality = model.architecture.modality;
        let typeDescription = modality;
        
        // 根据模型类型生成自然语言描述
        if (modality.toLowerCase().includes('text->text')) {
            typeDescription = '文本到文本';
        } else if (modality.toLowerCase().includes('text+image->text')) {
            typeDescription = '文本+图片到文本';
        } else if (modality.toLowerCase().includes('text->image')) {
            typeDescription = '文本到图片';
        } else if (modality.toLowerCase().includes('image->text')) {
            typeDescription = '图片到文本';
        } else if (modality.toLowerCase().includes('text+image->image')) {
            typeDescription = '文本+图片到图片';
        } else if (modality.toLowerCase().includes('image->image')) {
            typeDescription = '图片到图片';
        } else if (modality.toLowerCase().includes('audio->text')) {
            typeDescription = '音频到文本';
        } else if (modality.toLowerCase().includes('text->audio')) {
            typeDescription = '文本到音频';
        } else if (modality.toLowerCase().includes('multimodal')) {
            typeDescription = '多模态';
        }
        
        description += ` 该模型专注于 ${typeDescription} 任务。`;
    }
    
    return description;
}

// 生成OpenRouter模型的markdown介绍（英文）
function generateOpenRouterMarkdown(model) {
    const name = model.name || model.id;
    const provider = model.id.split('/')[0];
    
    let markdown = `# ${name}

## Overview

**${name}** is an AI model available through [OpenRouter](https://openrouter.ai)'s unified API platform.

`;

    if (model.description) {
        markdown += `### Description
${model.description}

`;
    }

    markdown += `## Model Details

- **Model ID**: \`${model.id}\`
- **Provider**: ${provider}
- **Created**: ${new Date(model.created * 1000).toLocaleDateString()}
`;

    if (model.context_length) {
        markdown += `- **Context Length**: ${model.context_length.toLocaleString()} tokens
`;
    }

    if (model.architecture) {
        markdown += `- **Architecture**: ${model.architecture.modality || 'Unknown'}
`;
        if (model.architecture.tokenizer) {
            markdown += `- **Tokenizer**: ${model.architecture.tokenizer}
`;
        }
    }

    markdown += `
## Pricing

`;

    if (model.pricing) {
        const formatPriceValue = (price) => {
            const value = parseFloat(price);
            if (isNaN(value) || value === 0) return null;
            
            // OpenRouter价格已经是每token价格，转换为更易读的格式
            if (value >= 0.001) {
                return (value * 1000).toFixed(4); // 显示为每1K tokens
            } else if (value >= 0.00001) {
                return value.toFixed(6); // 显示为每token
            } else {
                return (value * 1000000).toFixed(2); // 显示为每1M tokens
            }
        };

        const promptPrice = formatPriceValue(model.pricing.prompt);
        const completionPrice = formatPriceValue(model.pricing.completion);
        const imagePrice = formatPriceValue(model.pricing.image);

        if (promptPrice) {
            markdown += `- **Input**: $${promptPrice} per 1M tokens
`;
        } else {
            markdown += `- **Input**: Free
`;
        }
        
        if (completionPrice) {
            markdown += `- **Output**: $${completionPrice} per 1M tokens
`;
        } else {
            markdown += `- **Output**: Free
`;
        }
        
        if (imagePrice) {
            markdown += `- **Image**: $${imagePrice} per 1M tokens
`;
        }
    } else {
        markdown += `- **Pricing**: Not specified
`;
    }

    if (model.supported_parameters && model.supported_parameters.length > 0) {
        markdown += `
## Supported Parameters

`;
        model.supported_parameters.forEach(param => {
            markdown += `- \`${param}\`
`;
        });
    }

    markdown += `
## Usage

This model can be accessed through the OpenRouter API:

\`\`\`javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: '${model.id}',
    messages: [
      { role: 'user', content: 'Your prompt here' }
    ]
  })
});
\`\`\`

## Links

- [OpenRouter Model Page](https://openrouter.ai/models/${model.id})
`;

    if (model.hugging_face_id) {
        markdown += `- [HuggingFace Page](https://huggingface.co/${model.hugging_face_id})
`;
    }

    // 处理相对路径，将相对路径转换为完整URL
    markdown = markdown.replace(/\]\(\/([^)]*)\)/g, '](https://openrouter.ai/$1)');
    
    return marked(markdown);
}

// 生成OpenRouter模型的markdown介绍（中文）
function generateOpenRouterMarkdownChinese(model) {
    const name = model.name || model.id;
    const provider = model.id.split('/')[0];
    
    let markdown = `# ${name}

## 概述

**${name}** 是一个通过 [OpenRouter](https://openrouter.ai) 统一 API 平台提供的 AI 模型。

`;

    if (model.description) {
        markdown += `### 描述
${model.description}

`;
    }

    markdown += `## 模型详情

- **模型 ID**: \`${model.id}\`
- **提供商**: ${provider}
- **创建时间**: ${new Date(model.created * 1000).toLocaleDateString()}
`;

    if (model.context_length) {
        markdown += `- **上下文长度**: ${model.context_length.toLocaleString()} 个 token
`;
    }

    if (model.architecture) {
        markdown += `- **架构**: ${model.architecture.modality || '未知'}
`;
        if (model.architecture.tokenizer) {
            markdown += `- **分词器**: ${model.architecture.tokenizer}
`;
        }
    }

    markdown += `
## 价格

`;

    if (model.pricing) {
        const formatPriceValue = (price) => {
            const value = parseFloat(price);
            if (isNaN(value) || value === 0) return null;
            
            // OpenRouter价格已经是每token价格，转换为更易读的格式
            if (value >= 0.001) {
                return (value * 1000).toFixed(4); // 显示为每1K tokens
            } else if (value >= 0.00001) {
                return value.toFixed(6); // 显示为每token
            } else {
                return (value * 1000000).toFixed(2); // 显示为每1M tokens
            }
        };

        const promptPrice = formatPriceValue(model.pricing.prompt);
        const completionPrice = formatPriceValue(model.pricing.completion);
        const imagePrice = formatPriceValue(model.pricing.image);

        if (promptPrice) {
            markdown += `- **输入**: $${promptPrice} 每百万 token
`;
        } else {
            markdown += `- **输入**: 免费
`;
        }
        
        if (completionPrice) {
            markdown += `- **输出**: $${completionPrice} 每百万 token
`;
        } else {
            markdown += `- **输出**: 免费
`;
        }
        
        if (imagePrice) {
            markdown += `- **图像**: $${imagePrice} 每百万 token
`;
        }
    } else {
        markdown += `- **价格**: 未指定
`;
    }

    if (model.supported_parameters && model.supported_parameters.length > 0) {
        markdown += `
## 支持的参数

`;
        model.supported_parameters.forEach(param => {
            markdown += `- \`${param}\`
`;
        });
    }

    markdown += `
## 使用方法

可以通过 OpenRouter API 访问此模型：

\`\`\`javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: '${model.id}',
    messages: [
      { role: 'user', content: '在此输入您的提示' }
    ]
  })
});
\`\`\`

## 链接

- [OpenRouter 模型页面](https://openrouter.ai/models/${model.id})
`;

    if (model.hugging_face_id) {
        markdown += `- [HuggingFace 页面](https://huggingface.co/${model.hugging_face_id})
`;
    }

    // 处理相对路径，将相对路径转换为完整URL
    markdown = markdown.replace(/\]\(\/([^)]*)\)/g, '](https://openrouter.ai/$1)');
    
    return marked(markdown);
}

async function fetchOpenRouterModels() {
    try {
        const response = await fetch(OPENROUTER_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching OpenRouter models:', error);
        return [];
    }
}

async function fetchHuggingFaceModels() {
    try {
        const response = await fetch(HUGGINGFACE_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching HuggingFace models:', error);
        return [];
    }
}

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchHuggingFaceModelDetails(modelId) {
    try {
        const headers = {};
        if (HUGGINGFACE_API_TOKEN) {
            headers['Authorization'] = `Bearer ${HUGGINGFACE_API_TOKEN}`;
        }

        const response = await fetch(`${HUGGINGFACE_API_URL}/${modelId}`, { headers });

        if (!response.ok) {
            if (response.status !== 404) {
                 console.error(`Error fetching HuggingFace model details for ${modelId}: ${response.status} ${response.statusText}`);
            }
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching HuggingFace model details for ${modelId}:`, error);
        return null;
    }
}

async function fetchModelReadme(modelId) {
    try {
        const readmeUrl = `${HUGGINGFACE_BASE_URL}/${modelId}/resolve/main/README.md`;
        const response = await axios.get(readmeUrl);
        
        if (response.status === 200) {
            // 处理相对链接
            let content = response.data;
            content = content.replace(/\]\(\.\//g, `](${HUGGINGFACE_BASE_URL}/${modelId}/resolve/main/`);
            content = content.replace(/\]\(\//g, `](${HUGGINGFACE_BASE_URL}/`);
            
            return marked(content);
        }
        return null;
    } catch (error) {
        console.error(`Error fetching README for ${modelId}:`, error.message);
        return null;
    }
}

async function updateModelsData() {
    console.log('Starting stream-based models data update...');
    
    try {
        // 立即清空并初始化缓存为空数组，允许前端获取中间状态
        cache.set('openrouter_models', []);
        cache.set('huggingface_models', []);
        
        // 获取OpenRouter模型 - 流式处理
        const openRouterModels = await fetchOpenRouterModels();
        const processedOpenRouterModels = [];

        for (const model of openRouterModels) {
            const processedModel = {
                ...model,
                type: 'openrouter',
                icon: getModelIcon(model.id),
                openrouter_link: getOpenRouterLink(model.id),
                huggingface_link: model.hugging_face_id ? getHuggingFaceLink(model.hugging_face_id) : null,
                pricing_converted: convertPricing(model.pricing),
                created_date: new Date(model.created * 1000).toISOString(),
                description: generateOpenRouterDescription(model),
                description_zh: generateOpenRouterDescriptionChinese(model),
                readme_html: generateOpenRouterMarkdown(model),
                readme_html_zh: generateOpenRouterMarkdownChinese(model)
            };
            
            processedOpenRouterModels.push(processedModel);
            
            // 每处理一个模型就更新缓存，实现流式更新
            cache.set('openrouter_models', processedOpenRouterModels);
        }
        
        console.log(`Stream updated: ${processedOpenRouterModels.length} OpenRouter models`);

        // 获取HuggingFace模型 - 流式处理
        const huggingFaceModels = await fetchHuggingFaceModels();
        const processedHuggingFaceModels = [];
        
        console.log(`Processing ${huggingFaceModels.length} HuggingFace models...`);
        
        // 使用异步队列处理，避免阻塞
        const processQueue = async () => {
            for (let i = 0; i < huggingFaceModels.length; i++) {
                const model = huggingFaceModels[i];
                
                try {
                    const details = await fetchHuggingFaceModelDetails(model.id);
                    if (details) {
                        const processedModel = {
                            ...model,
                            ...details,
                            type: 'huggingface',
                            icon: getModelIcon(model.id),
                            huggingface_link: getHuggingFaceLink(model.id),
                            readme_html: null,
                            created_date: new Date(model.createdAt).toISOString()
                        };
                        
                        processedHuggingFaceModels.push(processedModel);
                        
                        // 每处理一个模型就更新缓存
                        cache.set('huggingface_models', processedHuggingFaceModels);
                        
                        // 非阻塞延迟，使用指数退避
                        if (i < huggingFaceModels.length - 1) {
                            await delay(Math.min(100 + i * 10, 500));
                        }
                    }
                } catch (error) {
                    console.error(`Error processing HuggingFace model ${model.id}:`, error);
                    // 继续处理下一个模型，不中断整个流程
                }
            }
        };
        
        // 启动异步处理，不等待完成
        processQueue().then(() => {
            console.log(`Stream completed: ${processedHuggingFaceModels.length} HuggingFace models`);
        });
        
    } catch (error) {
        console.error('Failed to update models data:', error);
        // 发生错误时至少保留已处理的部分
        const currentOpenRouter = cache.get('openrouter_models') || [];
        const currentHuggingFace = cache.get('huggingface_models') || [];
        console.log(`Error state: ${currentOpenRouter.length} OpenRouter, ${currentHuggingFace.length} HuggingFace models retained`);
    }
}

// 立即执行一次，然后每10分钟执行一次
updateModelsData();
setInterval(updateModelsData, 10 * 60 * 1000);

// 格式化价格显示，避免精度丢失
export function formatPriceDisplay(price) {
    if (!price || price === 0) return "Free";
    
    // 统一使用正常小数显示，避免科学计数法
    if (price >= 0.001) {
        return `$${(price * 1000).toFixed(4)}/1K`;
    } else if (price >= 0.00001) {
        return `$${price.toFixed(6)}/token`;
    } else {
        return `$${(price * 1000000).toFixed(2)}/1M`;
    }
}

// 添加获取当前处理状态的函数
export function getProcessingStatus() {
    const openrouter = cache.get('openrouter_models') || [];
    const huggingface = cache.get('huggingface_models') || [];
    
    return {
        openrouter: {
            processed: openrouter.length,
            status: openrouter.length > 0 ? 'streaming' : 'processing'
        },
        huggingface: {
            processed: huggingface.length,
            status: huggingface.length > 0 ? 'streaming' : 'processing'
        },
        timestamp: new Date().toISOString()
    };
}

export function getCachedModels(type = 'all') {
    if (type === 'openrouter') {
        return cache.get('openrouter_models') || [];
    } else if (type === 'huggingface') {
        return cache.get('huggingface_models') || [];
    } else {
        return {
            openrouter: cache.get('openrouter_models') || [],
            huggingface: cache.get('huggingface_models') || []
        };
    }
}

// 按需获取HuggingFace模型详情
export async function getHuggingFaceModelDetails(modelId) {
    const cacheKey = `hf_model_${modelId}`;
    
    // 检查缓存
    const cachedDetails = modelDetailsCache.get(cacheKey);
    if (cachedDetails) {
        console.log(`Serving cached details for HuggingFace model: ${modelId}`);
        return cachedDetails;
    }
    
    console.log(`Fetching details for HuggingFace model: ${modelId}`);
    
    try {
        // 获取readme
        const readme = await fetchModelReadme(modelId);
        
        const details = {
            readme_html: readme,
            last_updated: new Date().toISOString()
        };
        
        // 缓存1小时
        modelDetailsCache.set(cacheKey, details, 7200);
        
        return details;
    } catch (error) {
        console.error(`Error fetching details for ${modelId}:`, error);
        return {
            readme_html: null,
            error: 'Failed to fetch model details',
            last_updated: new Date().toISOString()
        };
    }
}

export { updateModelsData, getModelIcon };
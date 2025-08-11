# AI模型推荐平台

## 项目简介

AI模型推荐平台是一个旨在帮助用户发现、比较和使用各种AI模型的综合平台。该平台整合了OpenRouter和HuggingFace等多个AI模型提供商的模型数据，提供统一的接口和用户友好的界面，让用户能够轻松查找、比较和选择最适合其需求的AI模型。

## 功能特点

- **模型展示**：展示来自OpenRouter和HuggingFace的AI模型
- **模型详情**：提供详细的模型信息，包括价格、参数、用途等
- **搜索功能**：支持按名称、描述等搜索模型
- **分类浏览**：按不同类别浏览AI模型
- **多语言支持**：提供多语言界面
- **响应式设计**：适配各种设备屏幕尺寸
- **实时更新**：定期获取最新的模型数据

## 技术栈

### 后端技术栈

- **框架**：Express.js（轻量级Web框架）
- **运行环境**：Node.js
- **HTTP客户端**：Axios、node-fetch
- **缓存**：Node-Cache（内存缓存）
- **Markdown处理**：Marked
- **图片处理**：Sharp
- **文件系统**：fs-extra
- **跨域支持**：CORS

### 前端技术栈

- **框架**：React 18
- **路由**：React Router DOM
- **UI组件库**：Material-UI (MUI)
- **样式**：Emotion
- **HTTP客户端**：Axios
- **Markdown渲染**：React-Markdown
- **构建工具**：Vite
- **开发工具**：TypeScript

## 项目结构

```
model-recommendation-platform/
├── backend/                 # 后端代码
│   ├── package.json        # 后端依赖配置
│   └── src/
│       ├── index.js        # 后端入口文件
│       └── dataFetcher.js  # 数据获取和处理模块
├── frontend/               # 前端代码
│   ├── package.json        # 前端依赖配置
│   ├── vite.config.js      # Vite配置
│   ├── index.html          # HTML模板
│   └── src/
│       ├── main.jsx        # 前端入口文件
│       ├── App.jsx         # 主应用组件
│       ├── components/     # UI组件
│       ├── pages/          # 页面组件
│       ├── contexts/       # React上下文
│       ├── hooks/          # 自定义Hook
│       └── locales/        # 国际化资源
└── models-icons/           # 模型图标资源
```

## 安装与运行

### 环境要求

- Node.js 16+ 
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone 
cd model-recommendation-platform
```

2. 安装依赖
```bash
npm run install:all
```

3. 配置.env变量
前端和后端都需要一些环境变量才能正常运行。你可以将环境变量存储在`.env`文件中，格式如下：
前端env：
```
# .env
FRONTEND_URI=http://localhost:3000
# 前端.env,存贮在frontend/.env文件中
```

后端env：
```
#.env
HUGGINGFACE_API_TOKEN="<huggingface api token(可选)>"
HUGGINGFACE_MAX_MODELS=1000000000000000 # 默认 1000
PORT=<端口号（可选，默认3002）>
# 后端.env存贮在backend/.env文件中
```

### 开发环境运行

```bash
# 同时启动前端和后端开发服务器
npm run dev
```

或者分别启动：

```bash
# 启动后端
npm run dev:backend

# 启动前端
npm run dev:frontend
```

### 生产环境构建

```bash
# 构建前端
npm run build
```

## API接口

### 模型相关接口

- `GET /api/models` - 获取所有模型数据
- `GET /api/models/openrouter` - 获取OpenRouter模型
- `GET /api/models/huggingface` - 获取HuggingFace模型
- `GET /api/models/huggingface/:id/details` - 获取HuggingFace模型详情（延迟加载）
- `GET /api/models/search?q=:query` - 搜索模型
- `GET /api/models/stats` - 获取模型统计信息
- `POST /api/models/refresh` - 手动触发数据更新

### 系统接口

- `GET /api/health` - 健康检查
- `GET /api/icons/:filename` - 获取模型图标

## 数据来源

- **OpenRouter**：通过API获取模型列表和详细信息
- **HuggingFace**：通过API获取模型列表，支持延迟加载模型详情

## 缓存策略

- 模型列表缓存：2小时（7200秒）
- 模型详情缓存：2小时（7200秒）
- 定期检查缓存：5分钟（300秒）

## 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request


## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交Issue
- 发送邮件至：[qyn@qinyining.cn]

## 致谢

感谢以下开源项目和平台：

- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Vite](https://vitejs.dev/)
- [OpenRouter](https://openrouter.ai/)
- [Hugging Face](https://huggingface.co/)

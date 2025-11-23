# SEO Optimizer Pro - Backend API

后端API服务，提供真实的SEO网站分析功能。

## 📋 功能特性

- ✅ 真实的网站内容爬取和分析
- ✅ 全面的SEO检查（页面SEO、内容分析、技术SEO）
- ✅ 关键词提取
- ✅ SEO评分计算（0-100分）
- ✅ 优化建议生成
- ✅ 错误处理和安全性检查
- ✅ CORS支持

## 🚀 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（基于 `.env.example`）：

```bash
# 复制示例文件
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

### 3. 启动服务器

**开发模式**（自动重启）：
```bash
npm run dev
```

**生产模式**：
```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

## 📡 API端点

### 健康检查

```
GET /api/health
```

响应：
```json
{
  "status": "ok",
  "message": "SEO Optimizer Pro API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### SEO分析

```
POST /api/analyze-seo
Content-Type: application/json

{
  "url": "https://example.com"
}
```

响应：
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "domain": "example.com",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "overallScore": 75,
    "onPage": [...],
    "content": [...],
    "technical": [...],
    "keywords": [...],
    "recommendations": [...]
  }
}
```

## 🔧 配置说明

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 服务器端口 | 3000 |
| `NODE_ENV` | 运行环境 | development |
| `CORS_ORIGIN` | 允许的前端域名 | http://localhost:8080 |
| `REQUEST_TIMEOUT` | 请求超时时间（毫秒） | 30000 |

### 修改CORS设置

如果前端运行在不同的端口或域名，修改 `.env` 文件中的 `CORS_ORIGIN`：

```env
CORS_ORIGIN=http://localhost:8080
# 或
CORS_ORIGIN=https://yourdomain.com
```

## 🛠️ 技术栈

- **Node.js** - 运行时环境
- **Express** - Web框架
- **Cheerio** - HTML解析
- **Axios** - HTTP客户端
- **Validator** - URL验证

## 📝 使用示例

### 使用curl测试

```bash
# 健康检查
curl http://localhost:3000/api/health

# SEO分析
curl -X POST http://localhost:3000/api/analyze-seo \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### 使用JavaScript

```javascript
const response = await fetch('http://localhost:3000/api/analyze-seo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ url: 'https://example.com' })
});

const result = await response.json();
console.log(result);
```

## ⚠️ 注意事项

1. **CORS限制**：确保 `.env` 中的 `CORS_ORIGIN` 与前端地址匹配
2. **超时设置**：某些网站可能响应较慢，可以调整 `REQUEST_TIMEOUT`
3. **速率限制**：生产环境建议添加速率限制中间件
4. **安全性**：只允许HTTP和HTTPS协议，防止SSRF攻击
5. **错误处理**：API会返回详细的错误信息帮助调试

## 🐛 故障排除

### 问题：无法连接到后端

**解决方案**：
1. 确认后端服务器正在运行（检查 `http://localhost:3000/api/health`）
2. 检查端口是否被占用
3. 确认防火墙设置

### 问题：CORS错误

**解决方案**：
1. 检查 `.env` 文件中的 `CORS_ORIGIN` 设置
2. 确保前端URL与配置的CORS_ORIGIN匹配
3. 重启后端服务器

### 问题：网站分析失败

**解决方案**：
1. 检查URL格式是否正确
2. 确认目标网站可访问
3. 某些网站可能阻止爬虫，这是正常现象
4. 查看服务器日志了解详细错误信息

## 📊 分析功能详情

### 页面SEO检查
- 标题标签（Title Tag）
- Meta描述
- H1标题
- 图片Alt文本
- 内部链接

### 内容分析
- 内容长度
- 关键词密度
- 内容可读性
- 内容新鲜度

### 技术SEO检查
- HTTPS/SSL
- 移动友好性
- 规范URL
- Open Graph标签
- Robots Meta标签
- 结构化数据

## 🔮 后续改进

- [ ] 添加速率限制
- [ ] 实现缓存机制
- [ ] 添加数据库存储分析历史
- [ ] 集成Google PageSpeed Insights API
- [ ] 添加外链分析功能
- [ ] 实现批量分析
- [ ] 添加PDF报告生成

## 📄 许可证

MIT License


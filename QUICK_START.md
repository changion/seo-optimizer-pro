# 🚀 快速启动指南

## 完整系统启动步骤

### 第一步：启动后端API服务器

1. **进入服务器目录**：
```bash
cd server
```

2. **安装依赖**（首次运行）：
```bash
npm install
```

3. **创建环境变量文件**：
```bash
# Mac/Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

4. **启动后端服务器**：
```bash
npm run dev
```

看到以下消息说明启动成功：
```
🚀 SEO Optimizer Pro API server running on port 3000
📡 CORS enabled for: http://localhost:8080
🌍 Environment: development
```

**保持这个终端窗口打开！**

### 第二步：启动前端服务器

打开**新的终端窗口**：

1. **进入项目根目录**：
```bash
cd /Users/chenjunrun/Documents/txt
```

2. **启动前端服务器**：
```bash
python3 -m http.server 8080
```

或者使用npm（如果已安装http-server）：
```bash
npm start
```

### 第三步：访问网站

1. 打开浏览器访问：`http://localhost:8080`
2. 点击 "Start Free Analysis" 或访问：`http://localhost:8080/seo-analyzer.html`
3. 输入要分析的网站URL（例如：`https://example.com`）
4. 点击 "Analyze SEO" 查看结果！

## ✅ 验证安装

### 检查后端API

访问：`http://localhost:3000/api/health`

应该看到：
```json
{
  "status": "ok",
  "message": "SEO Optimizer Pro API is running"
}
```

### 检查前端

访问：`http://localhost:8080`

应该看到SEO Optimizer Pro主页。

## 🐛 常见问题

### 问题：后端无法启动

**检查**：
1. Node.js是否已安装：`node --version`
2. 依赖是否已安装：`cd server && npm install`
3. 端口3000是否被占用

### 问题：前端无法连接后端

**检查**：
1. 后端是否正在运行（检查 `http://localhost:3000/api/health`）
2. `.env` 文件中的 `CORS_ORIGIN` 是否正确
3. 浏览器控制台是否有错误信息

### 问题：SEO分析失败

**可能原因**：
- 目标网站阻止了爬虫
- 网站响应超时
- URL格式不正确

**解决方案**：
- 尝试分析其他网站
- 检查URL格式（需要包含 http:// 或 https://）
- 查看后端终端日志了解详细错误

## 📝 下一步

- ✅ 系统已启动并运行
- 尝试分析不同的网站
- 查看分析结果和建议
- 根据需要调整配置

## 💡 提示

- **开发模式**：使用 `npm run dev` 启动后端，会自动重启
- **两个终端**：一个运行后端（端口3000），一个运行前端（端口8080）
- **查看日志**：后端终端会显示所有API请求和错误信息


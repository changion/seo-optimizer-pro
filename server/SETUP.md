# 后端API设置指南

## 📋 前置要求

在开始之前，请确保您已安装：

- **Node.js** (版本 14 或更高)
- **npm** (通常随Node.js一起安装)

### 检查安装

```bash
node --version  # 应该显示 v14.x.x 或更高
npm --version   # 应该显示 6.x.x 或更高
```

如果没有安装，请访问 [nodejs.org](https://nodejs.org/) 下载安装。

## 🚀 安装步骤

### 步骤1：进入服务器目录

```bash
cd server
```

### 步骤2：安装依赖

```bash
npm install
```

这将安装所有必需的依赖包：
- express
- cors
- dotenv
- cheerio
- axios
- validator

### 步骤3：创建环境变量文件

创建 `.env` 文件：

**Windows (PowerShell)**:
```powershell
Copy-Item .env.example .env
```

**Mac/Linux**:
```bash
cp .env.example .env
```

或者手动创建 `.env` 文件，内容如下：

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

### 步骤4：启动服务器

**开发模式**（推荐，自动重启）：
```bash
npm run dev
```

**生产模式**：
```bash
npm start
```

如果看到以下消息，说明服务器启动成功：
```
🚀 SEO Optimizer Pro API server running on port 3000
📡 CORS enabled for: http://localhost:8080
🌍 Environment: development
```

## ✅ 验证安装

打开浏览器或使用curl访问：

```
http://localhost:3000/api/health
```

应该看到：
```json
{
  "status": "ok",
  "message": "SEO Optimizer Pro API is running",
  "timestamp": "..."
}
```

## 🔧 配置说明

### 修改端口

如果3000端口被占用，编辑 `.env` 文件：

```env
PORT=3001
```

然后更新前端的 `seo-analyzer.js` 中的 `API_BASE_URL`：

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

### 修改CORS设置

如果前端运行在不同端口，修改 `.env`：

```env
CORS_ORIGIN=http://localhost:8080
```

## 🐛 常见问题

### 问题1：npm install 失败

**可能原因**：
- 网络连接问题
- Node.js版本过低

**解决方案**：
```bash
# 清除npm缓存
npm cache clean --force

# 使用国内镜像（中国用户）
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### 问题2：端口已被占用

**解决方案**：
1. 查找占用端口的进程：
   ```bash
   # Mac/Linux
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. 杀死进程或修改端口（见上方配置说明）

### 问题3：模块未找到错误

**解决方案**：
```bash
# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

## 📝 下一步

1. ✅ 后端API已启动
2. 确保前端服务器也在运行（`http://localhost:8080`）
3. 打开 `seo-analyzer.html` 测试SEO分析功能

## 💡 提示

- 开发时使用 `npm run dev`，它会自动重启服务器
- 查看终端日志了解API请求和错误信息
- 如果分析失败，检查目标网站是否可访问


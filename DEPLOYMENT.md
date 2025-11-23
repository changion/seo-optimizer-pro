# 🚀 部署上线指南

## 📋 部署方案概览

本项目包含两部分需要部署：
1. **前端**：静态网站（HTML/CSS/JS）
2. **后端**：Node.js API服务器

## 🎯 推荐部署方案

### 方案1：全栈部署（推荐）
- **前端**：Vercel / Netlify（免费，自动部署）
- **后端**：Railway / Render / Heroku（免费/付费）

### 方案2：云服务器部署
- **前端 + 后端**：同一台服务器（VPS）
- 推荐：DigitalOcean, AWS EC2, 阿里云等

### 方案3：分离部署
- **前端**：GitHub Pages / Cloudflare Pages
- **后端**：独立服务器或云函数

---

## 🌐 方案1：Vercel + Railway（推荐，最简单）

### 第一部分：部署前端到 Vercel

#### 步骤1：准备前端代码

1. **修改API地址**（生产环境）

编辑 `seo-analyzer.js`，将API地址改为生产环境：

```javascript
// 开发环境
// const API_BASE_URL = 'http://localhost:3000/api';

// 生产环境（替换为您的后端地址）
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

2. **创建 vercel.json**（可选，用于路由配置）

在项目根目录创建 `vercel.json`：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

#### 步骤2：部署到 Vercel

**方法A：使用Vercel CLI**

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

**方法B：使用GitHub集成（推荐）**

1. 将代码推送到GitHub
2. 访问 https://vercel.com
3. 点击 "New Project"
4. 导入GitHub仓库
5. 配置：
   - Framework Preset: Other
   - Build Command: （留空）
   - Output Directory: ./
6. 点击 "Deploy"

#### 步骤3：配置环境变量（如果需要）

在Vercel项目设置中添加环境变量（如果有）。

---

### 第二部分：部署后端到 Railway

#### 步骤1：准备后端代码

1. **创建 Railway 配置文件**

在 `server` 目录创建 `railway.json`：

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **更新 package.json 启动脚本**

确保 `server/package.json` 中有：

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

#### 步骤2：部署到 Railway

1. **访问 Railway**
   - 网址：https://railway.app
   - 使用GitHub账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择您的仓库
   - 选择 `server` 目录

3. **配置环境变量**
   在Railway项目设置中添加：
   ```
   PORT=3000
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

4. **获取部署URL**
   - Railway会自动分配一个域名
   - 例如：`https://your-app.railway.app`

#### 步骤3：更新前端API地址

回到前端代码，更新 `seo-analyzer.js`：

```javascript
const API_BASE_URL = 'https://your-app.railway.app/api';
```

重新部署前端到Vercel。

---

## 🖥️ 方案2：云服务器部署（VPS）

### 服务器要求

- **操作系统**：Ubuntu 20.04+ / CentOS 7+
- **内存**：至少 1GB RAM
- **存储**：至少 10GB
- **Node.js**：v14+

### 部署步骤

#### 步骤1：服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装Nginx（用于反向代理）
sudo apt install nginx -y

# 安装PM2（进程管理）
sudo npm install -g pm2
```

#### 步骤2：上传代码

```bash
# 使用Git克隆
git clone your-repo-url
cd your-project

# 或使用SCP上传
scp -r ./txt user@your-server-ip:/var/www/seo-optimizer
```

#### 步骤3：配置后端

```bash
cd /var/www/seo-optimizer/server

# 安装依赖
npm install --production

# 创建.env文件
cat > .env << EOF
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
EOF

# 使用PM2启动
pm2 start server.js --name seo-api
pm2 save
pm2 startup
```

#### 步骤4：配置Nginx反向代理

创建Nginx配置 `/etc/nginx/sites-available/seo-optimizer`：

```nginx
# 前端配置
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/seo-optimizer;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# 后端API配置
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/seo-optimizer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 步骤5：配置SSL（Let's Encrypt）

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

#### 步骤6：更新前端API地址

编辑 `seo-analyzer.js`：

```javascript
const API_BASE_URL = 'https://api.your-domain.com/api';
```

---

## 🔧 方案3：Docker部署

### 创建Dockerfile

#### 前端Dockerfile

在项目根目录创建 `Dockerfile.frontend`：

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 后端Dockerfile

在 `server` 目录创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose配置

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CORS_ORIGIN=http://localhost
    restart: unless-stopped
```

### 部署

```bash
# 构建和启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

---

## 📝 部署前检查清单

### 前端检查

- [ ] 更新 `seo-analyzer.js` 中的 `API_BASE_URL`
- [ ] 检查所有资源路径（CSS、JS、图片）
- [ ] 测试所有功能
- [ ] 压缩和优化资源（可选）

### 后端检查

- [ ] 设置正确的环境变量
- [ ] 更新 `CORS_ORIGIN` 为生产域名
- [ ] 检查端口配置
- [ ] 设置错误日志
- [ ] 配置速率限制（推荐）

### 安全检查

- [ ] 使用HTTPS（SSL证书）
- [ ] 配置CORS白名单
- [ ] 设置环境变量（不要硬编码）
- [ ] 启用防火墙规则
- [ ] 定期更新依赖包

---

## 🔒 生产环境优化

### 后端优化

#### 1. 添加速率限制

在 `server/server.js` 中添加：

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 100次请求
});

app.use('/api/', limiter);
```

安装：`npm install express-rate-limit`

#### 2. 添加请求日志

```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

#### 3. 错误处理增强

```javascript
// 生产环境不暴露错误详情
if (process.env.NODE_ENV === 'production') {
  app.use((err, req, res, next) => {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });
}
```

### 前端优化

#### 1. 压缩资源

使用构建工具压缩CSS和JS：
- Webpack
- Vite
- Parcel

#### 2. CDN加速

将静态资源放到CDN：
- Cloudflare
- AWS CloudFront
- 阿里云CDN

---

## 🌍 域名配置

### 购买域名

推荐域名注册商：
- Namecheap
- GoDaddy
- 阿里云
- 腾讯云

### DNS配置

#### A记录（指向服务器IP）

```
your-domain.com     A     your-server-ip
www.your-domain.com A     your-server-ip
api.your-domain.com A     your-server-ip
```

#### CNAME记录（指向Vercel/Railway）

如果使用Vercel：
```
your-domain.com     CNAME  cname.vercel-dns.com
www.your-domain.com CNAME  cname.vercel-dns.com
```

---

## 📊 监控和维护

### 监控工具

1. **Uptime监控**
   - UptimeRobot（免费）
   - Pingdom
   - StatusCake

2. **错误追踪**
   - Sentry
   - Rollbar

3. **性能监控**
   - Google Analytics
   - New Relic

### 日志管理

```bash
# PM2日志
pm2 logs seo-api

# Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 备份策略

```bash
# 定期备份代码和数据库
# 使用cron定时任务
0 2 * * * /path/to/backup-script.sh
```

---

## 🚨 常见问题

### 问题1：CORS错误

**解决方案**：
- 检查 `CORS_ORIGIN` 环境变量
- 确保前端域名在白名单中
- 检查Nginx配置（如果使用）

### 问题2：API超时

**解决方案**：
- 增加超时时间
- 优化爬取逻辑
- 使用缓存机制

### 问题3：SSL证书问题

**解决方案**：
- 使用Let's Encrypt自动续期
- 检查证书有效期
- 配置自动续期脚本

---

## 📚 推荐阅读

- [Vercel部署文档](https://vercel.com/docs)
- [Railway部署文档](https://docs.railway.app)
- [Nginx配置指南](https://nginx.org/en/docs/)
- [PM2文档](https://pm2.keymetrics.io/docs/)

---

## ✅ 部署后验证

部署完成后，检查：

1. ✅ 前端可以访问
2. ✅ 后端API健康检查通过
3. ✅ SEO分析功能正常
4. ✅ HTTPS正常工作
5. ✅ CORS配置正确
6. ✅ 错误处理正常

---

**祝您部署顺利！** 🚀


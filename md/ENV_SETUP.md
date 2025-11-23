# 环境变量配置说明

## 📝 创建 .env 文件

在 `server` 目录下创建 `.env` 文件，内容如下：

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

## 🔧 配置说明

### PORT
服务器运行的端口号
- 默认：`3000`
- 如果端口被占用，可以改为其他端口（如：`3001`）

### NODE_ENV
运行环境
- `development` - 开发环境
- `production` - 生产环境

### CORS_ORIGIN
允许访问API的前端地址
- 默认：`http://localhost:8080`
- 如果前端运行在不同端口，需要修改此值
- 例如：如果前端在 `http://localhost:3000`，则设置为 `CORS_ORIGIN=http://localhost:3000`

## 📋 创建步骤

### Mac/Linux
```bash
cd server
cat > .env << EOF
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
EOF
```

### Windows (PowerShell)
```powershell
cd server
@"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
"@ | Out-File -FilePath .env -Encoding utf8
```

### 手动创建
1. 在 `server` 目录下创建新文件
2. 文件名：`.env`（注意前面有点）
3. 复制上面的内容到文件中
4. 保存文件

## ✅ 验证

创建后，`.env` 文件应该位于：
```
server/
  ├── .env
  ├── package.json
  ├── server.js
  └── ...
```

## ⚠️ 注意事项

- `.env` 文件已添加到 `.gitignore`，不会被提交到Git
- 不要将 `.env` 文件分享给他人（可能包含敏感信息）
- 修改 `.env` 后需要重启服务器才能生效


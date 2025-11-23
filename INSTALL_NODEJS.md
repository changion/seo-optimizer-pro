# Node.js 安装指南

## 🔍 检测结果

您的系统上未检测到 Node.js。需要先安装 Node.js 才能运行后端API服务器。

## 📥 安装 Node.js

### 方法1：使用 Homebrew（推荐 - Mac用户）

如果您已安装 Homebrew：

```bash
# 安装 Node.js（包含npm）
brew install node

# 验证安装
node --version
npm --version
```

### 方法2：官方安装包（所有系统）

1. **访问 Node.js 官网**：
   - 网址：https://nodejs.org/
   - 选择 LTS（长期支持）版本

2. **下载安装包**：
   - **Mac**: 下载 `.pkg` 文件
   - **Windows**: 下载 `.msi` 文件
   - **Linux**: 下载对应的安装包或使用包管理器

3. **运行安装程序**：
   - 按照安装向导完成安装
   - 确保勾选 "Add to PATH" 选项

4. **验证安装**：
   打开新的终端窗口，运行：
   ```bash
   node --version
   npm --version
   ```

### 方法3：使用 nvm（Node Version Manager）

如果您想管理多个Node.js版本：

```bash
# 安装 nvm (Mac/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 或使用 Homebrew
brew install nvm

# 安装最新LTS版本
nvm install --lts
nvm use --lts
```

## ✅ 安装后验证

安装完成后，**重新打开终端**，运行：

```bash
node --version   # 应该显示 v18.x.x 或更高
npm --version    # 应该显示 9.x.x 或更高
```

## 🚀 安装完成后的步骤

一旦Node.js安装完成，回到项目目录执行：

```bash
# 1. 进入服务器目录
cd server

# 2. 安装依赖
npm install

# 3. 启动服务器
npm run dev
```

## 🐛 常见问题

### 问题：安装后仍然找不到 node 命令

**解决方案**：
1. **重新打开终端**（环境变量需要重新加载）
2. 检查PATH环境变量：
   ```bash
   echo $PATH
   ```
3. 手动添加到PATH（如果需要）：
   ```bash
   # Mac/Linux - 添加到 ~/.zshrc 或 ~/.bash_profile
   export PATH="/usr/local/bin:$PATH"
   ```

### 问题：权限错误

**解决方案**：
```bash
# 不要使用 sudo 安装全局包
# 如果遇到权限问题，修复npm权限：
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

## 📋 系统要求

- **Node.js**: 版本 14 或更高（推荐 18 LTS）
- **npm**: 版本 6 或更高（通常随Node.js一起安装）

## 🔗 相关链接

- Node.js 官网：https://nodejs.org/
- npm 文档：https://docs.npmjs.com/
- nvm 文档：https://github.com/nvm-sh/nvm

---

**安装完成后，请告诉我，我会继续帮您完成后续步骤！** 🎉


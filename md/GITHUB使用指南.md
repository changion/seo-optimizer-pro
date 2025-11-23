# 📚 GitHub 使用指南（从零开始）

## 🎯 什么是GitHub？

GitHub是一个代码托管平台，可以：
- 保存您的代码
- 与其他人协作
- 自动部署网站

## 📋 第一步：创建GitHub账号

### 1.1 注册账号

1. **访问GitHub官网**
   - 网址：https://github.com
   - 点击右上角 "Sign up"

2. **填写信息**
   - Username（用户名）- 选择一个唯一的用户名
   - Email（邮箱）- 使用您的邮箱
   - Password（密码）- 设置强密码

3. **验证邮箱**
   - 检查邮箱，点击验证链接

4. **完成注册**
   - 选择免费计划（Free）
   - 完成注册

---

## 📦 第二步：创建仓库（Repository）

### 2.1 创建新仓库

1. **登录GitHub后**
   - 点击右上角 "+" 号
   - 选择 "New repository"

2. **填写仓库信息**
   - **Repository name**（仓库名称）：`seo-optimizer-pro`
   - **Description**（描述）：`SEO Optimizer Pro - AI-powered SEO analysis platform`
   - **Visibility**（可见性）：
     - ✅ Public（公开）- 免费，所有人都能看到
     - ⚪ Private（私有）- 需要付费，只有您能看到
   - **不要勾选** "Add a README file"（我们已有代码）
   - **不要勾选** "Add .gitignore"（我们已有）
   - **不要选择** License

3. **点击 "Create repository"**

---

## 💻 第三步：安装Git（如果还没有）

### 3.1 检查是否已安装Git

打开终端，运行：

```bash
git --version
```

如果显示版本号（如 `git version 2.x.x`），说明已安装，跳到第四步。

### 3.2 安装Git

**Mac用户**：
```bash
# 使用Homebrew
brew install git

# 或下载安装包
# 访问：https://git-scm.com/download/mac
```

**Windows用户**：
1. 访问：https://git-scm.com/download/win
2. 下载并运行安装程序
3. 安装时选择默认选项即可

**验证安装**：
```bash
git --version
```

---

## 🔧 第四步：配置Git（首次使用）

### 4.1 设置用户名和邮箱

在终端运行：

```bash
git config --global user.name "您的GitHub用户名"
git config --global user.email "您的邮箱"
```

例如：
```bash
git config --global user.name "chenjunrun"
git config --global user.email "your-email@example.com"
```

### 4.2 验证配置

```bash
git config --global user.name
git config --global user.email
```

---

## 📤 第五步：上传代码到GitHub

### 方法A：使用命令行（推荐）

#### 5.1 进入项目目录

```bash
cd /Users/chenjunrun/Documents/txt
```

#### 5.2 初始化Git仓库

```bash
git init
```

#### 5.3 添加所有文件

```bash
git add .
```

#### 5.4 提交代码

```bash
git commit -m "Initial commit: SEO Optimizer Pro"
```

#### 5.5 连接到GitHub仓库

**重要**：将 `YOUR_USERNAME` 替换为您的GitHub用户名，`seo-optimizer-pro` 替换为您的仓库名。

```bash
git remote add origin https://github.com/YOUR_USERNAME/seo-optimizer-pro.git
```

例如：
```bash
git remote add origin https://github.com/chenjunrun/seo-optimizer-pro.git
```

#### 5.6 推送代码到GitHub

```bash
git branch -M main
git push -u origin main
```

**首次推送会要求登录**：
- 输入GitHub用户名
- 输入密码（或使用Personal Access Token）

---

### 方法B：使用GitHub Desktop（图形界面，更简单）

#### 5.1 下载GitHub Desktop

1. 访问：https://desktop.github.com
2. 下载并安装GitHub Desktop

#### 5.2 登录GitHub

1. 打开GitHub Desktop
2. 点击 "Sign in to GitHub.com"
3. 使用浏览器登录

#### 5.3 添加本地仓库

1. 点击 "File" → "Add Local Repository"
2. 选择项目目录：`/Users/chenjunrun/Documents/txt`
3. 点击 "Add repository"

#### 5.4 发布到GitHub

1. 点击 "Publish repository"
2. 填写信息：
   - Name: `seo-optimizer-pro`
   - Description: `SEO Optimizer Pro`
   - ✅ Keep this code private（可选，私有仓库）
3. 点击 "Publish repository"

---

## 🔐 第六步：设置Personal Access Token（如果需要）

如果命令行推送时要求Token：

### 6.1 创建Token

1. 登录GitHub
2. 点击右上角头像 → "Settings"
3. 左侧菜单选择 "Developer settings"
4. 选择 "Personal access tokens" → "Tokens (classic)"
5. 点击 "Generate new token" → "Generate new token (classic)"
6. 填写信息：
   - Note: `Git Push Token`
   - Expiration: 选择过期时间（建议90天或更长）
   - 勾选权限：**repo**（全部）
7. 点击 "Generate token"
8. **重要**：复制Token（只显示一次！）

### 6.2 使用Token

推送代码时，密码处输入Token而不是GitHub密码。

---

## ✅ 第七步：验证上传

### 7.1 检查GitHub仓库

1. 访问您的GitHub主页
2. 找到仓库 `seo-optimizer-pro`
3. 点击进入
4. 应该能看到所有文件

### 7.2 检查文件

确认以下文件已上传：
- ✅ `index.html`
- ✅ `seo-analyzer.html`
- ✅ `config.js`
- ✅ `server/` 目录
- ✅ 其他所有文件

---

## 🔄 后续更新代码

### 使用命令行

```bash
# 1. 进入项目目录
cd /Users/chenjunrun/Documents/txt

# 2. 查看更改
git status

# 3. 添加更改的文件
git add .

# 4. 提交更改
git commit -m "描述您的更改"

# 5. 推送到GitHub
git push
```

### 使用GitHub Desktop

1. 打开GitHub Desktop
2. 左侧会显示更改的文件
3. 在底部填写提交信息
4. 点击 "Commit to main"
5. 点击 "Push origin"

---

## 🚀 第八步：连接Vercel和Railway

### 8.1 连接Vercel（前端）

1. **访问Vercel**
   - 网址：https://vercel.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择 "Import Git Repository"
   - 选择您的仓库 `seo-optimizer-pro`
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: **Other**
   - Build Command: （留空）
   - Output Directory: **./**（点斜杠）
   - Root Directory: **./**（点斜杠）

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成
   - 获取URL（例如：`https://seo-optimizer-pro.vercel.app`）

### 8.2 连接Railway（后端）

1. **访问Railway**
   - 网址：https://railway.app
   - 使用GitHub账号登录

2. **创建项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择您的仓库 `seo-optimizer-pro`

3. **配置项目**
   - 点击项目设置（齿轮图标）
   - 找到 "Root Directory"
   - 设置为：`server`
   - 保存

4. **配置环境变量**
   - 在项目设置 → Variables 中添加：
     ```
     PORT=3000
     NODE_ENV=production
     CORS_ORIGIN=https://your-vercel-url.vercel.app
     ```
   - （先留空CORS_ORIGIN，等Vercel部署后再更新）

5. **获取后端URL**
   - Railway会自动分配URL
   - 例如：`https://seo-api-production.up.railway.app`

---

## 📝 完整操作流程总结

### 第一次部署

1. ✅ 创建GitHub账号
2. ✅ 创建仓库
3. ✅ 安装Git
4. ✅ 配置Git
5. ✅ 上传代码到GitHub
6. ✅ 连接Vercel部署前端
7. ✅ 连接Railway部署后端
8. ✅ 更新 `config.js` 中的API地址
9. ✅ 更新Railway的CORS_ORIGIN
10. ✅ 测试功能

### 后续更新

1. 修改代码
2. 提交到GitHub（`git add .` → `git commit` → `git push`）
3. Vercel和Railway会自动重新部署

---

## 🐛 常见问题

### 问题1：git push 要求密码

**解决方案**：
- 使用Personal Access Token代替密码
- 或使用GitHub Desktop

### 问题2：找不到仓库

**解决方案**：
- 检查仓库名称是否正确
- 检查是否已创建仓库
- 确认GitHub用户名正确

### 问题3：权限被拒绝

**解决方案**：
- 检查Token权限是否包含 `repo`
- 重新生成Token

### 问题4：文件没有上传

**解决方案**：
- 检查 `.gitignore` 是否排除了文件
- 确认 `git add .` 已执行
- 检查 `git status` 查看文件状态

---

## 💡 提示

1. **首次使用建议用GitHub Desktop**，更简单直观
2. **提交信息要清晰**，方便以后查看历史
3. **定期推送代码**，避免丢失
4. **不要上传敏感信息**（API密钥等），使用环境变量

---

## 📚 学习资源

- **Git官方文档**：https://git-scm.com/doc
- **GitHub指南**：https://guides.github.com
- **GitHub Desktop文档**：https://docs.github.com/en/desktop

---

## ✅ 检查清单

- [ ] GitHub账号已创建
- [ ] 仓库已创建
- [ ] Git已安装并配置
- [ ] 代码已上传到GitHub
- [ ] 可以在GitHub看到所有文件
- [ ] 已连接Vercel
- [ ] 已连接Railway

---

**完成这些步骤后，您的代码就在GitHub上了！** 🎉

接下来可以按照 `部署快速指南.md` 继续部署。


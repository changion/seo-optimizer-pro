#!/bin/bash

# SEO Optimizer Pro - 后端安装脚本

echo "🚀 SEO Optimizer Pro 后端安装脚本"
echo "=================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js"
    echo ""
    echo "请先安装 Node.js："
    echo "1. 访问 https://nodejs.org/ 下载安装"
    echo "2. 或使用 Homebrew: brew install node"
    echo ""
    echo "安装完成后，重新运行此脚本。"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到 npm"
    echo "npm 通常随 Node.js 一起安装，请检查 Node.js 安装。"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cat > .env << EOF
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
EOF
    echo "✅ .env 文件已创建"
else
    echo "✅ .env 文件已存在"
fi
echo ""

# 安装依赖
echo "📦 安装依赖包..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 安装完成！"
    echo ""
    echo "下一步："
    echo "1. 运行 'npm run dev' 启动开发服务器"
    echo "2. 或运行 'npm start' 启动生产服务器"
    echo ""
    echo "服务器将在 http://localhost:3000 启动"
else
    echo ""
    echo "❌ 安装失败，请检查错误信息"
    exit 1
fi


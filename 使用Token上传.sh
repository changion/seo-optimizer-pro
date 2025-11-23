#!/bin/bash

# 使用Token上传到GitHub的简化脚本

cd "$(dirname "$0")"

# 您的GitHub信息
GITHUB_USERNAME=$(git config user.name)
# Token从环境变量读取，或手动输入
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
REPO_NAME="seo-optimizer-pro"

echo "🚀 使用Token上传到GitHub"
echo "========================"
echo ""

# 检查Git配置
if [ -z "$GITHUB_USERNAME" ]; then
    echo "⚠️  需要配置Git用户名"
    read -p "请输入GitHub用户名: " GITHUB_USERNAME
    git config --global user.name "$GITHUB_USERNAME"
fi

echo "✅ GitHub用户名: $GITHUB_USERNAME"
echo "✅ 仓库名称: $REPO_NAME"
echo ""

# 如果没有Token，提示输入
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  需要GitHub Token"
    read -sp "请输入您的GitHub Token（输入时不会显示）: " GITHUB_TOKEN
    echo ""
    echo ""
fi

# 初始化Git（如果需要）
if [ ! -d .git ]; then
    echo "📦 初始化Git仓库..."
    git init
fi

# 添加文件
echo "📝 添加文件..."
git add .

# 提交
echo "💾 提交更改..."
git commit -m "Initial commit: SEO Optimizer Pro" 2>/dev/null || git commit -m "Update: SEO Optimizer Pro"

# 设置远程仓库（使用token）
echo "🔗 设置远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# 推送
echo "📤 推送代码到GitHub..."
echo ""
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码已成功推送到GitHub！"
    echo ""
    echo "🔗 仓库地址: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    echo "⚠️  安全提示："
    echo "   Token已在此脚本中使用，建议："
    echo "   1. 在GitHub重新生成Token"
    echo "   2. 删除此脚本中的Token"
    echo "   3. 使用环境变量存储Token"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "请检查："
    echo "   1. 仓库是否已创建: https://github.com/new"
    echo "   2. Token是否有效"
    echo "   3. 网络连接是否正常"
    exit 1
fi


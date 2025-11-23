#!/bin/bash

# SEO Optimizer Pro - 一键上传到GitHub脚本

echo "🚀 SEO Optimizer Pro - GitHub上传脚本"
echo "======================================"
echo ""

# 检查Git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ 未检测到Git"
    echo ""
    echo "请先安装Git："
    echo "Mac: brew install git"
    echo "或访问: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git已安装: $(git --version)"
echo ""

# 进入项目目录
cd "$(dirname "$0")"
echo "📁 当前目录: $(pwd)"
echo ""

# 检查是否已经是Git仓库
if [ ! -d .git ]; then
    echo "📦 初始化Git仓库..."
    git init
    echo "✅ Git仓库已初始化"
    echo ""
fi

# 检查Git配置
if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
    echo "⚠️  Git用户信息未配置"
    echo ""
    read -p "请输入您的GitHub用户名: " GIT_USERNAME
    read -p "请输入您的邮箱: " GIT_EMAIL
    
    git config --global user.name "$GIT_USERNAME"
    git config --global user.email "$GIT_EMAIL"
    echo "✅ Git配置已设置"
    echo ""
fi

# 显示当前Git配置
echo "📋 当前Git配置:"
echo "   用户名: $(git config user.name)"
echo "   邮箱: $(git config user.email)"
echo ""

# 添加所有文件
echo "📝 添加文件到Git..."
git add .
echo "✅ 文件已添加"
echo ""

# 检查是否有更改
if git diff --staged --quiet && git diff --quiet; then
    echo "ℹ️  没有需要提交的更改"
    echo ""
else
    # 提交更改
    read -p "请输入提交信息（直接回车使用默认）: " COMMIT_MSG
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="Update SEO Optimizer Pro"
    fi
    
    echo "💾 提交更改..."
    git commit -m "$COMMIT_MSG"
    echo "✅ 更改已提交"
    echo ""
fi

# 检查是否已设置远程仓库
if ! git remote | grep -q origin; then
    echo "🔗 需要设置GitHub远程仓库"
    echo ""
    read -p "请输入您的GitHub用户名: " GITHUB_USERNAME
    read -p "请输入仓库名称（默认: seo-optimizer-pro）: " REPO_NAME
    if [ -z "$REPO_NAME" ]; then
        REPO_NAME="seo-optimizer-pro"
    fi
    
    GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo ""
    echo "📋 请确认："
    echo "   GitHub URL: $GITHUB_URL"
    echo ""
    read -p "这个URL正确吗？(y/n): " CONFIRM
    
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
        echo "❌ 已取消"
        exit 1
    fi
    
    echo ""
    echo "🔗 添加远程仓库..."
    git remote add origin "$GITHUB_URL"
    echo "✅ 远程仓库已添加"
    echo ""
    
    echo "⚠️  重要提示："
    echo "   1. 请先在GitHub创建仓库: $REPO_NAME"
    echo "   2. 如果使用HTTPS，推送时需要输入GitHub用户名和密码（或Token）"
    echo ""
    read -p "已在GitHub创建仓库？(y/n): " REPO_CREATED
    
    if [ "$REPO_CREATED" != "y" ] && [ "$REPO_CREATED" != "Y" ]; then
        echo ""
        echo "📝 请先完成以下步骤："
        echo "   1. 访问 https://github.com/new"
        echo "   2. 创建仓库: $REPO_NAME"
        echo "   3. 然后重新运行此脚本"
        exit 1
    fi
fi

# 设置主分支
git branch -M main 2>/dev/null

# 推送代码
echo "📤 推送代码到GitHub..."
echo ""

# 检查是否已设置token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  需要GitHub Token进行认证"
    echo ""
    read -sp "请输入您的GitHub Token（输入时不会显示）: " GITHUB_TOKEN
    echo ""
    echo ""
fi

# 如果有token，使用token推送
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔐 使用Token进行认证..."
    # 使用token设置远程URL
    GITHUB_USERNAME=$(git config user.name)
    CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null)
    if [ -n "$CURRENT_REMOTE" ]; then
        # 提取仓库名
        REPO_NAME=$(echo "$CURRENT_REMOTE" | sed 's/.*\///' | sed 's/\.git$//')
        # 使用token更新远程URL
        git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    fi
fi

echo "📤 正在推送..."
git push -u origin main

# 清理token（安全）
if [ -n "$GITHUB_TOKEN" ]; then
    # 恢复原始URL（不包含token）
    CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null | sed "s/${GITHUB_TOKEN}@//")
    if [ -n "$CURRENT_REMOTE" ]; then
        git remote set-url origin "$CURRENT_REMOTE"
    fi
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码已成功推送到GitHub！"
    echo ""
    echo "🎉 下一步："
    echo "   1. 访问您的GitHub仓库查看代码"
    echo "   2. 按照 '部署快速指南.md' 部署到Vercel和Railway"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "   1. 仓库不存在 - 请先在GitHub创建仓库"
    echo "   2. 认证失败 - 使用Personal Access Token"
    echo "   3. 网络问题 - 检查网络连接"
    echo ""
    echo "💡 建议使用GitHub Desktop（图形界面更简单）"
    exit 1
fi


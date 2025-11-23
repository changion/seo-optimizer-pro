@echo off
REM SEO Optimizer Pro - 后端安装脚本 (Windows)

echo.
echo 🚀 SEO Optimizer Pro 后端安装脚本
echo ==================================
echo.

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js
    echo.
    echo 请先安装 Node.js：
    echo 1. 访问 https://nodejs.org/ 下载安装
    echo 2. 安装完成后，重新运行此脚本
    echo.
    pause
    exit /b 1
)

REM 检查 npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 npm
    echo npm 通常随 Node.js 一起安装，请检查 Node.js 安装。
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version
echo ✅ npm 版本:
npm --version
echo.

REM 检查 .env 文件
if not exist .env (
    echo 📝 创建 .env 文件...
    (
        echo PORT=3000
        echo NODE_ENV=development
        echo CORS_ORIGIN=http://localhost:8080
    ) > .env
    echo ✅ .env 文件已创建
) else (
    echo ✅ .env 文件已存在
)
echo.

REM 安装依赖
echo 📦 安装依赖包...
call npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ 安装完成！
    echo.
    echo 下一步：
    echo 1. 运行 'npm run dev' 启动开发服务器
    echo 2. 或运行 'npm start' 启动生产服务器
    echo.
    echo 服务器将在 http://localhost:3000 启动
) else (
    echo.
    echo ❌ 安装失败，请检查错误信息
    pause
    exit /b 1
)

pause


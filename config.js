// 配置文件 - 部署时请修改此文件

// API配置
const CONFIG = {
    // 开发环境API地址（本地开发时使用）
    development: {
        apiBaseUrl: 'http://localhost:3000/api'
    },
    
    // 生产环境API地址（部署时修改为您的实际后端地址）
    production: {
        // ✅ 已配置为您的Render后端URL
        // ⚠️ 重要：URL必须以 /api 结尾，不能包含 /health
        // 代码会自动拼接 /analyze-seo，最终URL：https://seo-optimizer-pro.onrender.com/api/analyze-seo
        apiBaseUrl: 'https://seo-optimizer-pro.onrender.com/api'
    }
};

// 自动检测环境
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.includes('localhost');

// 导出当前环境的配置
window.API_CONFIG = isDevelopment ? CONFIG.development : CONFIG.production;


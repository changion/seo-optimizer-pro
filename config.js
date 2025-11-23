// 配置文件 - 部署时请修改此文件

// API配置
const CONFIG = {
    // 开发环境API地址
    development: {
        apiBaseUrl: 'http://localhost:3000/api'
    },
    
    // 生产环境API地址（部署时修改为您的实际后端地址）
    production: {
        apiBaseUrl: 'https://your-backend-domain.com/api'
        // 示例：
        // apiBaseUrl: 'https://seo-api-production.up.railway.app/api'
        // apiBaseUrl: 'https://api.yourdomain.com/api'
    }
};

// 自动检测环境
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.includes('localhost');

// 导出当前环境的配置
window.API_CONFIG = isDevelopment ? CONFIG.development : CONFIG.production;


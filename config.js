// config.js - 主应用配置
const CONFIG = {
    // 应用配置
    app: {
        name: "定制你的专属歌厅",
        version: "2.0.0",
        description: "一站式KTV歌厅定制解决方案",
        environment: window.APP_ENVIRONMENT || "production"
    },
    
    // 价格配置
    pricing: {
        basePrice: 100,
        shipping: {
            west: 10,
            east: 15
        }
    },
    
    // 功能开关
    features: {
        auth: true,
        offline: true,
        pwa: true,
        adminPanel: true  // 启用管理面板
    }
};

// 全局导出
window.CONFIG = CONFIG;
window.APP_CONFIG = CONFIG; // 兼容性

console.log(`🚀 ${CONFIG.app.name} v${CONFIG.app.version} 已加载`);

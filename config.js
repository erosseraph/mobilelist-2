// config.js - 独立的配置管理

// 管理员配置
const ADMIN_CONFIG = {
    password: "82030901"
};

// 应用基础配置
const APP_CONFIG = {
    name: "定制你的专属歌厅",
    version: "2.1.2",  // 更新版本号
    environment: window.APP_ENVIRONMENT || "production"
};

// 功能开关
const FEATURE_CONFIG = {
    auth: true,
    offline: true,
    pwa: true
};

console.log(`🚀 ${APP_CONFIG.name} v${APP_CONFIG.version} - ${APP_CONFIG.environment}`);

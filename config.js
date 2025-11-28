// 环境配置
const CONFIG = {
    // Firebase 配置通过环境变量注入
    firebase: getFirebaseConfig(),
    
    // 应用配置
    app: {
        name: "定制你的专属歌厅",
        version: "2.0.0",
        environment: window.APP_ENVIRONMENT || "production"
    },
    
    // 功能开关
    features: {
        auth: true,
        offline: true,
        pwa: true
    }
};

console.log(`🚀 ${CONFIG.app.name} v${CONFIG.app.version} - ${CONFIG.app.environment}`);

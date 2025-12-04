// admin-config.js - 专门为管理页面设计的配置
window.ADMIN_CONFIG = {
    // 管理员密码
    password: "82030901", // 你可以修改这个密码
    
    // Firebase 配置（直接写在这里，避免依赖外部文件）
    firebaseConfig: {
        apiKey: "AIzaSyAMn7EOOUDpIGXzA8EhPBtLWw7BwyU2Rdc",
        authDomain: "karaoke-customizer.firebaseapp.com",
        projectId: "karaoke-customizer",
        storageBucket: "karaoke-customizer.firebasestorage.app",
        messagingSenderId: "593643512892",
        appId: "1:593643512892:web:c21ec4ce7c2d286fed4f39",
        measurementId: "G-D791D33Y6R"
    },
    
    // 会话设置
    sessionDuration: 2 * 60 * 60 * 1000, // 2小时
    
    // 功能设置
    features: {
        exportData: true,
        realtimeUpdates: true,
        bulkOperations: true,
        returnToHome: true  // 允许返回主页
    },
    
    // 主页链接
    homePageUrl: "index.html"
};

// 兼容性函数（为了旧代码）
window.getFirebaseConfig = function() {
    return window.ADMIN_CONFIG.firebaseConfig;
};

console.log("✅ 管理面板配置已加载");
// firebase-config.js - 只为主应用服务
const firebaseConfig = {
    apiKey: "AIzaSyAMn7EOOUDpIGXzA8EhPBtLWw7BwyU2Rdc",
    authDomain: "karaoke-customizer.firebaseapp.com",
    projectId: "karaoke-customizer",
    storageBucket: "karaoke-customizer.firebasestorage.app",
    messagingSenderId: "593643512892",
    appId: "1:593643512892:web:c21ec4ce7c2d286fed4f39",
    measurementId: "G-D791D33Y6R"
};

// 只为主应用导出
if (typeof window !== 'undefined') {
    window.FIREBASE_CONFIG = firebaseConfig;
    console.log("✅ Firebase 配置已为主应用加载");
}

// 如果有模块导出需求
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig };
}

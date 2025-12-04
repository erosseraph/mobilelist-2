// firebase-config.js - 更新版本
const firebaseConfig = {
    apiKey: "AIzaSyAMn7EOOUDpIGXzA8EhPBtLWw7BwyU2Rdc",
    authDomain: "karaoke-customizer.firebaseapp.com",
    projectId: "karaoke-customizer",
    storageBucket: "karaoke-customizer.firebasestorage.app",
    messagingSenderId: "593643512892",
    appId: "1:593643512892:web:c21ec4ce7c2d286fed4f39",
    measurementId: "G-D791D33Y6R"
};

// 导出配置给主应用
window.FIREBASE_CONFIG = firebaseConfig;

// 管理员密码配置
window.ADMIN_PASSWORD = window.ADMIN_PASSWORD || "82030901";

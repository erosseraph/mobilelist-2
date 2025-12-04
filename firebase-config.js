// firebase-config.js - Firebase配置
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

// 提供函数形式（兼容旧代码）
function getFirebaseConfig() {
    return firebaseConfig;
}

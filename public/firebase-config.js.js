// Firebase configuration - 通过环境变量注入
const getFirebaseConfig = () => {
    return {
        apiKey: window.FIREBASE_API_KEY || "AIzaSyAMn7EOOUDpIGXzA8EhPBtLWw7BwyU2Rdc",
        authDomain: window.FIREBASE_AUTH_DOMAIN || "karaoke-customizer.firebaseapp.com",
        projectId: window.FIREBASE_PROJECT_ID || "karaoke-customizer",
        storageBucket: window.FIREBASE_STORAGE_BUCKET || "karaoke-customizer.firebasestorage.app",
        messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "593643512892",
        appId: window.FIREBASE_APP_ID || "1:593643512892:web:c21ec4ce7c2d286fed4f39",
        measurementId: window.FIREBASE_MEASUREMENT_ID || "G-D791D33Y6R"
    };
};

// 管理员配置
const ADMIN_CONFIG = {
    password: window.ADMIN_PASSWORD || "82030901"
};
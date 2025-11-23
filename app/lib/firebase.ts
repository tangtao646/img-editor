"use client"; // 这是一个客户端模块

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// 你的 Firebase 配置对象
// 请替换为你在 Firebase 控制台获取的实际配置
const firebaseConfig = {
  apiKey: "AIzaSyAiIRZ5K9x7HxRKOfsDz44aIHJI0rRDG1Y",
  authDomain: "awsomebase-41441.firebaseapp.com",
  projectId: "awsomebase-41441",
  storageBucket: "awsomebase-41441.firebasestorage.app",
  messagingSenderId: "849670553229",
  appId: "1:849670553229:web:cc8a3b32b9e11b3a066cc4",
  measurementId: "G-3KWY6C9E7M"
};


// 初始化 Firebase 应用
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// 获取 Analytics 实例
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') { // 确保只在浏览器环境中运行
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  });
}

export { analytics };
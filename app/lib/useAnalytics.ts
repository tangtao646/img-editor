"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase'; // 导入 Firebase Analytics 实例
import { isBot } from '../lib/analytics'; // 导入 isBot 函数

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // 确保只在浏览器环境且 Analytics 实例可用时运行
    if (typeof window === 'undefined' || !analytics) return;

    const userAgent = navigator.userAgent;
    const botDetected = isBot(userAgent);

    // 记录 Firebase Analytics 事件
    // 'page_view' 是一个推荐的事件名称
    logEvent(analytics, 'page_view', {
      page_path: pathname,
      user_agent: userAgent, // 作为自定义参数记录
      is_bot: botDetected,   // 作为自定义参数记录
      // Firebase Analytics 会自动收集设备、地理位置等信息
      // IP 地址由 Google Analytics 内部收集用于地理位置报告，但不会直接暴露给你
    });

    console.log(`📊 Firebase Analytics: Page view logged for ${pathname}, isBot: ${botDetected}`);

  }, [pathname]); // 依赖 pathname，在路由变化时触发
}
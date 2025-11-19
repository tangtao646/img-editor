import { useEffect } from "react";

export const useAdsense = () => {
  useEffect(() => {
    const initAds = () => {
      if (typeof window === 'undefined') return;
      
      // 检查脚本是否已加载
      const scripts = document.querySelectorAll('script[src*="adsbygoogle"]');
      if (scripts.length === 0) {
        console.warn('AdSense script not loaded yet');
        return;
      }

      try {
        // 确保 adsbygoogle 已初始化
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }

        // 防止重复初始化
        if (window.adsbygoogle.loaded) {
          return;
        }

        // 只初始化一次
        window.adsbygoogle.push({});
        window.adsbygoogle.loaded = true;
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    };

    // 等待脚本加载完成
    const timer = setTimeout(initAds, 1000);
    
    return () => clearTimeout(timer);
  }, []);
};
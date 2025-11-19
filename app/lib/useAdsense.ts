import { useEffect } from "react";

export const useAdsense = () => {
  useEffect(() => {
    const initAds = () => {
      if (typeof window === 'undefined') return;

      try {
        // 等待广告脚本加载
        if (!window.adsbygoogle) {
          console.log('AdSense script not ready, retrying...');
          setTimeout(initAds, 300);
          return;
        }

        // 查找所有广告位
        const ads = document.querySelectorAll('.adsbygoogle');
        console.log(`Found ${ads.length} ad units in DOM`);

        if (ads.length === 0) {
          console.log('No ad units found, retrying...');
          setTimeout(initAds, 300);
          return;
        }

        // 查找未初始化的广告
        const uninitializedAds = Array.from(ads).filter(
          ad => !ad.getAttribute('data-adsbygoogle-status')
        );
        
        console.log(`Uninitialized ads: ${uninitializedAds.length}`);

        if (uninitializedAds.length > 0) {
          console.log('Pushing ads to adsbygoogle...');
          
          // 为每个广告位单独 push
          uninitializedAds.forEach(() => {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          });
          
          console.log('AdSense ads pushed successfully');
        }
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    };

    // 延迟更长时间，确保 DOM 完全渲染
    const timer = setTimeout(initAds, 2000);
    
    return () => clearTimeout(timer);
  }, []);
};
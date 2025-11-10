import { useEffect } from "react";

export const useAdsense = () => {
  useEffect(() => {
    try {
      const initAds = () => {
        if (typeof window === 'undefined') return;
        
        // Initialize adsbygoogle if not already done
        if (!(window as any).adsbygoogle) {
          (window as any).adsbygoogle = [];
        }

        // Check if ads are already loaded
        if ((window as any).adsbygoogle.loaded) return;

        // Push ads only once
        (window as any).adsbygoogle.push({});
        (window as any).adsbygoogle.loaded = true;
      };

      // Wait for full page load
      if (document.readyState === 'complete') {
        initAds();
      } else {
        window.addEventListener('load', initAds);
        return () => window.removeEventListener('load', initAds);
      }
    } catch (error) {
      console.error('AdSense initialization error:', error);
    }
  }, []);
};
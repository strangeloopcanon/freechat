"use client";

import { useEffect, useState } from "react";

export default function SidebarAds() {
  const [adsenseLoaded, setAdsenseLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Check if AdSense is available and try to load ads
    const loadAdsense = async () => {
      try {
        // Wait for AdSense script to be available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          console.log('AdSense script detected, attempting to load ads...');
          
          // Push the ad request
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          
          // Check if ads loaded after a delay
          setTimeout(() => {
            const adsenseElements = document.querySelectorAll('.adsbygoogle');
            let hasLoadedAds = false;
            
            adsenseElements.forEach(el => {
              if (el.innerHTML.trim() !== '' || el.getAttribute('data-adsbygoogle-status') === 'done') {
                hasLoadedAds = true;
              }
            });
            
            if (hasLoadedAds) {
              console.log('AdSense ads loaded successfully');
              setAdsenseLoaded(true);
              setShowFallback(false);
            } else {
              console.log('AdSense ads not loaded, showing fallback');
              setShowFallback(true);
            }
          }, 3000);
        } else {
          console.log('AdSense script not available, showing fallback');
          setShowFallback(true);
        }
      } catch (err) {
        console.error("AdSense error:", err);
        setShowFallback(true);
      }
    };

    // Load AdSense after component mounts
    const timer = setTimeout(loadAdsense, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="w-72 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Sponsored Content
          </h3>
          
          {/* Real AdSense Unit */}
          {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <ins
                className="adsbygoogle"
                style={{ display: "block", minHeight: "250px" }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          )}
          
          {/* Show loading or fallback message */}
          {!adsenseLoaded && !showFallback && (
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Loading ads...</p>
            </div>
          )}
        </div>

        {/* Fallback/Demo Ads - only show if AdSense fails or while waiting for approval */}
        {(showFallback || !process.env.NEXT_PUBLIC_ADSENSE_CLIENT) && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500 text-center mb-2">
              {!process.env.NEXT_PUBLIC_ADSENSE_CLIENT 
                ? "Demo ads (AdSense not configured)" 
                : "Demo ads (AdSense pending approval)"}
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AD</span>
                </div>
                <span className="text-xs text-gray-500">Sponsored</span>
              </div>
              <h4 className="font-medium text-sm text-gray-900 mb-1">
                Learn AI Development
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                Master machine learning and AI with our comprehensive courses.
              </p>
              <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Learn More →
              </button>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AD</span>
                </div>
                <span className="text-xs text-gray-500">Sponsored</span>
              </div>
              <h4 className="font-medium text-sm text-gray-900 mb-1">
                Premium AI Chat
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                Upgrade to access GPT-4, longer conversations, and priority support.
              </p>
              <button className="text-xs text-orange-600 hover:text-orange-800 font-medium">
                Upgrade Now →
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
} 
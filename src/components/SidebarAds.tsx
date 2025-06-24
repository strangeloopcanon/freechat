"use client";

import { useEffect, useState } from "react";

export default function SidebarAds() {
  const [adsenseLoaded, setAdsenseLoaded] = useState(false);

  useEffect(() => {
    // Try to load AdSense ads
    const loadAdsense = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).adsbygoogle.push({});
        
        // Check if AdSense loaded after a delay
        setTimeout(() => {
          const adsenseEl = document.querySelector('.adsbygoogle');
          if (adsenseEl && adsenseEl.innerHTML.trim() !== '') {
            setAdsenseLoaded(true);
          }
        }, 2000);
      } catch (err) {
        console.error("AdSense error:", err);
      }
    };

    loadAdsense();
  }, []);

  return (
    <aside className="w-72 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Sponsored Content
          </h3>
          
          {/* AdSense Unit */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
              data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>

        {/* Always show fallback/demo ads */}
        <div className="space-y-4">
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
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
              <span className="text-xs text-gray-500">Sponsored</span>
            </div>
            <h4 className="font-medium text-sm text-gray-900 mb-1">
              Cloud Computing Solutions
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              Scale your applications with our reliable cloud infrastructure.
            </p>
            <button className="text-xs text-green-600 hover:text-green-800 font-medium">
              Get Started →
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
              <span className="text-xs text-gray-500">Sponsored</span>
            </div>
            <h4 className="font-medium text-sm text-gray-900 mb-1">
              Developer Tools
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              Boost your productivity with our suite of development tools.
            </p>
            <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
              Try Free →
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
      </div>
    </aside>
  );
} 
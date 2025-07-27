"use client";

import { useEffect, useState } from "react";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ContextualAd {
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge: string;
  badgeColor: string;
  buttonColor: string;
  buttonText: string;
}

interface SidebarAdsProps {
  messages?: Message[];
}

export default function SidebarAds({ messages = [] }: SidebarAdsProps) {
  const [adsenseLoaded, setAdsenseLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [contextualAds, setContextualAds] = useState<ContextualAd[]>([]);

  // Generate contextual ads based on conversation
  const generateContextualAds = (conversation: Message[]): ContextualAd[] => {
    if (conversation.length === 0) return [];

    // Analyze full conversation with weighted emphasis on recent messages
    const fullContent = conversation.map((msg, index) => {
      const weight = Math.pow(1.5, index); // Recent messages get higher weight
      return msg.content.toLowerCase().repeat(Math.ceil(weight));
    }).join(' ');

    // Define ad templates based on conversation topics
    const adTemplates: Array<{
      keywords: string[];
      ad: ContextualAd;
    }> = [
      {
        keywords: ['code', 'programming', 'developer', 'software', 'bug', 'debug', 'function', 'class', 'api'],
        ad: {
          title: "Neural Code Synthesizer",
          description: "AI-powered code generation with quantum debugging. Write perfect code in any language instantly.",
          price: "$47",
          originalPrice: "$199",
          badge: "DEV",
          badgeColor: "from-emerald-500 to-teal-500",
          buttonColor: "from-emerald-500 to-teal-500",
          buttonText: "Synthesize Now →"
        }
      },
      {
        keywords: ['ai', 'machine learning', 'model', 'training', 'algorithm', 'neural', 'intelligence'],
        ad: {
          title: "Cerebral Cortex Accelerator",
          description: "Neural network training at 1000x speed. Deploy AI models in seconds, not days.",
          price: "$89",
          originalPrice: "$299",
          badge: "AI",
          badgeColor: "from-purple-500 to-indigo-500",
          buttonColor: "from-purple-500 to-indigo-500",
          buttonText: "Accelerate →"
        }
      },
      {
        keywords: ['data', 'analysis', 'analytics', 'insights', 'metrics', 'chart', 'graph', 'statistics'],
        ad: {
          title: "Quantum Data Oracle",
          description: "Predictive analytics powered by quantum computing. See the future of your data.",
          price: "$67",
          originalPrice: "$249",
          badge: "DATA",
          badgeColor: "from-blue-500 to-cyan-500",
          buttonColor: "from-blue-500 to-cyan-500",
          buttonText: "Predict Now →"
        }
      },
      {
        keywords: ['design', 'ui', 'ux', 'interface', 'user experience', 'layout', 'visual', 'frontend'],
        ad: {
          title: "Holographic Interface Designer",
          description: "Create immersive 3D interfaces with neural design AI. The future of UX is here.",
          price: "$59",
          originalPrice: "$179",
          badge: "UX",
          badgeColor: "from-pink-500 to-rose-500",
          buttonColor: "from-pink-500 to-rose-500",
          buttonText: "Design Future →"
        }
      },
      {
        keywords: ['business', 'startup', 'entrepreneur', 'growth', 'revenue', 'market', 'strategy', 'company'],
        ad: {
          title: "Quantum Business Simulator",
          description: "Test business strategies in parallel universes. Find the path to maximum success.",
          price: "$129",
          originalPrice: "$399",
          badge: "BIZ",
          badgeColor: "from-orange-500 to-red-500",
          buttonColor: "from-orange-500 to-red-500",
          buttonText: "Simulate Success →"
        }
      },
      {
        keywords: ['writing', 'content', 'blog', 'article', 'copy', 'text', 'words', 'story'],
        ad: {
          title: "Neural Content Generator",
          description: "AI-powered writing that sounds human. Generate viral content in seconds.",
          price: "$39",
          originalPrice: "$149",
          badge: "WRITE",
          badgeColor: "from-green-500 to-emerald-500",
          buttonColor: "from-green-500 to-emerald-500",
          buttonText: "Generate →"
        }
      },
      {
        keywords: ['productivity', 'workflow', 'automation', 'efficiency', 'time', 'task', 'process'],
        ad: {
          title: "Temporal Workflow Optimizer",
          description: "Bend time to your will. Automate tasks across multiple timelines simultaneously.",
          price: "$79",
          originalPrice: "$259",
          badge: "PROD",
          badgeColor: "from-violet-500 to-purple-500",
          buttonColor: "from-violet-500 to-purple-500",
          buttonText: "Optimize Time →"
        }
      },
      {
        keywords: ['security', 'privacy', 'encryption', 'hack', 'protect', 'secure', 'password'],
        ad: {
          title: "Quantum Encryption Shield",
          description: "Unbreakable quantum encryption for your digital assets. Future-proof security.",
          price: "$149",
          originalPrice: "$499",
          badge: "SEC",
          badgeColor: "from-red-500 to-pink-500",
          buttonColor: "from-red-500 to-pink-500",
          buttonText: "Secure Now →"
        }
      },
      {
        keywords: ['mobile', 'app', 'ios', 'android', 'phone', 'device', 'responsive'],
        ad: {
          title: "Cross-Dimensional App Builder",
          description: "Build apps that work across all devices and dimensions. One codebase, infinite platforms.",
          price: "$99",
          originalPrice: "$299",
          badge: "MOBILE",
          badgeColor: "from-yellow-500 to-orange-500",
          buttonColor: "from-yellow-500 to-orange-500",
          buttonText: "Build Universal →"
        }
      },
      {
        keywords: ['cloud', 'server', 'hosting', 'deploy', 'infrastructure', 'scalable'],
        ad: {
          title: "Quantum Cloud Platform",
          description: "Deploy to quantum servers with infinite scalability. Your apps, everywhere, instantly.",
          price: "$199",
          originalPrice: "$599",
          badge: "CLOUD",
          badgeColor: "from-indigo-500 to-blue-500",
          buttonColor: "from-indigo-500 to-blue-500",
          buttonText: "Deploy Quantum →"
        }
      }
    ];

    // Score each template based on keyword matches
    const scoredTemplates = adTemplates.map(template => {
      const score = template.keywords.reduce((total, keyword) => {
        const matches = (fullContent.match(new RegExp(keyword, 'g')) || []).length;
        return total + matches;
      }, 0);
      return { ...template, score };
    });

    // Sort by score and get top 2
    const topTemplates = scoredTemplates
      .filter(template => template.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    // If we have 2 high-scoring templates, return them
    if (topTemplates.length >= 2) {
      return topTemplates.map(template => template.ad);
    }

    // If we have 1 high-scoring template, add a complementary ad
    if (topTemplates.length === 1) {
      const complementaryAds = [
        {
          title: "Quantum Neural Interface",
          description: "Connect your mind directly to AI. Experience the future of human-computer interaction.",
          price: "$199",
          originalPrice: "$599",
          badge: "FUTURE",
          badgeColor: "from-indigo-500 to-purple-500",
          buttonColor: "from-indigo-500 to-purple-500",
          buttonText: "Connect Now →"
        },
        {
          title: "Temporal Reality Manipulator",
          description: "Control time and space in your digital environment. The ultimate productivity tool.",
          price: "$299",
          originalPrice: "$899",
          badge: "TIME",
          badgeColor: "from-cyan-500 to-blue-500",
          buttonColor: "from-cyan-500 to-blue-500",
          buttonText: "Manipulate Reality →"
        }
      ];
      
      return [topTemplates[0].ad, complementaryAds[Math.floor(Math.random() * complementaryAds.length)]];
    }

    // Default ads if no specific matches
    return [
      {
        title: "Quantum Neural Interface",
        description: "Connect your mind directly to AI. Experience the future of human-computer interaction.",
        price: "$199",
        originalPrice: "$599",
        badge: "FUTURE",
        badgeColor: "from-indigo-500 to-purple-500",
        buttonColor: "from-indigo-500 to-purple-500",
        buttonText: "Connect Now →"
      },
      {
        title: "Temporal Reality Manipulator",
        description: "Control time and space in your digital environment. The ultimate productivity tool.",
        price: "$299",
        originalPrice: "$899",
        badge: "TIME",
        badgeColor: "from-cyan-500 to-blue-500",
        buttonColor: "from-cyan-500 to-blue-500",
        buttonText: "Manipulate Reality →"
      }
    ];
  };

  useEffect(() => {
    // Generate contextual ads when messages change
    if (messages.length > 0) {
      const ads = generateContextualAds(messages);
      setContextualAds(ads);
    } else {
      setContextualAds([]);
    }
  }, [messages]);

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
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
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

        {/* Contextual Ads - Show when conversation has content */}
        {contextualAds.length > 0 && messages.length > 0 && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500 text-center mb-3 px-2 py-1 bg-blue-50 rounded-full border border-blue-100">
              🤖 AI-Generated Ads (Based on your conversation)
            </div>
            
            {contextualAds.map((ad, index) => (
              <div key={index} className="group bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${ad.badgeColor} rounded-full flex items-center justify-center shadow-sm`}>
                    <span className="text-white text-xs font-bold">{ad.badge}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 font-medium">Sponsored</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs text-gray-400">4.9/5 (2.7k reviews)</span>
                    </div>
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {ad.title}
                </h4>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {ad.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-semibold">{ad.price}</span>
                    {ad.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">{ad.originalPrice}</span>
                    )}
                  </div>
                  <button className={`text-xs bg-gradient-to-r ${ad.buttonColor} text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105`}>
                    {ad.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback/Demo Ads - only show if AdSense fails or while waiting for approval */}
        {(showFallback || !process.env.NEXT_PUBLIC_ADSENSE_CLIENT) && contextualAds.length === 0 && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500 text-center mb-3 px-2 py-1 bg-gray-100 rounded-full">
              {!process.env.NEXT_PUBLIC_ADSENSE_CLIENT 
                ? "Demo ads (AdSense not configured)" 
                : "Demo ads (AdSense pending approval)"}
            </div>
            
            {/* Enhanced AI Development Ad */}
            <div className="group bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-medium">Sponsored</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-yellow-500">★</span>
                    <span className="text-xs text-gray-400">4.8/5 (2.1k reviews)</span>
                  </div>
                </div>
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Master AI Development
              </h4>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Build real-world AI applications with hands-on projects. Learn Python, TensorFlow, and deploy your models.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-semibold">$29</span>
                  <span className="text-xs text-gray-400 line-through">$99</span>
                </div>
                <button className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105">
                  Start Learning →
                </button>
              </div>
            </div>

            {/* Enhanced Premium Chat Ad */}
            <div className="group bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">PRO</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-medium">Sponsored</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-yellow-500">★</span>
                    <span className="text-xs text-gray-400">4.9/5 (5.3k reviews)</span>
                  </div>
                </div>
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Premium AI Assistant
              </h4>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Unlock GPT-4, unlimited conversations, file uploads, and priority support. Perfect for professionals.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-semibold">$19</span>
                  <span className="text-xs text-gray-400">/month</span>
                </div>
                <button className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105">
                  Upgrade Now →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
} 
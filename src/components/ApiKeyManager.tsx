"use client";

import { useState, useEffect } from "react";

interface ApiKeyManagerProps {
  onApiKeyChange: (apiKey: string | null) => void;
}

export default function ApiKeyManager({ onApiKeyChange }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
      setIsSaved(true);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey.trim());
      onApiKeyChange(apiKey.trim());
      setIsSaved(true);
    } else {
      localStorage.removeItem("openai_api_key");
      onApiKeyChange(null);
      setIsSaved(false);
    }
  };

  const handleClear = () => {
    setApiKey("");
    localStorage.removeItem("openai_api_key");
    onApiKeyChange(null);
    setIsSaved(false);
  };

  const getMaskedKey = (key: string) => {
    if (key.length <= 8) return "*".repeat(key.length);
    return key.substring(0, 4) + "*".repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">OpenAI API Key</h3>
        {isSaved && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            Saved
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type={isVisible ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {isVisible ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Save
          </button>
        </div>
        
        {isSaved && (
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Current key: {getMaskedKey(apiKey)}</span>
            <button
              onClick={handleClear}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>• Your API key is stored locally and never sent to our servers</p>
          <p>• Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a></p>
          <p>• Using your own key means you pay for your own usage</p>
        </div>
      </div>
    </div>
  );
} 
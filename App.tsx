
import React, { useState, useEffect, useCallback } from 'react';
import { getChatResponse } from './services/geminiService';
import type { Message, UserLocation } from './types.ts';
import MapComponent from './components/MapComponent';
import ChatInterface from './components/ChatInterface';
import { GlobeIcon } from './components/icons';

const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: 'initial-message',
      role: 'model',
      text: "Hello! I'm Geo-Chat AI. I can answer questions about your surroundings using real-time map and search data. To get started, please allow location access. What would you like to know?",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Unable to retrieve your location. Please grant permission and refresh. Some features may be limited.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: inputText,
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await getChatResponse(inputText, userLocation);
      const modelMessage: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: response.text,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: "Sorry, I encountered an error trying to get a response. Please try again.",
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, userLocation]);

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans text-gray-800 dark:text-gray-200">
      <header className="absolute top-0 left-0 w-full bg-transparent p-4 z-20 flex items-center">
        <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-xl shadow-md">
          <GlobeIcon className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Geo-Chat AI</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your map-aware assistant</p>
          </div>
        </div>
      </header>
      
      <div className="w-full md:w-1/3 h-1/3 md:h-full relative">
        <MapComponent location={userLocation} error={locationError} />
      </div>
      
      <div className="w-full md:w-2/3 h-2/3 md:h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg">
        <ChatInterface
          messages={chatHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default App;

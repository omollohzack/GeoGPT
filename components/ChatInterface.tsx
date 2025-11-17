
import React, { useState, useRef, useEffect } from 'react';
import type { Message, GroundingChunk } from '../types';
import { UserIcon, BotIcon, SendIcon, LinkIcon, MapPinIcon, StarIcon } from './icons';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about places near you..."
            className="flex-1 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-blue-500 text-white rounded-full disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            <SendIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'justify-end'}`}>
      {isModel && <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"><BotIcon className="h-6 w-6 text-gray-500" /></div>}
      <div className={`flex flex-col ${isModel ? 'items-start' : 'items-end'}`}>
        <div className={`max-w-xl p-4 rounded-2xl ${isModel ? 'bg-gray-100 dark:bg-gray-700 rounded-tl-none' : 'bg-blue-500 text-white rounded-br-none'}`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        {message.groundingChunks && message.groundingChunks.length > 0 && (
          <GroundingSources chunks={message.groundingChunks} />
        )}
      </div>
      {!isModel && <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"><UserIcon className="h-6 w-6 text-blue-500" /></div>}
    </div>
  );
};

const GroundingSources: React.FC<{ chunks: GroundingChunk[] }> = ({ chunks }) => (
  <div className="mt-3 max-w-xl">
    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Sources:</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {chunks.map((chunk, index) => {
        if (chunk.web) {
          return <WebSource key={index} title={chunk.web.title} uri={chunk.web.uri} />;
        }
        if (chunk.maps) {
          return <MapSource key={index} title={chunk.maps.title} uri={chunk.maps.uri} reviewSnippets={chunk.maps.placeAnswerSources?.flatMap(s => s.reviewSnippets) || []} />;
        }
        return null;
      })}
    </div>
  </div>
);

const WebSource: React.FC<{ title: string; uri: string }> = ({ title, uri }) => (
  <a href={uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
    <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
    <span className="text-xs text-gray-600 dark:text-gray-300 truncate" title={title}>{title}</span>
  </a>
);

const MapSource: React.FC<{ title: string; uri: string; reviewSnippets: { uri: string; text: string }[] }> = ({ title, uri, reviewSnippets }) => (
  <div className="flex flex-col gap-2">
    <a href={uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/50 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors">
      <MapPinIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
      <span className="text-xs text-green-700 dark:text-green-300 truncate font-semibold" title={title}>{title}</span>
    </a>
    {reviewSnippets.map((review, i) => (
      <a key={i} href={review.uri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 p-2 ml-4 border-l-2 border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/50 rounded-r-lg hover:bg-yellow-100 dark:hover:bg-yellow-800/50 transition-colors">
        <StarIcon className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-800 dark:text-yellow-200 italic">"{review.text}"</p>
      </a>
    ))}
  </div>
);

const LoadingIndicator = () => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"><BotIcon className="h-6 w-6 text-gray-500" /></div>
    <div className="max-w-xl p-4 rounded-2xl rounded-tl-none bg-gray-100 dark:bg-gray-700">
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);

export default ChatInterface;

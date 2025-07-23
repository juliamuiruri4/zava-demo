'use client';

import React from 'react';
import { useChat } from '../../contexts/ChatContext';

export default function ChatHeader() {
  const { chatState, minimizeChat, maximizeChat, closeChat } = useChat();

  return (
    <div className="bg-teal-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <div>
          <h3 className="font-semibold text-sm">AI Assistant</h3>
          <p className="text-xs text-teal-100">
            {chatState.isTyping ? 'AI is typing...' : 'Online'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {chatState.isMinimized ? (
          <button
            onClick={maximizeChat}
            className="p-1 hover:bg-teal-700 rounded transition-colors duration-200"
            aria-label="Maximize chat"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 17L17 7M17 7H7M17 7V17"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={minimizeChat}
            className="p-1 hover:bg-teal-700 rounded transition-colors duration-200"
            aria-label="Minimize chat"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
        )}
        
        <button
          onClick={closeChat}
          className="p-1 hover:bg-teal-700 rounded transition-colors duration-200"
          aria-label="Close chat"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
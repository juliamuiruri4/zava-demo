'use client';

import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatWidget() {
  const { chatState } = useChat();

  if (!chatState.isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        chatState.isMinimized
          ? 'w-80 h-14'
          : 'w-96 h-[600px] max-h-[80vh]'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        <ChatHeader />
        {!chatState.isMinimized && (
          <>
            <ChatMessages />
            <ChatInput />
          </>
        )}
      </div>
    </div>
  );
}
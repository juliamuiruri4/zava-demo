'use client';

import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { Message, ChatState, ChatContextType, Attachment } from '../types/chat';

const RATE_LIMIT_MS = 1000;

export class RateLimitError extends Error {
  constructor() {
    super('Please wait a moment before sending another message.');
    this.name = 'RateLimitError';
  }
}

const initialState: ChatState = {
  messages: [],
  isOpen: false,
  isMinimized: false,
  isTyping: false,
  error: null,
};

type ChatAction =
  | { type: 'TOGGLE_CHAT' }
  | { type: 'MINIMIZE_CHAT' }
  | { type: 'MAXIMIZE_CHAT' }
  | { type: 'CLOSE_CHAT' }
  | { type: 'SEND_MESSAGE_START'; payload: { message: Message } }
  | { type: 'SEND_MESSAGE_SUCCESS'; payload: { messageId: string } }
  | { type: 'SEND_MESSAGE_ERROR'; payload: { messageId: string; error: string } }
  | { type: 'RECEIVE_MESSAGE'; payload: { message: Message } }
  | { type: 'SET_TYPING'; payload: { isTyping: boolean } }
  | { type: 'CLEAR_ERROR' };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen, isMinimized: false };
    case 'MINIMIZE_CHAT':
      return { ...state, isMinimized: true };
    case 'MAXIMIZE_CHAT':
      return { ...state, isMinimized: false };
    case 'CLOSE_CHAT':
      return { ...state, isOpen: false, isMinimized: false };
    case 'SEND_MESSAGE_START':
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
        error: null,
      };
    case 'SEND_MESSAGE_SUCCESS':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.messageId
            ? { ...msg, status: 'delivered' as const }
            : msg
        ),
      };
    case 'SEND_MESSAGE_ERROR':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.messageId
            ? { ...msg, status: 'error' as const }
            : msg
        ),
        error: action.payload.error,
      };
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
        isTyping: false,
      };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload.isTyping };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatState, dispatch] = useReducer(chatReducer, initialState);
  const lastSentAtRef = useRef<number>(0);

  const sendMessage = useCallback(async (content: string, attachments?: Attachment[]) => {
    const now = Date.now();
    if (now - lastSentAtRef.current < RATE_LIMIT_MS) {
      throw new RateLimitError();
    }
    lastSentAtRef.current = now;

    const userMessage: Message = {
      id: now.toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      attachments,
    };

    dispatch({ type: 'SEND_MESSAGE_START', payload: { message: userMessage } });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'SEND_MESSAGE_SUCCESS', payload: { messageId: userMessage.id } });
      
      // Simulate AI typing
      dispatch({ type: 'SET_TYPING', payload: { isTyping: true } });
      
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: 'ai',
        timestamp: new Date(),
        status: 'delivered',
      };

      dispatch({ type: 'RECEIVE_MESSAGE', payload: { message: aiMessage } });
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch({
        type: 'SEND_MESSAGE_ERROR',
        payload: {
          messageId: userMessage.id,
          error: 'Failed to send message. Please try again.',
        },
      });
    }
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  const minimizeChat = useCallback(() => {
    dispatch({ type: 'MINIMIZE_CHAT' });
  }, []);

  const maximizeChat = useCallback(() => {
    dispatch({ type: 'MAXIMIZE_CHAT' });
  }, []);

  const closeChat = useCallback(() => {
    dispatch({ type: 'CLOSE_CHAT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: ChatContextType = {
    chatState,
    sendMessage,
    toggleChat,
    minimizeChat,
    maximizeChat,
    closeChat,
    clearError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

// Mock AI response generator
function generateAIResponse(userMessage: string): string {
  const responses = [
    `I'd be happy to help you with that! What specific information are you looking for?`,
    `That's a great question! Based on your needs, I recommend checking out our featured products section.`,
    `I understand you're looking for home improvement solutions. Can you tell me more about your project?`,
    `Our AI assistants are here to help! Let me find the best options for you.`,
    `Thank you for your question! I can definitely help you find the right products for your home improvement project.`,
    `I see you're interested in our services. What type of room or area are you working on?`,
    `That's an excellent choice! Our store offers high-quality products for all your home improvement needs.`,
  ];
  
  // Add some context-based responses
  if (userMessage.toLowerCase().includes('image') || userMessage.toLowerCase().includes('picture')) {
    return `I can see you've shared an image! That's really helpful for understanding your project better. Based on what I can see, I'd recommend exploring our related product categories.`;
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
}
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'error';
}

export interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isMinimized: boolean;
  isTyping: boolean;
  error: string | null;
}

export interface ChatContextType {
  chatState: ChatState;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  closeChat: () => void;
  clearError: () => void;
}
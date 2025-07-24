export interface Attachment {
  id: string;
  file: File;
  url: string;
  type: 'image';
  name: string;
  size: number;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'error';
  attachments?: Attachment[];
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
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  toggleChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  closeChat: () => void;
  clearError: () => void;
}
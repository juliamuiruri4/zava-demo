'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, RateLimitError } from '../../contexts/ChatContext';
import { Attachment } from '../../types/chat';

const RATE_LIMIT_DISPLAY_MS = 2000;

export default function ChatInput() {
  const { sendMessage, clearError } = useChat();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rateLimitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup rate-limit timer on unmount
  useEffect(() => {
    return () => {
      if (rateLimitTimerRef.current !== null) {
        clearTimeout(rateLimitTimerRef.current);
      }
    };
  }, []);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Cleanup attachment URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        URL.revokeObjectURL(attachment.url);
      });
    };
  }, [attachments]);

  // File handling functions
  const validateImageFile = (file: File): string | null => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Only PNG, JPG, and JPEG images are allowed.';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB.';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateImageFile(file);
    
    if (error) {
      alert(error);
      return;
    }

    const attachment: Attachment = {
      id: Date.now().toString(),
      file,
      url: URL.createObjectURL(file),
      type: 'image',
      name: file.name,
      size: file.size,
    };

    setAttachments(prev => [...prev, attachment]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === attachmentId);
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter(a => a.id !== attachmentId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if ((!trimmedMessage && attachments.length === 0) || isLoading) return;

    setIsLoading(true);
    const messageToSend = trimmedMessage;
    const attachmentsToSend = [...attachments];
    
    setMessage('');
    setAttachments([]);
    clearError();

    try {
      await sendMessage(messageToSend, attachmentsToSend.length > 0 ? attachmentsToSend : undefined);
    } catch (error) {
      if (error instanceof RateLimitError) {
        // Restore the message so the user doesn't lose their input
        setMessage(messageToSend);
        setAttachments(attachmentsToSend);
        setRateLimitMsg(error.message);
        if (rateLimitTimerRef.current !== null) {
          clearTimeout(rateLimitTimerRef.current);
        }
        rateLimitTimerRef.current = setTimeout(() => setRateLimitMsg(null), RATE_LIMIT_DISPLAY_MS);
      } else {
        console.error('Failed to send message:', error);
      }
    } finally {
      setIsLoading(false);
    }

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative group">
              <img
                src={attachment.url}
                alt={attachment.name}
                className="h-16 w-16 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeAttachment(attachment.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                aria-label={`Remove ${attachment.name}`}
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                {attachment.name}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full px-4 py-3 border border-gray-400 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-600 bg-white transition-all duration-200"
            style={{
              minHeight: '44px',
              maxHeight: '120px',
            }}
            disabled={isLoading}
            aria-label="Type your message"
          />
        </div>
        
        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-3 rounded-full transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Attach image"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>
        
        <button
          type="submit"
          disabled={(!message.trim() && attachments.length === 0) || isLoading}
          className={`p-3 rounded-full transition-all duration-200 ${
            (message.trim() || attachments.length > 0) && !isLoading
              ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </form>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select image file"
      />
      
      <div className="mt-2 text-xs text-center">
        {rateLimitMsg ? (
          <span className="text-red-500">{rateLimitMsg}</span>
        ) : (
          <span className="text-gray-600">Press Enter to send, Shift+Enter for new line</span>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

interface ChatMessageProps {
  message: MessageType;
  isLatest: boolean;
}

export const ChatMessage = ({ message, isLatest }: ChatMessageProps) => {
  const [visible, setVisible] = useState(false);
  const isUser = message.sender === 'user';
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Format time to be displayed
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(message.timestamp);

  return (
    <div
      className={cn(
        'flex mb-4 transition-opacity duration-300 ease-in-out',
        isUser ? 'justify-end' : 'justify-start',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div
        className={cn(
          'chat-message-container animate-fade-in relative', 
          isUser 
            ? 'bg-chat-user text-white' 
            : 'bg-chat-bot border border-border'
        )}
      >
        <div className="mb-1">
          {message.text}
        </div>
        <div className={cn(
          "text-xs mt-1 opacity-60 text-right",
          isUser ? "text-white/80" : "text-foreground/60"
        )}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="chat-message-container bg-chat-bot border border-border">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

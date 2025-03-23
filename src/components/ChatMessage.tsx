
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date | string;
};

interface ChatMessageProps {
  message: MessageType;
  isLatest: boolean;
}

export const ChatMessage = ({ message, isLatest }: ChatMessageProps) => {
  const [visible, setVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const isUser = message.sender === 'user';
  
  // Animation effect for message entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Streaming text effect for bot messages
  useEffect(() => {
    // Only apply streaming effect to bot messages and the latest message
    if (message.sender === 'bot' && isLatest && message.text) {
      setIsTyping(true);
      setDisplayedText('');
      
      const text = message.text;
      let currentIndex = 0;
      
      // Random typing speed between 20-60ms for natural feel
      const timer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(prev => prev + text[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, Math.random() * 40 + 20);
      
      return () => clearInterval(timer);
    } else {
      // For user messages or old bot messages, show full text immediately
      setDisplayedText(message.text);
    }
  }, [message.text, message.sender, isLatest]);

  // Format time to be displayed - handle both Date objects and string timestamps
  const getFormattedTime = () => {
    try {
      // Convert string timestamp to Date if necessary
      const dateObject = message.timestamp instanceof Date ? 
        message.timestamp : 
        new Date(message.timestamp);
      
      // Check if the date is valid
      if (isNaN(dateObject.getTime())) {
        return 'Just now'; // Fallback for invalid dates
      }

      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(dateObject);
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Just now'; // Fallback for any errors
    }
  };

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
          {isUser ? message.text : displayedText}
          {isTyping && !isUser && <span className="cursor blink">|</span>}
        </div>
        <div className={cn(
          "text-xs mt-1 opacity-60 text-right",
          isUser ? "text-white/80" : "text-foreground/60"
        )}>
          {getFormattedTime()}
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

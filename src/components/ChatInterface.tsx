
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChatInput } from './ChatInput';
import { ChatMessage, TypingIndicator, type MessageType } from './ChatMessage';
import { useToast } from '@/components/ui/use-toast';

// Sample responses for the chatbot - in a real app, this would be replaced with an actual API call
const sampleResponses = [
  "I'm here to help answer your questions. What would you like to know?",
  "That's an interesting question. Let me think about that for a moment...",
  "I understand what you're asking. Here's what I can tell you about that.",
  "Thanks for sharing that with me. Is there anything specific you'd like to discuss?",
  "I appreciate your question. Based on what I know, here's my response.",
  "That's a great point! I'd like to add a few thoughts on this topic.",
  "I'm not entirely sure about that, but here's what I can tell you based on my knowledge.",
  "Excellent question! Let me provide you with some information on that.",
  "I see what you're asking. Let me break this down for you in simple terms."
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simulate sending a message to the AI and getting a response
  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Get random response from sample responses
      const randomIndex = Math.floor(Math.random() * sampleResponses.length);
      const botResponse = sampleResponses[randomIndex];
      
      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Show toast when new message arrives (optional)
      toast({
        title: "New message",
        description: "AI assistant has responded to your query",
        duration: 2000,
      });
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  return (
    <div className="flex flex-col w-full h-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="glass-effect border-b p-4 rounded-t-xl">
        <h1 className="text-xl font-semibold text-center">AI Assistant</h1>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-slim">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isLatest={index === messages.length - 1}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          {/* This div is used to scroll to the bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isTyping} 
        />
      </div>
    </div>
  );
};

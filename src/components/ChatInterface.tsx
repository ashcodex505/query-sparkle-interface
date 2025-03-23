import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChatInput } from './ChatInput';
import { ChatMessage, TypingIndicator, type MessageType } from './ChatMessage';
import { useToast } from '@/components/ui/use-toast';
import { sendChatMessage } from '@/services/apiService';

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
  const [error, setError] = useState<string | null>(null);
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

  // Send a message to the AWS API Gateway and handle the response
  const handleSendMessage = async (text: string) => {
    // Reset any previous errors
    setError(null);
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Call the AWS API Gateway with the structured request format
      const response = await sendChatMessage(text);
      console.log(response);
      // Create bot message from API response
      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date() // Use current date as fallback
      };
      
      // Try to use the timestamp from response if it exists and is valid
      try {
        if (response.timestamp) {
          const responseDate = new Date(response.timestamp);
          // Check if valid date
          if (!isNaN(responseDate.getTime())) {
            botMessage.timestamp = responseDate;
          }
        }
      } catch (err) {
        console.error('Error parsing timestamp from response:', err);
        // Keep the fallback timestamp
      }
      
      // Hide typing indicator and add bot message
      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
      
      // Show toast notification
      toast({
        title: "New message",
        description: "AI assistant has responded to your query",
        duration: 2000,
      });
    } catch (err) {
      // Handle errors
      setIsTyping(false);
      setError("Sorry, I couldn't process your request. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to get a response from the assistant",
        variant: "destructive",
        duration: 3000,
      });
      
      console.error('Error in handleSendMessage:', err);
    }
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
          
          {error && (
            <div className="p-3 mb-2 text-red-500 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          
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

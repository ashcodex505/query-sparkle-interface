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

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (text: string) => {
    setError(null);
    
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setIsTyping(true);
    
    try {
      const response = await sendChatMessage(text);
      console.log(response);
      
      let messageText = "No response received";
      
      try {
        if (response.body) {
          const bodyContent = typeof response.body === 'string' 
            ? JSON.parse(response.body) 
            : response.body;
            
          messageText = bodyContent.response || "No message in response";
        }
      } catch (parseError) {
        console.error('Error parsing response body:', parseError);
        messageText = "Error parsing response";
      }
      
      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: messageText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      try {
        if (response.timestamp) {
          const responseDate = new Date(response.timestamp);
          if (!isNaN(responseDate.getTime())) {
            botMessage.timestamp = responseDate;
          }
        }
      } catch (err) {
        console.error('Error parsing timestamp from response:', err);
      }
      
      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
      
      toast({
        title: "New message",
        description: "AI assistant has responded to your query",
        duration: 2000,
      });
    } catch (err) {
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
      <div className="glass-effect border-b p-4 rounded-t-xl">
        <h1 className="text-xl font-semibold text-center">AI Assistant</h1>
      </div>
      
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
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isTyping} 
        />
      </div>
    </div>
  );
};

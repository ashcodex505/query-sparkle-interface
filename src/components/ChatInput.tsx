
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PaperPlaneIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus on the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === '' || isLoading) return;
    
    onSendMessage(message);
    setMessage('');
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);
    
    // Reset height to auto
    textarea.style.height = 'auto';
    
    // Set new height based on scroll height, with a max height
    const newHeight = Math.min(textarea.scrollHeight, 150);
    textarea.style.height = `${newHeight}px`;
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="glass-effect border rounded-xl p-3 shadow-sm transition-all duration-300"
    >
      <div className="flex items-end">
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={cn(
            "flex-1 resize-none bg-transparent border-0 focus:ring-0 p-2",
            "focus:outline-none max-h-[150px] min-h-[40px]",
            "placeholder:text-muted-foreground/60"
          )}
          disabled={isLoading}
          rows={1}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={message.trim() === '' || isLoading}
          className={cn(
            "ml-2 rounded-full h-10 w-10 transition-all duration-300",
            message.trim() === '' ? "opacity-70" : "opacity-100"
          )}
        >
          <PaperPlaneIcon className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

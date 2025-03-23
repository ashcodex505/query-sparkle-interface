
import { ChatInterface } from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
      <div className="w-full max-w-4xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border h-[80vh] flex flex-col">
        <ChatInterface />
      </div>
      
      <footer className="mt-6 text-sm text-muted-foreground text-center">
        <p>Designed with simplicity and convenience.</p>
      </footer>
    </div>
  );
};

export default Index;

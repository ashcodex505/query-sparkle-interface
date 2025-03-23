
import { ChatInterface } from '@/components/ChatInterface';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 dark:from-gray-950 dark:to-gray-900 p-4 transition-colors duration-200">
        <div className="w-full max-w-4xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border dark:border-gray-800 h-[80vh] flex flex-col">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <ChatInterface />
        </div>
        
        <footer className="mt-6 text-sm text-muted-foreground text-center">
          <p>Designed with simplicity and convenience.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;

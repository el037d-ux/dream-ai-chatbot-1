import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StarsBackground from '@/components/StarsBackground';
import Navigation from '@/components/Navigation';
import ChatPage from '@/pages/ChatPage';
import HistoryPage from '@/pages/HistoryPage';
import DictionaryPage from '@/pages/DictionaryPage';
import ProfilePage from '@/pages/ProfilePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

const queryClient = new QueryClient();

function AppContent() {
  const [page, setPage] = useState('chat');

  const renderPage = () => {
    switch (page) {
      case 'chat': return <ChatPage />;
      case 'history': return <HistoryPage />;
      case 'dictionary': return <DictionaryPage />;
      case 'profile': return <ProfilePage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      default: return <ChatPage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <StarsBackground />
      <div className="relative z-10">
        <Navigation active={page} onNavigate={setPage} />
        {renderPage()}
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

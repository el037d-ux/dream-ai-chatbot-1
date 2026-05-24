import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from '@/context/AuthContext';
import StarsBackground from '@/components/StarsBackground';
import Navigation from '@/components/Navigation';
import ChatWidget from '@/components/ChatWidget';
import ChatPage from '@/pages/ChatPage';
import HistoryPage from '@/pages/HistoryPage';
import DictionaryPage from '@/pages/DictionaryPage';
import ProfilePage from '@/pages/ProfilePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import SubscribePage from '@/pages/SubscribePage';

const queryClient = new QueryClient();

function AppContent() {
  const [page, setPage] = useState('chat');
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-5xl animate-float">🌙</div>
    </div>
  );

  const renderPage = () => {
    switch (page) {
      case 'chat': return <ChatPage onSubscribe={() => setPage('subscribe')} />;
      case 'history': return <HistoryPage />;
      case 'dictionary': return <DictionaryPage />;
      case 'profile': return <ProfilePage onNavigate={setPage} />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'subscribe': return <SubscribePage onBack={() => setPage('chat')} />;
      default: return <ChatPage onSubscribe={() => setPage('subscribe')} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <StarsBackground />
      <div className="relative z-10">
        <Navigation active={page} onNavigate={setPage} />
        <div className="pb-0 md:pb-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0px)' }}>
          {renderPage()}
        </div>
        <div className="hidden md:block">
          <ChatWidget />
        </div>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
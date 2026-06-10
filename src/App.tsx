import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from '@/context/AuthContext';
import StarsBackground from '@/components/StarsBackground';
import Navigation from '@/components/Navigation';
import ChatPage from '@/pages/ChatPage';
import HistoryPage from '@/pages/HistoryPage';
import DictionaryPage from '@/pages/DictionaryPage';
import ProfilePage from '@/pages/ProfilePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import SubscribePage from '@/pages/SubscribePage';
import PrivacyPage from '@/pages/PrivacyPage';

const API_URL = 'https://functions.poehali.dev/5f709de2-ccfd-4b79-9f7c-cb0a8c2e4f09';

const queryClient = new QueryClient();

function AppContent() {
  const [page, setPage] = useState('chat');
  const { user, loading, updateUsage } = useAuth();
  const [paymentMsg, setPaymentMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === '1' && user) {
      window.history.replaceState({}, '', window.location.pathname);
      setPaymentMsg('Проверяем платёж...');
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_payment', user_id: user.user_id }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.status === 'succeeded') {
            updateUsage(user.free_requests_used, true);
            setPaymentMsg('✦ Подписка активирована! Добро пожаловать в мир снов без границ.');
          } else {
            setPaymentMsg('Платёж обрабатывается. Если подписка не появилась — нажмите «Обновить статус» в профиле.');
          }
          setTimeout(() => setPaymentMsg(''), 7000);
        })
        .catch(() => setPaymentMsg(''));
    }
  }, [user]);

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
      case 'contact': return <ContactPage onNavigate={setPage} />;
      case 'subscribe': return <SubscribePage onBack={() => setPage('chat')} />;
      case 'privacy': return <PrivacyPage />;
      default: return <ChatPage onSubscribe={() => setPage('subscribe')} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <StarsBackground />
      <div className="relative z-10">
        {paymentMsg && (
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl border text-sm font-raleway text-center shadow-lg max-w-sm w-[90%] transition-all
            ${paymentMsg.includes('✦') ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-muted border-border text-foreground'}`}>
            {paymentMsg}
          </div>
        )}
        <Navigation active={page} onNavigate={setPage} />
        <div className="pb-0 md:pb-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0px)' }}>
          {renderPage()}
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
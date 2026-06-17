import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';
import SubscribeBanner from '@/components/SubscribeBanner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const API_URL = 'https://functions.poehali.dev/5f709de2-ccfd-4b79-9f7c-cb0a8c2e4f09';
const FREE_LIMIT = 3;

const GREETINGS = [
  'Опишите свой сон как можно подробнее — каждая деталь важна...',
  'Расскажите, что вы видели: образы, чувства, цвета — всё имеет значение...',
  'Ваш сон ждёт толкования. Поделитесь им, и звёзды откроют его тайный смысл...',
];

interface ChatPageProps {
  onSubscribe: () => void;
}

export default function ChatPage({ onSubscribe }: ChatPageProps) {
  const { user, updateUsage, canSendRequest, requestsLeft } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: '🌙 Я — Морфей, хранитель врат между мирами. Ваши сны — послания из глубин бессознательного.\n\nОпишите свой сон, и я раскрою его истинный смысл через призму психологии Юнга и Фрейда.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [placeholder] = useState(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [guestUsed, setGuestUsed] = useState(() =>
    parseInt(localStorage.getItem('morpheus_guest_used') || '0', 10)
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getLeft = () => {
    if (user) return requestsLeft();
    return Math.max(0, FREE_LIMIT - guestUsed);
  };

  const isBlocked = () => {
    if (user) return !canSendRequest();
    return false;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (isBlocked()) { onSubscribe(); return; }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const apiMessages = updatedMessages
        .filter(m => m.id !== '0')
        .map(m => ({ role: m.role, content: m.content }));

      const body: Record<string, unknown> = { action: 'analyze', messages: apiMessages };
      if (user) body.user_id = user.user_id;

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 403 && data.error === 'limit_reached') {
        onSubscribe(); return;
      }
      if (!res.ok || !data.answer) throw new Error('Нет ответа');

      if (user && data.free_used !== undefined) {
        updateUsage(data.free_used, data.has_sub ?? user.has_subscription);
      } else if (!user) {
        const newUsed = guestUsed + 1;
        setGuestUsed(newUsed);
        localStorage.setItem('morpheus_guest_used', String(newUsed));
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      }]);
    } catch {
      setError('Звёзды временно молчат... Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatContent = (text: string) =>
    text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className={i > 0 ? 'mt-2' : ''} dangerouslySetInnerHTML={{ __html: bold }} />;
    });

  const left = getLeft();
  const blocked = isBlocked();

  return (
    <div className="flex flex-col md:pt-20" style={{ height: '100dvh', paddingTop: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>

      {/* История сообщений */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4" style={{ paddingBottom: 'calc(130px + env(safe-area-inset-bottom))' }}>
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          {messages.slice(1).map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex gap-2 md:gap-4 animate-message ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-base md:text-lg
                ${msg.role === 'assistant' ? 'bg-primary/20 border border-primary/40 animate-glow' : 'bg-mystic-gold/20 border border-mystic-gold/40'}`}>
                {msg.role === 'assistant' ? '🌙' : '✨'}
              </div>
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 md:px-5 py-3 md:py-4 text-sm leading-relaxed font-raleway
                ${msg.role === 'assistant' ? 'glass border border-primary/20 text-foreground' : 'bg-primary/20 border border-primary/30 text-foreground rounded-tr-sm'}`}>
                <div className="text-foreground/90">{formatContent(msg.content)}</div>
                <div className="text-xs text-muted-foreground mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 animate-message">
              <div className="w-10 h-10 rounded-full flex-shrink-0 bg-primary/20 border border-primary/40 animate-glow flex items-center justify-center text-lg">🌙</div>
              <div className="glass border border-primary/20 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm font-raleway italic">Морфей читает знаки...</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"
                        style={{ animation: `twinkle 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && <div className="text-center text-sm text-muted-foreground font-raleway italic">{error}</div>}
          <div ref={bottomRef} />
        </div>
      </div>

      <SubscribeBanner requestsLeft={left} onSubscribe={onSubscribe} isBlocked={blocked} />

      {/* Поле ввода */}
      <div
        className="glass-strong border-t border-border/30 px-3 md:px-4 py-3
          fixed md:relative bottom-[56px] md:bottom-auto left-0 right-0 z-40 md:z-auto"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-3xl mx-auto">
          {!blocked && user && !user.has_subscription && (
            <div className="flex justify-end mb-1.5">
              <span className="text-xs text-muted-foreground font-raleway">
                Бесплатных: <span className="text-primary font-medium">{left}</span> из {FREE_LIMIT}
              </span>
            </div>
          )}
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={blocked ? 'Оформите подписку...' : placeholder}
              disabled={blocked}
              rows={2}
              className="flex-1 bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-raleway disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={blocked ? onSubscribe : handleSend}
              disabled={!blocked && (!input.trim() || isLoading)}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center animate-glow"
            >
              {isLoading
                ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                : <Icon name={blocked ? 'Lock' : 'Send'} size={17} className="text-primary-foreground" />
              }
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
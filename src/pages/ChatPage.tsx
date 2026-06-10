import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SubscribeBanner from '@/components/SubscribeBanner';
import MysticWidgets from '@/components/MysticWidgets';



interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FREE_LIMIT = 3;


interface ChatPageProps {
  onSubscribe: () => void;
}

export default function ChatPage({ onSubscribe }: ChatPageProps) {
  const { user, canSendRequest, requestsLeft } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: '🌙 Я — Морфей, хранитель врат между мирами. Ваши сны — послания из глубин бессознательного.\n\nОпишите свой сон, и я раскрою его истинный смысл через призму психологии Юнга и Фрейда.',
      timestamp: new Date(),
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [guestUsed] = useState(() =>
    parseInt(localStorage.getItem('morpheus_guest_used') || '0', 10)
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getLeft = () => {
    if (user) return requestsLeft();
    return Math.max(0, FREE_LIMIT - guestUsed);
  };

  const isBlocked = () => {
    if (user) return !canSendRequest();
    return false;
  };

  const formatContent = (text: string) =>
    text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className={i > 0 ? 'mt-2' : ''} dangerouslySetInnerHTML={{ __html: bold }} />;
    });

  const left = getLeft();
  const blocked = isBlocked();

  return (
    <div className="flex flex-col pt-14 md:pt-20" style={{ height: '100dvh' }}>

      {/* Двухколоночный лейаут: слева — приветствие, справа — виджеты */}
      <div className="w-full max-w-6xl mx-auto px-3 md:px-4 pt-3 pb-1 flex flex-col md:flex-row gap-3 items-start">

        {/* Левая колонка — обращение Морфея */}
        <div className="w-full md:w-[340px] md:flex-shrink-0">
          <div className="glass border border-primary/20 rounded-2xl px-5 py-4 text-sm leading-relaxed font-raleway flex gap-3 items-start h-full">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-base bg-primary/20 border border-primary/40 animate-glow">🌙</div>
            <div className="text-foreground/90 text-sm font-raleway leading-relaxed">
              {messages[0]?.content.split('\n\n').map((p, i) => <p key={i} className={i > 0 ? 'mt-2' : ''}>{p}</p>)}
            </div>
          </div>
        </div>

        {/* Правая колонка — виджеты */}
        <div className="w-full md:flex-1 min-w-0">
          <MysticWidgets />
        </div>

      </div>


      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-4 pb-[140px] md:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.slice(1).map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex gap-4 animate-message ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg
                ${msg.role === 'assistant' ? 'bg-primary/20 border border-primary/40 animate-glow' : 'bg-mystic-gold/20 border border-mystic-gold/40'}`}>
                {msg.role === 'assistant' ? '🌙' : '✨'}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed font-raleway
                ${msg.role === 'assistant' ? 'glass border border-primary/20 text-foreground' : 'bg-primary/20 border border-primary/30 text-foreground rounded-tr-sm'}`}>
                <div className="text-foreground/90">{formatContent(msg.content)}</div>
                <div className="text-xs text-muted-foreground mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}


          <div ref={bottomRef} />
        </div>
      </div>

      <SubscribeBanner requestsLeft={left} onSubscribe={onSubscribe} isBlocked={blocked} />


    </div>
  );
}
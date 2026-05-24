import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const API_URL = 'https://functions.poehali.dev/5f709de2-ccfd-4b79-9f7c-cb0a8c2e4f09';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: '🌙 Я — Морфей. Опишите свой сон, и я раскрою его тайный смысл.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setPulse(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const apiMessages = updatedMessages
        .filter(m => m.id !== '0')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', messages: apiMessages }),
      });

      const data = await res.json();
      if (!res.ok || !data.answer) throw new Error('Нет ответа');

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
      }]);
    } catch {
      setError('Звёзды молчат... Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className={i > 0 ? 'mt-1.5' : ''} dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="glass-strong border border-primary/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
          style={{
            width: 340,
            height: 480,
            boxShadow: '0 0 60px hsl(270 60% 30% / 0.4), 0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-primary/5">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-base animate-glow">
              🌙
            </div>
            <div className="flex-1">
              <div className="font-cormorant text-base font-semibold text-foreground leading-none">Морфей</div>
              <div className="text-xs text-primary/70 font-raleway">Толкователь снов · ИИ</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              <Icon name="X" size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm
                  ${msg.role === 'assistant' ? 'bg-primary/20 border border-primary/30' : 'bg-mystic-gold/20 border border-mystic-gold/30'}`}
                >
                  {msg.role === 'assistant' ? '🌙' : '✨'}
                </div>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed font-raleway
                  ${msg.role === 'assistant'
                    ? 'bg-card/80 border border-primary/15 text-foreground/90'
                    : 'bg-primary/20 border border-primary/25 text-foreground'
                  }`}
                >
                  {formatContent(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full flex-shrink-0 bg-primary/20 border border-primary/30 flex items-center justify-center text-sm animate-glow">
                  🌙
                </div>
                <div className="bg-card/80 border border-primary/15 rounded-xl px-3 py-2.5">
                  <div className="flex gap-1 items-center">
                    <span className="text-xs text-muted-foreground font-raleway italic mr-1">читает знаки</span>
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-primary"
                        style={{ animation: 'twinkle 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center text-xs text-muted-foreground font-raleway italic py-1">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-border/20">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Опишите свой сон..."
                rows={2}
                className="flex-1 bg-input/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/50 transition-all font-raleway"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                <Icon name="Send" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`relative w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 animate-glow ${open ? 'rotate-12' : ''}`}
        style={{ boxShadow: '0 0 30px hsl(270 60% 65% / 0.5), 0 8px 20px rgba(0,0,0,0.4)' }}
      >
        <span className="text-2xl">{open ? '✕' : '🌙'}</span>
        {pulse && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-mystic-gold border-2 border-background animate-ping" />
        )}
        {pulse && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-mystic-gold border-2 border-background" />
        )}
      </button>
    </div>
  );
}
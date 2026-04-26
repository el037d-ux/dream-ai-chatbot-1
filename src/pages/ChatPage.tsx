import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SAMPLE_RESPONSES = [
  `✨ **Архетипический анализ по Юнгу**\n\nВодная стихия в сновидениях — это обращение к коллективному бессознательному. Океан символизирует материнское начало, бесконечность психических глубин и скрытые аспекты Тени.\n\n🔮 **Интерпретация Фрейда**\nПогружение в воду традиционно связывается с возвращением в утробное состояние — желанием укрытия от тревог реальной жизни.\n\n💫 **Предсказание**\nВаш сон говорит о внутренней трансформации. В ближайшие недели вы столкнётесь с необходимостью принять важное решение, которое откроет новый этап вашего пути.`,
  `🌑 **Символика Тени** (Юнг)\n\nТёмная фигура — классическое воплощение архетипа Тени. Это подавленные, непризнанные части вашей личности, требующие интеграции.\n\n⚗️ **Психоаналитический аспект** (Фрейд)\nПреследование означает внутренний конфликт между Эго и подавленными желаниями. Страх — защитный механизм.\n\n✨ **Мистическое послание**\nВселенная призывает вас взглянуть в лицо своим страхам. То, от чего вы убегаете во сне — именно то, что несёт ключ к вашей силе.`,
  `🌙 **Анима/Анимус** (Юнг)\n\nПолёт во снах — проявление архетипа Героя, стремление Эго преодолеть земные ограничения.\n\n🔥 **По Фрейду**\nПолёт связан с либидозной энергией, свободой от социальных табу и ощущением всемогущества.\n\n💜 **Космическое послание**\nВаши амбиции вот-вот найдут реализацию. Звёзды указывают на период творческого подъёма — доверьтесь интуиции.`,
];

const GREETINGS = [
  'Опишите свой сон как можно подробнее — каждая деталь важна для точного анализа...',
  'Расскажите, что вы видели: образы, чувства, цвета — всё имеет значение...',
  'Ваш сон ждёт толкования. Поделитесь им, и звёзды откроют его тайный смысл...',
];

export default function ChatPage() {
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
  const [placeholder] = useState(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 2200));

    const response = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className={`${i > 0 ? 'mt-2' : ''}`} dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  };

  return (
    <div className="flex flex-col h-screen pt-20">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex gap-4 animate-message ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg
                ${msg.role === 'assistant'
                  ? 'bg-primary/20 border border-primary/40 animate-glow'
                  : 'bg-mystic-gold/20 border border-mystic-gold/40'
                }`}
              >
                {msg.role === 'assistant' ? '🌙' : '✨'}
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed font-raleway
                ${msg.role === 'assistant'
                  ? 'glass border border-primary/20 text-foreground'
                  : 'bg-primary/20 border border-primary/30 text-foreground rounded-tr-sm'
                }`}
              >
                <div className="text-foreground/90">{formatContent(msg.content)}</div>
                <div className="text-xs text-muted-foreground mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-4 animate-message">
              <div className="w-10 h-10 rounded-full flex-shrink-0 bg-primary/20 border border-primary/40 animate-glow flex items-center justify-center text-lg">
                🌙
              </div>
              <div className="glass border border-primary/20 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm font-raleway italic">Морфей читает знаки...</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        style={{ animation: `twinkle 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="glass-strong border-t border-border/30 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={2}
                className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-raleway"
              />
              <div className="absolute bottom-2 right-3 text-xs text-muted-foreground/40">Enter для отправки</div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 animate-glow"
            >
              <Icon name="Send" size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground/40 mt-2 font-raleway">
            ✦ Анализ основан на теориях Юнга и Фрейда ✦
          </p>
        </div>
      </div>
    </div>
  );
}

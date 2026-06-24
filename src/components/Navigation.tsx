import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface NavProps {
  active: string;
  onNavigate: (page: string) => void;
}

function getMoonPhase(date: Date) {
  const known = new Date(2000, 0, 6);
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = 29.53058867;
  const day = ((diff % cycle) + cycle) % cycle;
  const illumination = Math.round(50 * (1 - Math.cos((2 * Math.PI * day) / cycle)));
  let name: string, emoji: string;
  if (day < 1.5)       { name = 'Новолуние';          emoji = '🌑'; }
  else if (day < 7.4)  { name = 'Растущий серп';       emoji = '🌒'; }
  else if (day < 9.9)  { name = 'Первая четверть';     emoji = '🌓'; }
  else if (day < 14.8) { name = 'Растущая луна';       emoji = '🌔'; }
  else if (day < 16.3) { name = 'Полнолуние';          emoji = '🌕'; }
  else if (day < 21.2) { name = 'Убывающая луна';      emoji = '🌖'; }
  else if (day < 23.7) { name = 'Последняя четверть';  emoji = '🌗'; }
  else if (day < 28.0) { name = 'Убывающий серп';      emoji = '🌘'; }
  else                 { name = 'Тёмная луна';          emoji = '🌑'; }
  return { name, emoji, day: Math.round(day) + 1, illumination };
}

const QUOTES = [
  'Сон — это маленькая потайная дверь в самые тайные и сокровенные уголки души',
  'Сны часто бывают наиболее глубокими, когда кажутся самыми безумными',
  'Мы созданы из той же материи, что и сны, и наша маленькая жизнь окружена сном',
  'Сны — это иллюстрации к книге, которую ваша душа пишет о вас',
  'Сны — это пробные камни нашего характера',
  'Тот, кто видит сны, спит с открытыми глазами внутрь себя',
  'Сон — это великий утешитель, он возвращает нам то, что отняла реальность',
  'Луна управляет приливами океана, а во сне — приливами нашей души',
  'Ночь — это время, когда душа снимает маски и говорит правду',
  'Сны — это эхо ушедшего дня, которое становится музыкой ночи',
  'Звёзды не могут направить твою судьбу, но они могут осветить путь во сне',
  'То, что мы видим, когда спим, — это правда, которую мы боимся признать наяву',
  'Вещие сны приходят к тем, кто умеет слушать тишину',
  'Сон — это мост между миром живых и миром духов',
  'Утро вечера мудренее',
  'Что днём с умом скроешь, то ночью во сне откроется',
  'Сон — лучший советчик',
  'Выспался — как заново родился',
  'Каков день, таков и сон',
  'Хороший сон — лучше богатства',
  'Сны не лгут, они лишь говорят на языке символов',
  'Разгадать сон — значит понять себя',
  'Тот, кто не помнит своих снов, живёт лишь наполовину',
  'Ночь даёт нам советы, которых мы не услышим днём',
  'Сны — это послания, которые Вселенная шепчет нам, пока мир спит',
  'Загляни в свои сны, и ты узнаешь, кто ты есть на самом деле',
  'Пусть ваши сны будут светлыми, а пробуждение — радостным и осмысленным',
  'Сны — это письма от нашего подсознания, которые мы получаем каждую ночь',
  'Во сне нет случайностей — каждый образ несёт послание',
  'Сновидения — это мост между реальным и воображаемым мирами',
  'Кто понимает свои сны, тот понимает себя',
  'Жизнь — это сон, а сны — это отражение жизни',
  'Во сне мы путешествуем без тела, а наяву — без души',
  'Сны не врут, в отличие от нас',
  'То, что мы видим во сне, так же реально, как и то, что мы видим наяву',
  'Записывай свои сны — они говорят больше, чем кажется',
  'Сонник не даёт ответов, он задаёт правильные вопросы',
  'Толкование сна начинается с вопроса: что я чувствовал?',
  'Повторяющиеся сны — это уроки, которые мы ещё не усвоили',
  'В каждом сне скрыта мудрость, ждущая своего часа',
  'Сны — это язык, на котором с нами говорит Вселенная',
  'Разгадай свой сон — узнаешь свой путь',
];

const navItems = [
  { id: 'chat', label: 'Предсказание', icon: 'Moon' },
  { id: 'profile', label: 'Кабинет', icon: 'User' },
  { id: 'contact', label: 'Контакты', icon: 'Mail' },
];

const mobileItems = [
  { id: 'chat', label: 'Чат', icon: 'Moon' },
  { id: 'profile', label: 'Кабинет', icon: 'User' },
];

export default function Navigation({ active, onNavigate }: NavProps) {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [installed, setInstalled] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const [quoteVisible, setQuoteVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (!quoteVisible) return;
    const t = setTimeout(() => setQuoteVisible(false), 7000);
    return () => clearTimeout(t);
  }, [quoteVisible, quote]);

  const handleInstall = () => {
    if (!installPrompt) return;
    const prompt = installPrompt as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> };
    prompt.prompt();
    prompt.userChoice.then(() => setInstallPrompt(null));
  };

  const handleQuote = () => {
    const next = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(next);
    setQuoteVisible(true);
  };

  const showInstall = !!installPrompt && !installed;
  const moon = getMoonPhase(new Date());

  return (
    <>
      {/* Desktop top nav */}
      <nav className="glass-strong fixed top-0 left-0 right-0 z-50 px-6 py-3 hidden md:block">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => onNavigate('chat')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center animate-glow group-hover:scale-110 transition-transform">
              <span className="text-lg">🌙</span>
            </div>
            <div>
              <div className="font-cormorant text-xl font-semibold text-foreground leading-none">СонникАИ</div>
              <div className="text-xs text-muted-foreground font-raleway tracking-widest uppercase">Толкователь снов</div>
            </div>
          </button>

          {/* Лунный календарь */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/30 bg-white/5">
            <span className="text-lg leading-none">{moon.emoji}</span>
            <div>
              <div className="text-xs font-raleway text-foreground/80 font-medium leading-none">{moon.name}</div>
              <div className="text-xs text-muted-foreground font-raleway leading-none mt-0.5">{moon.day} день · {moon.illumination}%</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Минутка мудрости */}
            <button
              onClick={handleQuote}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-raleway font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
            >
              <Icon name="Sparkles" fallback="Circle" size={13} />
              Минутка мудрости
            </button>
            {showInstall && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-raleway font-medium border border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-300 mr-2"
              >
                <Icon name="Download" fallback="Circle" size={13} />
                Установить приложение
              </button>
            )}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-item px-3 py-2 rounded-lg text-sm font-raleway font-medium transition-all duration-300 flex items-center gap-1.5
                  ${active === item.id
                    ? 'text-primary bg-primary/10 active'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
              >
                <Icon name={item.icon} fallback="Circle" size={13} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Цитата (десктоп) */}
        {quoteVisible && quote && (
          <div className="max-w-6xl mx-auto mt-2 animate-fade-in-up">
            <div className="glass border border-primary/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-primary text-lg flex-shrink-0">✦</span>
              <p className="font-cormorant text-base text-foreground/90 italic leading-snug">{quote}</p>
              <button onClick={() => setQuoteVisible(false)} className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors ml-auto">
                <Icon name="X" size={14} />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile top bar */}
      <div className="glass-strong fixed top-0 left-0 right-0 z-50 px-4 flex md:hidden flex-col"
        style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top, 0px))', paddingBottom: quoteVisible ? '0.5rem' : '0.75rem' }}
      >
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('chat')} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center animate-glow">
              <span className="text-base">🌙</span>
            </div>
            <div>
              <div className="font-cormorant text-lg font-semibold text-foreground leading-none">СонникАИ</div>
              <div className="text-xs text-muted-foreground font-raleway tracking-wider uppercase" style={{ fontSize: 9 }}>Толкователь снов</div>
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            {/* Минутка мудрости — мобиль */}
            <button
              onClick={handleQuote}
              className="p-2 rounded-xl text-muted-foreground hover:text-primary active:scale-95 transition-all"
              title="Минутка мудрости"
            >
              <Icon name="Sparkles" fallback="Circle" size={18} />
            </button>
            {/* Лунный календарь — мобиль */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border/30 bg-white/5">
              <span className="text-base leading-none">{moon.emoji}</span>
              <div>
                <div className="text-xs font-raleway text-foreground/80 font-medium leading-none" style={{ fontSize: 10 }}>{moon.name}</div>
                <div className="text-muted-foreground font-raleway leading-none mt-0.5" style={{ fontSize: 9 }}>{moon.day} д · {moon.illumination}%</div>
              </div>
            </div>
            {showInstall && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-raleway font-medium border border-primary/40 text-primary bg-primary/10 active:scale-95 transition-all"
              >
                <Icon name="Download" fallback="Circle" size={13} />
                Установить
              </button>
            )}
            <button
              onClick={() => onNavigate('profile')}
              className={`p-2 rounded-xl transition-all ${active === 'profile' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
            >
              <Icon name="User" fallback="Circle" size={20} />
            </button>
          </div>
        </div>

        {/* Цитата (мобиль) */}
        {quoteVisible && quote && (
          <div className="mt-2 animate-fade-in-up">
            <div className="glass border border-primary/20 rounded-xl px-3 py-2.5 flex items-start gap-2">
              <span className="text-primary flex-shrink-0 mt-0.5">✦</span>
              <p className="font-cormorant text-sm text-foreground/90 italic leading-snug flex-1">{quote}</p>
              <button onClick={() => setQuoteVisible(false)} className="flex-shrink-0 text-muted-foreground active:scale-95">
                <Icon name="X" size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass-strong border-t border-border/30 px-2 pt-2 flex items-center justify-around"
          style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {mobileItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all duration-200 min-w-0 min-h-[44px] justify-center
                ${active === item.id ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
                ${active === item.id ? 'bg-primary/15' : ''}`}>
                <Icon name={item.icon} fallback="Circle" size={20} />
              </div>
              <span className="text-[10px] font-raleway leading-none">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

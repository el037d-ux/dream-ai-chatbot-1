import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [theory, setTheory] = useState<'both' | 'jung' | 'freud'>('both');
  const [depth, setDepth] = useState<'basic' | 'deep' | 'esoteric'>('deep');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const fn = mode === 'login' ? login : register;
    const result = await fn(email, password);
    setAuthLoading(false);
    if (result.error) setAuthError(result.error);
  };

  // Не авторизован — форма входа/регистрации
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="text-5xl mb-3 animate-float">🌙</div>
            <h1 className="font-cormorant text-4xl font-light text-foreground mb-1">Личный кабинет</h1>
            <p className="text-muted-foreground font-raleway text-sm">Войдите, чтобы сохранять сны и управлять подпиской</p>
          </div>

          {/* Tabs */}
          <div className="glass border border-border/30 rounded-2xl p-1 flex mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setAuthError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-raleway font-medium transition-all
                  ${mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {m === 'login' ? 'Войти' : 'Регистрация'}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="glass border border-border/30 rounded-2xl p-6 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div>
              <label className="text-xs text-muted-foreground font-raleway uppercase tracking-widest mb-1.5 block">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all font-raleway"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-raleway uppercase tracking-widest mb-1.5 block">Пароль</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Минимум 6 символов" required
                className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all font-raleway"
              />
            </div>
            {authError && (
              <div className="text-sm text-red-400 font-raleway bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{authError}</div>
            )}
            {mode === 'register' && (
              <p className="text-xs text-muted-foreground font-raleway leading-relaxed">
                Нажимая «Создать аккаунт», вы даёте согласие на обработку персональных данных в соответствии с{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="text-primary underline hover:no-underline transition-all"
                >
                  Политикой конфиденциальности
                </button>
              </p>
            )}
            <button
              type="submit" disabled={authLoading}
              className="w-full bg-primary text-primary-foreground font-raleway text-sm py-3 rounded-xl hover:bg-primary/80 disabled:opacity-50 transition-all flex items-center justify-center gap-2 animate-glow"
            >
              {authLoading
                ? <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Подождите...</>
                : <><Icon name={mode === 'login' ? 'LogIn' : 'UserPlus'} size={16} />{mode === 'login' ? 'Войти' : 'Создать аккаунт'}</>
              }
            </button>
          </form>

          <div className="mt-4 glass border border-primary/20 rounded-2xl p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-foreground/80 font-raleway">✨ <strong>3 запроса бесплатно</strong> — без карты</p>
            <p className="text-xs text-muted-foreground font-raleway mt-1">Полный доступ — <strong className="text-primary">119 ₽ / 30 дней</strong></p>
          </div>
        </div>
      </div>
    );
  }

  // Авторизован — полный кабинет
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="font-cormorant text-4xl md:text-5xl font-light text-foreground mb-3">Личный кабинет</h1>
          <div className="mystic-divider my-4" />
        </div>

        {/* Profile card */}
        <div className="glass border border-border/30 rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 animate-glow flex items-center justify-center text-4xl">🌙</div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-mystic-gold border-2 border-background flex items-center justify-center text-xs">✦</div>
            </div>
            <div>
              <h2 className="font-cormorant text-2xl text-foreground">{user.email}</h2>
              <p className="text-sm text-muted-foreground font-raleway">
                {user.has_subscription
                  ? <span className="text-primary">✦ Подписка активна</span>
                  : `Бесплатных запросов: ${Math.max(0, 3 - user.free_requests_used)} из 3`}
              </p>
            </div>
          </div>

          {!user.has_subscription && (
            <div className="mt-4">
              <button
                onClick={() => onNavigate('subscribe')}
                className="w-full bg-primary/10 border border-primary/30 text-primary font-raleway text-sm py-2.5 rounded-xl hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <Icon name="Sparkles" size={14} />
                Оформить подписку — 119 ₽ / 30 дней
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-cormorant text-xl text-foreground mb-4">Теория анализа</h3>
            <div className="grid grid-cols-3 gap-3">
              {[{ id: 'both', label: 'Юнг + Фрейд', emoji: '⚗️' }, { id: 'jung', label: 'Только Юнг', emoji: '🌀' }, { id: 'freud', label: 'Только Фрейд', emoji: '🛋️' }].map(opt => (
                <button key={opt.id} onClick={() => setTheory(opt.id as typeof theory)}
                  className={`p-3 rounded-xl border text-center transition-all font-raleway text-sm
                    ${theory === opt.id ? 'border-primary bg-primary/10 text-primary' : 'border-border/30 text-muted-foreground hover:border-primary/30'}`}>
                  <div className="text-2xl mb-1">{opt.emoji}</div>
                  <div className="text-xs">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-cormorant text-xl text-foreground mb-4">Глубина анализа</h3>
            <div className="space-y-2">
              {[{ id: 'basic', label: 'Базовый', desc: 'Краткое толкование символов', emoji: '🌱' }, { id: 'deep', label: 'Глубокий', desc: 'Психологический анализ + предсказание', emoji: '🌊' }, { id: 'esoteric', label: 'Эзотерический', desc: 'Полный мистический разбор с ритуалами', emoji: '🔮' }].map(opt => (
                <button key={opt.id} onClick={() => setDepth(opt.id as typeof depth)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all
                    ${depth === opt.id ? 'border-primary bg-primary/10' : 'border-border/30 hover:border-primary/30'}`}>
                  <span className="text-xl">{opt.emoji}</span>
                  <div>
                    <div className={`text-sm font-raleway font-medium ${depth === opt.id ? 'text-primary' : 'text-foreground'}`}>{opt.label}</div>
                    <div className="text-xs text-muted-foreground font-raleway">{opt.desc}</div>
                  </div>
                  {depth === opt.id && <Icon name="Check" size={16} className="text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cormorant text-xl text-foreground">Напоминания</h3>
                <p className="text-xs text-muted-foreground font-raleway mt-1">Записывать сны сразу после пробуждения</p>
              </div>
              <button onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${notifications ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <button onClick={logout}
              className="w-full text-center text-sm text-muted-foreground font-raleway hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <Icon name="LogOut" size={16} />
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
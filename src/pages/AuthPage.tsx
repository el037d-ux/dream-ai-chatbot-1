import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onSuccess: () => void;
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fn = mode === 'login' ? login : register;
    const result = await fn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 animate-float">🌙</div>
          <h1 className="font-cormorant text-4xl font-light text-foreground">Морфей</h1>
          <p className="text-muted-foreground font-raleway text-sm mt-1">Толкователь снов</p>
        </div>

        {/* Tabs */}
        <div className="glass border border-border/30 rounded-2xl p-1 flex mb-6">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-raleway font-medium transition-all
                ${mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {m === 'login' ? 'Войти' : 'Регистрация'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass border border-border/30 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-raleway uppercase tracking-widest mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all font-raleway"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-raleway uppercase tracking-widest mb-1.5 block">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              required
              className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all font-raleway"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 font-raleway bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-raleway text-sm py-3 rounded-xl hover:bg-primary/80 disabled:opacity-50 transition-all flex items-center justify-center gap-2 animate-glow"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {mode === 'login' ? 'Вхожу...' : 'Регистрирую...'}
              </>
            ) : (
              <>
                <Icon name={mode === 'login' ? 'LogIn' : 'UserPlus'} size={16} />
                {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
              </>
            )}
          </button>
        </form>

        {/* Free info */}
        <div className="mt-4 glass border border-primary/20 rounded-2xl p-4 text-center">
          <p className="text-sm text-foreground/80 font-raleway">
            ✨ <strong>3 запроса бесплатно</strong> — без карты
          </p>
          <p className="text-xs text-muted-foreground font-raleway mt-1">
            Полный доступ — <strong className="text-primary">119 ₽ / 30 дней</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

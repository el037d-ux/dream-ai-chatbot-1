import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';

const API_URL = 'https://functions.poehali.dev/5f709de2-ccfd-4b79-9f7c-cb0a8c2e4f09';

interface SubscribePageProps {
  onBack: () => void;
}

const PLANS = [
  { id: 'month', title: 'Месяц', price: 99, period: 'за 30 дней', note: '', badge: '' },
  { id: 'year', title: 'Год', price: 999, period: 'за 365 дней', note: '≈ 83 ₽ в месяц', badge: 'Выгодно −16%' },
];

export default function SubscribePage({ onBack }: SubscribePageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<'month' | 'year'>('year');

  const features = [
    'Безлимитное толкование снов',
    'Полный анализ по Юнгу и Фрейду',
    'Мистические предсказания',
    'Доступ к словарю символов',
    'История всех снов',
    'Приоритетная поддержка',
  ];

  const selectedPlan = PLANS.find(p => p.id === plan)!;

  const handlePay = async () => {
    if (!user) { setError('Войдите в аккаунт для оформления подписки'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_payment',
          user_id: user.user_id,
          email: user.email,
          plan,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.confirmation_url) throw new Error(data.error || 'Ошибка');
      window.location.href = data.confirmation_url;
    } catch (e) {
      setError('Не удалось создать платёж. Попробуйте ещё раз.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-24" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="text-5xl mb-4 animate-float">✨</div>
          <h1 className="font-cormorant text-4xl font-light text-foreground mb-2">
            Полный доступ к СонникАИ
          </h1>
          <p className="text-muted-foreground font-raleway text-sm">
            Откройте все тайны своих снов без ограничений
          </p>
        </div>

        {/* Выбор тарифа */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          {PLANS.map(p => (
            <button
              key={p.id}
              onClick={() => setPlan(p.id as 'month' | 'year')}
              className={`relative text-left rounded-2xl border p-4 transition-all active:scale-[0.98]
                ${plan === p.id ? 'border-primary bg-primary/10 animate-glow' : 'border-border/40 hover:border-primary/40'}`}
            >
              {p.badge && (
                <span className="absolute -top-2.5 right-3 bg-mystic-gold text-background text-[10px] font-raleway font-semibold px-2 py-0.5 rounded-full">
                  {p.badge}
                </span>
              )}
              <div className="font-raleway text-sm text-muted-foreground">{p.title}</div>
              <div className={`font-cormorant text-3xl font-semibold ${plan === p.id ? 'text-primary' : 'text-foreground'}`}>{p.price} ₽</div>
              <div className="text-xs text-muted-foreground font-raleway mt-0.5">{p.period}</div>
              {p.note && <div className="text-xs text-primary/80 font-raleway mt-1">{p.note}</div>}
            </button>
          ))}
        </div>

        {/* Price card */}
        <div className="glass border border-primary/40 rounded-2xl p-6 mb-6 animate-fade-in-up animate-glow" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-3 mb-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={11} className="text-primary" />
                </div>
                <span className="text-sm text-foreground/80 font-raleway">{f}</span>
              </div>
            ))}
          </div>

          {user && (
            <div className="mb-4 p-3 bg-muted/30 rounded-xl border border-border/30">
              <p className="text-xs text-muted-foreground font-raleway text-center">
                Подписка будет оформлена на: <strong className="text-foreground">{user.email}</strong>
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 font-raleway text-center">
              {error}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-raleway text-base py-3.5 rounded-xl hover:bg-primary/80 disabled:opacity-60 transition-all flex items-center justify-center gap-2 animate-glow font-medium"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Создаём платёж...</>
            ) : (
              <><Icon name="CreditCard" size={18} />Оплатить {selectedPlan.price} ₽</>
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground font-raleway mt-3">
            🔒 Безопасная оплата через ЮКассу
          </p>
        </div>

        <div className="glass border border-border/30 rounded-2xl p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-muted-foreground font-raleway">
            Уже есть 3 бесплатных запроса — просто чтобы убедиться в качестве
          </p>
        </div>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-sm text-muted-foreground font-raleway hover:text-foreground transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="ArrowLeft" size={14} />
          Вернуться назад
        </button>
      </div>
    </div>
  );
}
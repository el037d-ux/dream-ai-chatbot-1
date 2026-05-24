import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';

interface SubscribePageProps {
  onBack: () => void;
}

export default function SubscribePage({ onBack }: SubscribePageProps) {
  const { user } = useAuth();

  const features = [
    'Безлимитное толкование снов',
    'Полный анализ по Юнгу и Фрейду',
    'Мистические предсказания',
    'Доступ к словарю символов',
    'История всех снов',
    'Приоритетная поддержка',
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="text-5xl mb-4 animate-float">✨</div>
          <h1 className="font-cormorant text-4xl font-light text-foreground mb-2">
            Полный доступ к Морфею
          </h1>
          <p className="text-muted-foreground font-raleway text-sm">
            Откройте все тайны своих снов без ограничений
          </p>
        </div>

        {/* Price card */}
        <div className="glass border border-primary/40 rounded-2xl p-6 mb-6 animate-fade-in-up animate-glow" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-6">
            <div className="font-cormorant text-6xl font-semibold text-primary">119 ₽</div>
            <div className="text-muted-foreground font-raleway text-sm mt-1">на 30 дней · отменить можно в любой момент</div>
          </div>

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

          <button
            className="w-full bg-primary text-primary-foreground font-raleway text-base py-3.5 rounded-xl hover:bg-primary/80 transition-all flex items-center justify-center gap-2 animate-glow font-medium"
          >
            <Icon name="CreditCard" size={18} />
            Оплатить 119 ₽
          </button>
          <p className="text-center text-xs text-muted-foreground font-raleway mt-3">
            🔒 Безопасная оплата · Автопродление отключено
          </p>
        </div>

        {/* Free info */}
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

import Icon from '@/components/ui/icon';

interface SubscribeBannerProps {
  requestsLeft: number;
  onSubscribe: () => void;
  isBlocked?: boolean;
}

export default function SubscribeBanner({ requestsLeft, onSubscribe, isBlocked }: SubscribeBannerProps) {
  if (requestsLeft > 1 && !isBlocked) return null;

  return (
    <div className={`mx-4 mb-4 rounded-2xl p-4 border animate-fade-in-up hidden md:block ${
      isBlocked
        ? 'bg-primary/10 border-primary/40'
        : 'bg-mystic-gold/5 border-mystic-gold/30'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{isBlocked ? '🔒' : '⚡'}</span>
        <div className="flex-1">
          {isBlocked ? (
            <>
              <p className="font-cormorant text-lg text-foreground font-medium">Бесплатные запросы закончились</p>
              <p className="text-sm text-muted-foreground font-raleway mt-0.5">
                Оформите подписку, чтобы продолжить общение с СонникАИ
              </p>
            </>
          ) : (
            <>
              <p className="font-cormorant text-lg text-foreground font-medium">
                Остался {requestsLeft} бесплатный запрос
              </p>
              <p className="text-sm text-muted-foreground font-raleway mt-0.5">
                Получите безлимитный доступ всего за 99 ₽ / месяц
              </p>
            </>
          )}
          <button
            onClick={onSubscribe}
            className="mt-3 bg-primary text-primary-foreground font-raleway text-sm px-5 py-2 rounded-xl hover:bg-primary/80 transition-all flex items-center gap-2 animate-glow"
          >
            <Icon name="Sparkles" size={14} />
            Оформить подписку — от 99 ₽
          </button>
        </div>
      </div>
    </div>
  );
}
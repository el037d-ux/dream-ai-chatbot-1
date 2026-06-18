import { useEffect, useState } from 'react';

export default function SleepingCat() {
  const [yawn, setYawn] = useState(false);
  const [zIndex, setZIndex] = useState(0);

  useEffect(() => {
    const cycle = () => {
      // Зевает каждые 5 секунд
      const timeout1 = setTimeout(() => setYawn(true), 100);
      const timeout2 = setTimeout(() => setYawn(false), 2200);
      return [timeout1, timeout2];
    };

    const timers = cycle();
    const interval = setInterval(() => {
      const t = cycle();
      timers.push(...t);
    }, 5000);

    // Z-буквы: появляются по очереди
    const zInterval = setInterval(() => {
      setZIndex(p => (p + 1) % 3);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(zInterval);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6 select-none">
      <div className="relative w-[120px] h-[100px]">
        {/* Z-буквы (храп) */}
        <div className="absolute -top-6 left-[60px] flex flex-col items-start gap-0.5 pointer-events-none">
          {['z1', 'z2', 'z3'].map((k, i) => (
            <span
              key={k}
              className="font-cormorant font-bold text-primary/70 transition-all duration-500"
              style={{
                fontSize: 10 + i * 3,
                opacity: zIndex === i ? 1 : 0.15,
                transform: `translateY(${zIndex === i ? -2 : 0}px) translateX(${i * 4}px)`,
              }}
            >
              z
            </span>
          ))}
        </div>

        {/* Хвост */}
        <div
          className="absolute bottom-1 left-0 origin-bottom-right"
          style={{
            animation: 'catTailWag 2.8s ease-in-out infinite',
          }}
        >
          <svg width="38" height="48" viewBox="0 0 38 48" fill="none">
            <path d="M30 44 Q10 30 18 10 Q22 2 30 4" stroke="#F97316" strokeWidth="8" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        {/* Тело */}
        <div
          className="absolute bottom-0 left-6 w-[88px] h-[44px] bg-orange-400 rounded-full"
          style={{
            animation: 'catBreath 3s ease-in-out infinite',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            transform: 'rotate(-6deg)',
          }}
        />

        {/* Лапки */}
        <div className="absolute bottom-0 left-[52px] flex gap-2">
          <div className="w-7 h-4 bg-orange-300 rounded-full" style={{ transform: 'rotate(-10deg) translateY(2px)' }} />
          <div className="w-7 h-4 bg-orange-300 rounded-full" style={{ transform: 'rotate(10deg) translateY(2px)' }} />
        </div>

        {/* Голова */}
        <div
          className="absolute top-0 right-2 w-[52px] h-[52px]"
          style={{ animation: 'catHeadBob 3s ease-in-out infinite' }}
        >
          {/* Уши */}
          <div className="absolute -top-3 left-2">
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-orange-400" />
          </div>
          <div className="absolute -top-3 right-2">
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-orange-400" />
          </div>

          {/* Голова-круг */}
          <div className="w-[52px] h-[52px] bg-orange-400 rounded-full flex flex-col items-center justify-center gap-1 pt-2"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            {/* Глаза */}
            <div className="flex gap-3 items-center">
              <div
                className="bg-gray-800 rounded-full transition-all duration-300"
                style={{ width: yawn ? 6 : 3, height: yawn ? 3 : 8, borderRadius: 9999 }}
              />
              <div
                className="bg-gray-800 rounded-full transition-all duration-300"
                style={{ width: yawn ? 6 : 3, height: yawn ? 3 : 8, borderRadius: 9999 }}
              />
            </div>

            {/* Нос */}
            <div className="w-2 h-1.5 bg-pink-400 rounded-full" />

            {/* Рот / зевок */}
            <div
              className="bg-gray-800 rounded-full transition-all duration-500 overflow-hidden flex items-center justify-center"
              style={{
                width: yawn ? 14 : 6,
                height: yawn ? 10 : 3,
                borderRadius: yawn ? '40% 40% 50% 50%' : '9999px',
              }}
            >
              {yawn && <div className="w-2 h-1.5 bg-pink-300 rounded-full mt-1" />}
            </div>
          </div>

          {/* Усы */}
          <div className="absolute top-[30px] -left-4 flex flex-col gap-1">
            <div className="w-4 h-px bg-gray-600/60" style={{ transform: 'rotate(-10deg)' }} />
            <div className="w-4 h-px bg-gray-600/60" />
          </div>
          <div className="absolute top-[30px] -right-4 flex flex-col gap-1">
            <div className="w-4 h-px bg-gray-600/60" style={{ transform: 'rotate(10deg)' }} />
            <div className="w-4 h-px bg-gray-600/60" />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/40 font-raleway mt-3 italic">СонникАИ дремлет в ожидании твоего сна...</p>

      <style>{`
        @keyframes catBreath {
          0%, 100% { transform: rotate(-6deg) scaleY(1); }
          50% { transform: rotate(-6deg) scaleY(1.07); }
        }
        @keyframes catHeadBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes catTailWag {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
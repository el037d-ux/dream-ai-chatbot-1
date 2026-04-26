import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true);
  const [theory, setTheory] = useState<'both' | 'jung' | 'freud'>('both');
  const [depth, setDepth] = useState<'basic' | 'deep' | 'esoteric'>('deep');

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="font-cormorant text-4xl md:text-5xl font-light text-foreground mb-3">
            Личный кабинет
          </h1>
          <div className="mystic-divider my-4" />
        </div>

        {/* Profile card */}
        <div className="glass border border-border/30 rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 animate-glow flex items-center justify-center text-4xl">
                🌙
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-mystic-gold border-2 border-background flex items-center justify-center text-xs">
                ✦
              </div>
            </div>
            <div>
              <h2 className="font-cormorant text-2xl text-foreground">Путник Снов</h2>
              <p className="text-sm text-muted-foreground font-raleway">Уровень: Искатель Истины</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/5 bg-gradient-to-r from-primary to-accent rounded-full" />
                </div>
                <span className="text-xs text-muted-foreground font-raleway">47 / 100 снов</span>
              </div>
            </div>
          </div>

          <div className="mystic-divider my-5" />

          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Снов', value: '47', icon: '🌙' },
              { label: 'Символов', value: '134', icon: '✨' },
              { label: 'Инсайтов', value: '23', icon: '💜' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-cormorant text-primary font-semibold">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-raleway">{stat.icon} {stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          {/* Theory preference */}
          <div className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-cormorant text-xl text-foreground mb-4">Теория анализа</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'both', label: 'Юнг + Фрейд', emoji: '⚗️' },
                { id: 'jung', label: 'Только Юнг', emoji: '🌀' },
                { id: 'freud', label: 'Только Фрейд', emoji: '🛋️' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTheory(opt.id as typeof theory)}
                  className={`p-3 rounded-xl border text-center transition-all font-raleway text-sm
                    ${theory === opt.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/30 text-muted-foreground hover:border-primary/30'
                    }`}
                >
                  <div className="text-2xl mb-1">{opt.emoji}</div>
                  <div className="text-xs">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Depth */}
          <div className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-cormorant text-xl text-foreground mb-4">Глубина анализа</h3>
            <div className="space-y-2">
              {[
                { id: 'basic', label: 'Базовый', desc: 'Краткое толкование символов', emoji: '🌱' },
                { id: 'deep', label: 'Глубокий', desc: 'Психологический анализ + предсказание', emoji: '🌊' },
                { id: 'esoteric', label: 'Эзотерический', desc: 'Полный мистический разбор с ритуалами', emoji: '🔮' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDepth(opt.id as typeof depth)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all
                    ${depth === opt.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border/30 hover:border-primary/30'
                    }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <div>
                    <div className={`text-sm font-raleway font-medium ${depth === opt.id ? 'text-primary' : 'text-foreground'}`}>
                      {opt.label}
                    </div>
                    <div className="text-xs text-muted-foreground font-raleway">{opt.desc}</div>
                  </div>
                  {depth === opt.id && (
                    <Icon name="Check" size={16} className="text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cormorant text-xl text-foreground">Напоминания</h3>
                <p className="text-xs text-muted-foreground font-raleway mt-1">Записывать сны сразу после пробуждения</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${notifications ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <button className="w-full text-center text-sm text-muted-foreground font-raleway hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <Icon name="LogOut" size={16} />
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

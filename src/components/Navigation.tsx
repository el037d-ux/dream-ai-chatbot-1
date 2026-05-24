import Icon from '@/components/ui/icon';

interface NavProps {
  active: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'chat', label: 'Предсказание', icon: 'Moon' },
  { id: 'history', label: 'История', icon: 'BookOpen' },
  { id: 'dictionary', label: 'Словарь', icon: 'Library' },
  { id: 'profile', label: 'Кабинет', icon: 'User' },
  { id: 'about', label: 'О нас', icon: 'Info' },
  { id: 'contact', label: 'Контакты', icon: 'Mail' },
];

const mobileItems = [
  { id: 'chat', label: 'Чат', icon: 'Moon' },
  { id: 'history', label: 'История', icon: 'BookOpen' },
  { id: 'dictionary', label: 'Словарь', icon: 'Library' },
  { id: 'profile', label: 'Кабинет', icon: 'User' },
  { id: 'about', label: 'О нас', icon: 'Info' },
];

export default function Navigation({ active, onNavigate }: NavProps) {
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
              <div className="font-cormorant text-xl font-semibold text-foreground leading-none">Морфей</div>
              <div className="text-xs text-muted-foreground font-raleway tracking-widest uppercase">Толкователь снов</div>
            </div>
          </button>

          <div className="flex items-center gap-1">
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
      </nav>

      {/* Mobile top bar (logo only) */}
      <div className="glass-strong fixed top-0 left-0 right-0 z-50 px-4 py-3 flex md:hidden items-center justify-between">
        <button onClick={() => onNavigate('chat')} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center animate-glow">
            <span className="text-base">🌙</span>
          </div>
          <div>
            <div className="font-cormorant text-lg font-semibold text-foreground leading-none">Морфей</div>
            <div className="text-xs text-muted-foreground font-raleway tracking-wider uppercase" style={{ fontSize: 9 }}>Толкователь снов</div>
          </div>
        </button>
        <button
          onClick={() => onNavigate('profile')}
          className={`p-2 rounded-xl transition-all ${active === 'profile' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
        >
          <Icon name="User" fallback="Circle" size={20} />
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="glass-strong border-t border-border/30 px-2 py-2 flex items-center justify-around">
          {mobileItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0
                ${active === item.id ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
                ${active === item.id ? 'bg-primary/15' : ''}`}>
                <Icon name={item.icon} fallback="Circle" size={19} />
              </div>
              <span className="text-xs font-raleway leading-none" style={{ fontSize: 10 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

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
  { id: 'about', label: 'О проекте', icon: 'Info' },
  { id: 'contact', label: 'Контакты', icon: 'Mail' },
];

export default function Navigation({ active, onNavigate }: NavProps) {
  return (
    <nav className="glass-strong fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('chat')}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center animate-glow group-hover:scale-110 transition-transform">
            <span className="text-xl">🌙</span>
          </div>
          <div>
            <div className="font-cormorant text-xl font-semibold text-foreground leading-none">Морфей</div>
            <div className="text-xs text-muted-foreground font-raleway tracking-widest uppercase">Толкователь снов</div>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item px-4 py-2 rounded-lg text-sm font-raleway font-medium transition-all duration-300 flex items-center gap-2
                ${active === item.id
                  ? 'text-primary bg-primary/10 active'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
            >
              <Icon name={item.icon} fallback="Circle" size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`p-2.5 rounded-lg transition-all duration-300
                ${active === item.id
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Icon name={item.icon} fallback="Circle" size={18} />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

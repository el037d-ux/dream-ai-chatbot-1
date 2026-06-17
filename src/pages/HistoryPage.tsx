import { useState } from 'react';
import Icon from '@/components/ui/icon';

const historyData = [
  {
    id: 1,
    date: '24 апреля 2026',
    title: 'Полёт над городом',
    excerpt: 'Я летел над ночным городом, огни мерцали внизу как звёзды...',
    tags: ['Свобода', 'Амбиции', 'Анима'],
    mood: '🌟',
    depth: 'Глубокий',
    theory: 'Юнг',
  },
  {
    id: 2,
    date: '21 апреля 2026',
    title: 'Тёмный лес и незнакомец',
    excerpt: 'Тёмный лес, тропинка исчезла, позади слышались шаги...',
    tags: ['Тень', 'Страх', 'Трансформация'],
    mood: '🌑',
    depth: 'Архетипический',
    theory: 'Юнг + Фрейд',
  },
  {
    id: 3,
    date: '18 апреля 2026',
    title: 'Море и уходящий корабль',
    excerpt: 'Стоял на берегу и смотрел как корабль уплывал в туман...',
    tags: ['Потеря', 'Подсознание', 'Ид'],
    mood: '💙',
    depth: 'Психоаналитический',
    theory: 'Фрейд',
  },
  {
    id: 4,
    date: '14 апреля 2026',
    title: 'Зеркальный лабиринт',
    excerpt: 'Бесконечные зеркала отражали меня, но образы были разными...',
    tags: ['Самопознание', 'Персона', 'Эго'],
    mood: '🪞',
    depth: 'Глубокий',
    theory: 'Юнг',
  },
];

const stats = [
  { label: 'Снов проанализировано', value: '47', icon: '🌙' },
  { label: 'Архетипов найдено', value: '12', icon: '✨' },
  { label: 'Дней ведения', value: '38', icon: '📅' },
  { label: 'Инсайтов получено', value: '23', icon: '💫' },
];

export default function HistoryPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen px-4 pb-24" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="font-cormorant text-4xl md:text-5xl font-light text-foreground mb-3">
            История снов
          </h1>
          <div className="mystic-divider my-4" />
          <p className="text-muted-foreground font-raleway text-sm">
            Архив ваших путешествий в мир подсознания
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass border border-border/30 rounded-2xl p-4 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-cormorant text-3xl font-semibold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-raleway mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dreams list */}
        <div className="space-y-4">
          {historyData.map((dream, i) => (
            <div
              key={dream.id}
              className={`glass border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:border-primary/40 animate-fade-in-up
                ${selected === dream.id ? 'border-primary/50 bg-primary/5' : 'border-border/30'}`}
              style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
              onClick={() => setSelected(selected === dream.id ? null : dream.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl animate-float" style={{ animationDelay: `${i}s` }}>{dream.mood}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-cormorant text-xl text-foreground">{dream.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-raleway border border-primary/20">
                        {dream.theory}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-raleway leading-relaxed">{dream.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {dream.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent-foreground/70 border border-border/30 font-raleway">
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-mystic-gold/10 text-mystic-gold border border-mystic-gold/20 font-raleway">
                        {dream.depth}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground font-raleway">{dream.date}</span>
                  <Icon name={selected === dream.id ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground" />
                </div>
              </div>

              {selected === dream.id && (
                <div className="mt-4 pt-4 border-t border-border/30 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="text-xs font-raleway text-primary uppercase tracking-widest mb-2">Анализ Юнга</div>
                      <p className="text-sm text-foreground/80 font-raleway leading-relaxed">
                        Архетип Героя проявляется через стремление к трансценденции. Символы указывают на процесс индивидуации — интеграцию Тени и Анимы.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                      <div className="text-xs font-raleway text-accent uppercase tracking-widest mb-2">Анализ Фрейда</div>
                      <p className="text-sm text-foreground/80 font-raleway leading-relaxed">
                        Вытесненные желания Ид ищут выход через символическое замещение. Суперэго формирует образы в соответствии с социальными табу.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="mt-8 text-center">
          <button className="glass border border-primary/30 text-primary hover:bg-primary/10 font-raleway text-sm px-6 py-3 rounded-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto">
            <Icon name="Plus" size={16} />
            Добавить новый сон
          </button>
        </div>
      </div>
    </div>
  );
}
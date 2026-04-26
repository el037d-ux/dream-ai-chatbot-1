import { useState } from 'react';
import Icon from '@/components/ui/icon';

const symbols = [
  {
    symbol: '🌊', name: 'Вода / Океан', category: 'Стихии',
    jung: 'Коллективное бессознательное, материнский архетип, глубины психики',
    freud: 'Регрессия к пренатальному состоянию, сексуальное начало, влечение к смерти',
    meaning: 'Трансформация, очищение, эмоциональное состояние',
    prediction: 'Перемены в личной жизни, период эмоционального обновления',
  },
  {
    symbol: '🐍', name: 'Змея', category: 'Животные',
    jung: 'Архетип трансформации, мудрость, исцеление (кадуцей), Тень',
    freud: 'Фаллический символ, либидинальная энергия, страх кастрации',
    meaning: 'Обновление, скрытая мудрость, опасность или исцеление',
    prediction: 'Трансформация личности, скрытая информация выйдет на поверхность',
  },
  {
    symbol: '🌙', name: 'Луна', category: 'Небесные тела',
    jung: 'Анима, женское начало, цикличность, бессознательное',
    freud: 'Символ материнской фигуры, ночные страхи, вытесненное',
    meaning: 'Интуиция, цикличность, тайное знание',
    prediction: 'Усиление интуиции, важные события при лунных фазах',
  },
  {
    symbol: '🔥', name: 'Огонь', category: 'Стихии',
    jung: 'Трансформация, очищение, духовное пробуждение, либидо как психическая энергия',
    freud: 'Агрессия, страсть, уретральная эротика',
    meaning: 'Страсть, очищение, разрушение старого',
    prediction: 'Период страстей, конец одной фазы и начало новой',
  },
  {
    symbol: '🏠', name: 'Дом', category: 'Постройки',
    jung: 'Структура психики — разные этажи символизируют уровни сознания',
    freud: 'Тело человека, родительский дом, ранние переживания',
    meaning: 'Безопасность, идентичность, семейные паттерны',
    prediction: 'Вопросы семьи, жилья или личных границ требуют внимания',
  },
  {
    symbol: '🌳', name: 'Дерево', category: 'Природа',
    jung: 'Ось мира, процесс индивидуации, рост Самости',
    freud: 'Фаллический символ или материнская фигура (в зависимости от формы)',
    meaning: 'Рост, корни, жизненная сила, семейное дерево',
    prediction: 'Укрепление связей с семьёй, личностный рост',
  },
  {
    symbol: '✈️', name: 'Полёт', category: 'Движение',
    jung: 'Освобождение от земных оков, архетип Героя, духовное восхождение',
    freud: 'Эрекция, сексуальное возбуждение, желание превосходства',
    meaning: 'Свобода, амбиции, освобождение от ограничений',
    prediction: 'Возможности для реализации давних целей',
  },
  {
    symbol: '🪞', name: 'Зеркало', category: 'Предметы',
    jung: 'Архетип Самости, встреча с Тенью, процесс самопознания',
    freud: 'Нарциссизм, страх двойника, первичный нарциссизм',
    meaning: 'Самопознание, обман, поиск истинного "я"',
    prediction: 'Время переосмыслить себя и свои отношения',
  },
  {
    symbol: '⚡', name: 'Молния / Гроза', category: 'Стихии',
    jung: 'Озарение, откровение, разрушение иллюзий',
    freud: 'Страх отца, угроза со стороны Супер-Эго',
    meaning: 'Внезапное откровение, катарсис, очищение',
    prediction: 'Неожиданное открытие изменит ваш взгляд на мир',
  },
];

const categories = ['Все', 'Стихии', 'Животные', 'Небесные тела', 'Постройки', 'Природа', 'Движение', 'Предметы'];

export default function DictionaryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = symbols.filter(s =>
    (activeCategory === 'Все' || s.category === activeCategory) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.meaning.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="font-cormorant text-4xl md:text-5xl font-light text-foreground mb-3">
            Словарь символов
          </h1>
          <div className="mystic-divider my-4" />
          <p className="text-muted-foreground font-raleway text-sm">
            Архетипические образы и их толкование по Юнгу и Фрейду
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Найти символ..."
            className="w-full glass border border-border/40 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-all font-raleway"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-raleway font-medium transition-all
                ${activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'glass border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Symbols grid */}
        <div className="space-y-3">
          {filtered.map((sym, i) => (
            <div
              key={sym.name}
              className={`glass border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer animate-fade-in-up
                ${expanded === sym.name ? 'border-primary/40' : 'border-border/30 hover:border-primary/20'}`}
              style={{ animationDelay: `${i * 0.05 + 0.3}s` }}
              onClick={() => setExpanded(expanded === sym.name ? null : sym.name)}
            >
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    {sym.symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-cormorant text-lg text-foreground">{sym.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-raleway">{sym.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-raleway">{sym.meaning}</p>
                  </div>
                </div>
                <Icon name={expanded === sym.name ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground flex-shrink-0" />
              </div>

              {expanded === sym.name && (
                <div className="px-4 pb-5 pt-0 border-t border-border/20">
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-primary text-xs font-raleway font-semibold uppercase tracking-widest">Юнг</span>
                        <span className="text-xs text-muted-foreground font-raleway">Аналитическая психология</span>
                      </div>
                      <p className="text-sm text-foreground/80 font-raleway leading-relaxed">{sym.jung}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/15">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-accent text-xs font-raleway font-semibold uppercase tracking-widest">Фрейд</span>
                        <span className="text-xs text-muted-foreground font-raleway">Психоанализ</span>
                      </div>
                      <p className="text-sm text-foreground/80 font-raleway leading-relaxed">{sym.freud}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-mystic-gold/5 border border-mystic-gold/20">
                    <div className="text-xs font-raleway font-semibold uppercase tracking-widest text-mystic-gold mb-1">✦ Предсказание</div>
                    <p className="text-sm text-foreground/80 font-raleway">{sym.prediction}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-raleway">
            <div className="text-4xl mb-4">🔮</div>
            Символ не найден в словаре
          </div>
        )}
      </div>
    </div>
  );
}

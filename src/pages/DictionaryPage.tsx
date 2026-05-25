import { useState } from 'react';
import Icon from '@/components/ui/icon';

const symbols = [
  {
    symbol: '🌊', name: 'Вода / Океан', category: 'Стихии',
    miller: 'Видеть спокойную воду — удача и процветание. Бурная вода — препятствия в делах и тревоги.',
    nostradamus: 'Вода — зеркало будущего. Чистая — благоприятные перемены, мутная — скрытые угрозы судьбы.',
    vanga: 'Вода — символ жизни и очищения. Пить чистую воду — к здоровью, мутную — берегитесь болезней.',
    jung: 'Коллективное бессознательное, материнский архетип, глубины психики',
    freud: 'Регрессия к пренатальному состоянию, сексуальное начало, влечение к смерти',
  },
  {
    symbol: '🐍', name: 'Змея', category: 'Животные',
    miller: 'Змея во сне — предупреждение о врагах и предателях. Убить змею — победа над противниками.',
    nostradamus: 'Змея — древний знак трансформации мира. Явление змеи предвещает время великих перемен.',
    vanga: 'Змея — двойственный знак. Ползёт к тебе — жди неприятностей от близких, уползает — минует беда.',
    jung: 'Архетип трансформации, мудрость, исцеление (кадуцей), воплощение Тени',
    freud: 'Фаллический символ, либидинальная энергия, страх кастрации',
  },
  {
    symbol: '🌙', name: 'Луна', category: 'Небесные тела',
    miller: 'Полная луна — благополучие и любовь. Убывающая — временные неудачи, стоит проявить терпение.',
    nostradamus: 'Луна в снах — вестник тайных событий. Кровавая луна предвещает потрясения для целых народов.',
    vanga: 'Луна — символ женской силы и судьбы. Яркая луна сулит счастье в любви, тусклая — разлуку.',
    jung: 'Анима, женское начало, цикличность психических процессов, бессознательное',
    freud: 'Символ материнской фигуры, ночные страхи, вытесненные желания',
  },
  {
    symbol: '🔥', name: 'Огонь', category: 'Стихии',
    miller: 'Яркий огонь — страсть, энергия, успех в начинаниях. Пожар — опасность конфликтов и потерь.',
    nostradamus: 'Огонь в снах — предвестник великих потрясений. Огненное небо — знак исторических событий.',
    vanga: 'Огонь — предупреждение. Греешься у огня — к добру, горишь сам — берегись тяжёлых испытаний.',
    jung: 'Трансформация, очищение, духовное пробуждение, либидо как психическая энергия',
    freud: 'Агрессия, страсть, уретральная эротика, деструктивные импульсы',
  },
  {
    symbol: '🏠', name: 'Дом', category: 'Постройки',
    miller: 'Красивый дом — к достатку и семейному счастью. Разрушенный дом — потери и разочарования.',
    nostradamus: 'Дом символизирует государство и устои. Рушащийся дом — предвестие социальных перемен.',
    vanga: 'Свой дом во сне — знак рода и предков. Строить дом — к свадьбе или рождению детей.',
    jung: 'Структура психики: подвал — бессознательное, верхние этажи — высшие уровни сознания',
    freud: 'Тело человека, родительский дом, ранние детские переживания и травмы',
  },
  {
    symbol: '🌳', name: 'Дерево', category: 'Природа',
    miller: 'Высокое дерево — карьерный рост и авторитет. Засохшее — болезнь или крах планов.',
    nostradamus: 'Дерево — символ цивилизации и народов. Падающее дерево — гибель великих держав.',
    vanga: 'Дерево — родовое дерево семьи. Цветущее — к радости в роду, поваленное — к потере близкого.',
    jung: 'Ось мира (Мировое древо), процесс индивидуации, рост Самости',
    freud: 'Фаллический символ или материнская фигура в зависимости от контекста',
  },
  {
    symbol: '✈️', name: 'Полёт', category: 'Движение',
    miller: 'Летать высоко — к успеху и амбициозным достижениям. Падать — остерегайтесь рискованных затей.',
    nostradamus: 'Полёт над землёй — знак избранности. Видящий такой сон получает особую миссию.',
    vanga: 'Летать легко — душа здорова и свободна. Падать с высоты — берегитесь гордыни.',
    jung: 'Освобождение от земных оков, архетип Героя, духовное восхождение к Самости',
    freud: 'Эрекция, сексуальное возбуждение, желание превосходства над другими',
  },
  {
    symbol: '🪞', name: 'Зеркало', category: 'Предметы',
    miller: 'Смотреться в зеркало — к сплетням и лжи вокруг вас. Разбитое зеркало — к несчастью.',
    nostradamus: 'Зеркало открывает врата между мирами. Туманное зеркало — скрытая правда выйдет наружу.',
    vanga: 'Зеркало — окно в иной мир. Видеть себя старым — к мудрости, не видеть отражения — к болезни.',
    jung: 'Архетип Самости, встреча с Тенью, процесс самопознания и интеграции',
    freud: 'Нарциссизм, страх двойника, первичный нарциссизм и поиск самоподтверждения',
  },
  {
    symbol: '⚡', name: 'Молния / Гроза', category: 'Стихии',
    miller: 'Молния вдали — внезапные новости. Удар молнии рядом — опасность, будьте осторожны.',
    nostradamus: 'Молния — знак Божественного вмешательства. Частые молнии во сне — эпоха потрясений близко.',
    vanga: 'Гроза во сне — очищение. После грозы ясное небо — трудности уйдут, жди светлой полосы.',
    jung: 'Озарение свыше, разрушение иллюзий, откровение, прорыв бессознательного',
    freud: 'Страх отца, угроза со стороны Супер-Эго, наказание за запретные желания',
  },
];

const categories = ['Все', 'Стихии', 'Животные', 'Небесные тела', 'Постройки', 'Природа', 'Движение', 'Предметы'];

const interpreters = [
  { key: 'miller', label: 'Миллер', emoji: '📖', color: 'text-amber-400', bg: 'bg-amber-400/5 border-amber-400/20' },
  { key: 'nostradamus', label: 'Нострадамус', emoji: '🔯', color: 'text-blue-400', bg: 'bg-blue-400/5 border-blue-400/20' },
  { key: 'vanga', label: 'Ванга', emoji: '🌿', color: 'text-green-400', bg: 'bg-green-400/5 border-green-400/20' },
  { key: 'jung', label: 'Юнг', emoji: '✨', color: 'text-primary', bg: 'bg-primary/5 border-primary/20' },
  { key: 'freud', label: 'Фрейд', emoji: '🔮', color: 'text-accent', bg: 'bg-accent/5 border-accent/20' },
];

export default function DictionaryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = symbols.filter(s =>
    (activeCategory === 'Все' || s.category === activeCategory) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-24 md:pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="font-cormorant text-4xl md:text-5xl font-light text-foreground mb-3">
            Словарь символов
          </h1>
          <div className="mystic-divider my-4" />
          <p className="text-muted-foreground font-raleway text-sm mb-4">
            Толкование по Миллеру, Нострадамусу, Ванге, Юнгу и Фрейду
          </p>
          {/* Interpreters legend */}
          <div className="flex flex-wrap justify-center gap-2">
            {interpreters.map(int => (
              <span key={int.key} className={`text-xs px-3 py-1 rounded-full border font-raleway ${int.bg} ${int.color}`}>
                {int.emoji} {int.label}
              </span>
            ))}
          </div>
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

        {/* Symbols */}
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-cormorant text-xl text-foreground">{sym.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-raleway">{sym.category}</span>
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      {interpreters.map(int => (
                        <span key={int.key} className={`text-xs ${int.color} font-raleway`}>{int.emoji}</span>
                      ))}
                      <span className="text-xs text-muted-foreground font-raleway ml-1">5 толкований</span>
                    </div>
                  </div>
                </div>
                <Icon name={expanded === sym.name ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground flex-shrink-0" />
              </div>

              {expanded === sym.name && (
                <div className="px-4 pb-5 pt-0 border-t border-border/20">
                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    {interpreters.map(int => (
                      <div key={int.key} className={`p-4 rounded-xl border ${int.bg}`}>
                        <div className={`text-xs font-raleway font-semibold uppercase tracking-widest mb-2 ${int.color}`}>
                          {int.emoji} {int.label}
                        </div>
                        <p className="text-sm text-foreground/80 font-raleway leading-relaxed">
                          {sym[int.key as keyof typeof sym]}
                        </p>
                      </div>
                    ))}
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

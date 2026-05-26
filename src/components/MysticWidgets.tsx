import { useState } from 'react';
import Icon from '@/components/ui/icon';

// ── Луна ──────────────────────────────────────────────────────────────────────
function getMoonPhase(date: Date) {
  const known = new Date(2000, 0, 6);
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = 29.53058867;
  const day = ((diff % cycle) + cycle) % cycle;
  const illumination = Math.round(50 * (1 - Math.cos((2 * Math.PI * day) / cycle)));

  let name: string, emoji: string, advice: string;
  if (day < 1.5)       { name = 'Новолуние';        emoji = '🌑'; advice = 'Время новых намерений — сны пророческие'; }
  else if (day < 7.4)  { name = 'Растущий серп';    emoji = '🌒'; advice = 'Сны вещие — обращайте внимание на детали'; }
  else if (day < 9.9)  { name = 'Первая четверть';  emoji = '🌓'; advice = 'Сны отражают внутренние противоречия'; }
  else if (day < 14.8) { name = 'Растущая луна';    emoji = '🌔'; advice = 'Энергия нарастает — сны яркие и насыщенные'; }
  else if (day < 16.3) { name = 'Полнолуние';       emoji = '🌕'; advice = 'Мощнейшее время для толкования снов'; }
  else if (day < 21.2) { name = 'Убывающая луна';   emoji = '🌖'; advice = 'Сны помогают отпустить прошлое'; }
  else if (day < 23.7) { name = 'Последняя четверть'; emoji = '🌗'; advice = 'Время анализа и подведения итогов'; }
  else if (day < 28.0) { name = 'Убывающий серп';   emoji = '🌘'; advice = 'Сны уводят вглубь подсознания'; }
  else                 { name = 'Тёмная луна';       emoji = '🌑'; advice = 'Прислушайтесь к тишине внутри себя'; }

  return { name, emoji, day: Math.round(day) + 1, illumination, advice };
}

const LUNAR_MEANINGS: Record<number, string> = {
  1: 'День новых начинаний', 2: 'День мечты и интуиции', 3: 'День творческой силы',
  4: 'День стабильности', 5: 'День перемен', 6: 'День гармонии',
  7: 'День духовного роста', 8: 'День достижений', 9: 'День испытаний',
  10: 'День успеха', 11: 'День щедрости', 12: 'День любви',
  13: 'День преобразований', 14: 'День полноты', 15: 'День высшей силы',
  16: 'День освобождения', 17: 'День мудрости', 18: 'День тайн',
  19: 'День очищения', 20: 'День покоя', 21: 'День воли',
  22: 'День знаний', 23: 'День перехода', 24: 'День равновесия',
  25: 'День духов', 26: 'День исцеления', 27: 'День завершения',
  28: 'День прощения', 29: 'День растворения', 30: 'День тишины',
};

// ── Мудрая минутка ────────────────────────────────────────────────────────────
const WISE_QUOTES = [
  'Ты не обязан быть идеальным — достаточно быть настоящим.',
  'Твоя ценность не зависит от лайков, оценок или чужого мнения.',
  'Разрешай себе отдыхать: пауза — это часть пути, а не ошибка.',
  'Говори с собой так, как говорил бы с лучшим другом.',
  'Маленькие шаги каждый день важнее одного грандиозного рывка.',
  'Эмоции — это сигналы, а не приказы: почувствуй, но не действуй на автомате.',
  '«Я не могу» часто означает «Я пока не умею» — добавь слово «пока».',
  'Сравнивай себя только с собой вчерашним.',
  'Негативная мысль — не факт. Спроси: «А что, если всё иначе?»',
  'Благодарность меняет фокус: найди 3 хорошие вещи даже в трудный день.',
  'Умение слушать — важнее умения говорить.',
  'Говори «нет» без чувства вины — это защита твоих границ.',
  'Конфликт — не война, а возможность понять друг друга глубже.',
  'Люди запоминают не твои слова, а то, как ты заставил их себя чувствовать.',
  'Прощать — не значит забывать. Это значит освободить себя от груза.',
  'Ошибка — это не провал, а данные для следующего шага.',
  'Ставь цели, которые вдохновляют, а не пугают.',
  'Учись не для оценки, а для жизни — знания остаются с тобой.',
  'Не бойся менять направление: путь важнее точки старта.',
  'Твой темп — это нормально. Не спеши, не отставай — иди своим ритмом.',
  'Сон, вода и движение — база, без которой сложно быть собой.',
  'Цифровой детокс — это не наказание, а забота о внимании.',
  'Дыши глубже, когда тревожно: 4 секунды вдох — 6 выдох.',
  'Хобби — это не роскошь, а способ восстановить энергию.',
  'Проси помощи, когда трудно. Это признак силы, а не слабости.',
  'Делай добро тихо — оно всё равно вернётся.',
  'Будь тем человеком, которому ты сам хотел бы доверять.',
  'Живи так, чтобы сегодня вечером тебе было спокойно за этот день.',
  'Мечтай смело, но действуй конкретно.',
  'Ты уже достаточно хорош. Просто помни об этом. 💫',
];

function getDailyQuote(date: Date): { text: string; number: number } {
  const day = date.getDate();
  const idx = (day - 1) % WISE_QUOTES.length;
  return { text: WISE_QUOTES[idx], number: idx + 1 };
}

// ── Гороскоп ──────────────────────────────────────────────────────────────────
const SIGNS = [
  { name: 'Овен',      emoji: '♈', dates: 'Mar 21 – Apr 19', key: 'aries' },
  { name: 'Телец',     emoji: '♉', dates: 'Apr 20 – May 20', key: 'taurus' },
  { name: 'Близнецы',  emoji: '♊', dates: 'May 21 – Jun 20', key: 'gemini' },
  { name: 'Рак',       emoji: '♋', dates: 'Jun 21 – Jul 22', key: 'cancer' },
  { name: 'Лев',       emoji: '♌', dates: 'Jul 23 – Aug 22', key: 'leo' },
  { name: 'Дева',      emoji: '♍', dates: 'Aug 23 – Sep 22', key: 'virgo' },
  { name: 'Весы',      emoji: '♎', dates: 'Sep 23 – Oct 22', key: 'libra' },
  { name: 'Скорпион',  emoji: '♏', dates: 'Oct 23 – Nov 21', key: 'scorpio' },
  { name: 'Стрелец',   emoji: '♐', dates: 'Nov 22 – Dec 21', key: 'sagittarius' },
  { name: 'Козерог',   emoji: '♑', dates: 'Dec 22 – Jan 19', key: 'capricorn' },
  { name: 'Водолей',   emoji: '♒', dates: 'Jan 20 – Feb 18', key: 'aquarius' },
  { name: 'Рыбы',      emoji: '♓', dates: 'Feb 19 – Mar 20', key: 'pisces' },
];

// Прогноз снов по знаку + дню года (меняется ежедневно, детерминирован)
function getDreamForecast(signKey: string, date: Date): { energy: string; dream: string; symbol: string } {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = (signKey.charCodeAt(0) + signKey.charCodeAt(1) + dayOfYear) % 7;

  const forecasts: Record<string, { energy: string; dream: string; symbol: string }[]> = {
    aries:       [
      { energy: 'Высокая', dream: 'Снятся путешествия и новые горизонты', symbol: 'Пламя' },
      { energy: 'Средняя', dream: 'Сны о победе и лидерстве', symbol: 'Меч' },
      { energy: 'Бурная',  dream: 'Снятся испытания силы и воли', symbol: 'Гора' },
    ],
    taurus:      [
      { energy: 'Спокойная', dream: 'Снятся сады и природа', symbol: 'Цветок' },
      { energy: 'Высокая',   dream: 'Сны о достатке и уюте', symbol: 'Ключ' },
      { energy: 'Средняя',   dream: 'Снятся давние воспоминания', symbol: 'Земля' },
    ],
    gemini:      [
      { energy: 'Переменчивая', dream: 'Снятся разговоры и встречи', symbol: 'Зеркало' },
      { energy: 'Высокая',      dream: 'Сны о путешествиях и идеях', symbol: 'Ветер' },
      { energy: 'Активная',     dream: 'Снятся загадки и головоломки', symbol: 'Книга' },
    ],
    cancer:      [
      { energy: 'Глубокая', dream: 'Снятся море и лунный свет', symbol: 'Луна' },
      { energy: 'Высокая',  dream: 'Сны о семье и доме', symbol: 'Вода' },
      { energy: 'Тонкая',   dream: 'Снятся детские воспоминания', symbol: 'Раковина' },
    ],
    leo:         [
      { energy: 'Мощная',   dream: 'Снятся трон и золотой свет', symbol: 'Солнце' },
      { energy: 'Высокая',  dream: 'Сны о признании и успехе', symbol: 'Корона' },
      { energy: 'Яркая',    dream: 'Снятся великие свершения', symbol: 'Лев' },
    ],
    virgo:       [
      { energy: 'Точная',   dream: 'Снятся детали и символы', symbol: 'Кристалл' },
      { energy: 'Средняя',  dream: 'Сны о порядке и гармонии', symbol: 'Колос' },
      { energy: 'Глубокая', dream: 'Снятся мудрые наставники', symbol: 'Нить' },
    ],
    libra:       [
      { energy: 'Гармоничная', dream: 'Снятся весы и равновесие', symbol: 'Чаши' },
      { energy: 'Высокая',     dream: 'Сны о красоте и искусстве', symbol: 'Роза' },
      { energy: 'Нежная',      dream: 'Снятся встречи с близкими', symbol: 'Мост' },
    ],
    scorpio:     [
      { energy: 'Интенсивная', dream: 'Снятся тайны и превращения', symbol: 'Змей' },
      { energy: 'Мощная',      dream: 'Сны о скрытых знаниях', symbol: 'Феникс' },
      { energy: 'Глубокая',    dream: 'Снятся двери в иные миры', symbol: 'Ключ' },
    ],
    sagittarius: [
      { energy: 'Свободная', dream: 'Снятся дальние странствия', symbol: 'Стрела' },
      { energy: 'Высокая',   dream: 'Сны о мудрости и истине', symbol: 'Огонь' },
      { energy: 'Широкая',   dream: 'Снятся небеса и горизонты', symbol: 'Лук' },
    ],
    capricorn:   [
      { energy: 'Стойкая', dream: 'Снятся вершины и пути к ним', symbol: 'Камень' },
      { energy: 'Высокая', dream: 'Сны о достижении целей', symbol: 'Гора' },
      { energy: 'Твёрдая', dream: 'Снятся мудрые старцы', symbol: 'Кость' },
    ],
    aquarius:    [
      { energy: 'Необычная', dream: 'Снятся иные миры и будущее', symbol: 'Молния' },
      { energy: 'Высокая',   dream: 'Сны о свободе и открытиях', symbol: 'Звезда' },
      { energy: 'Яркая',     dream: 'Снятся изобретения и идеи', symbol: 'Волна' },
    ],
    pisces:      [
      { energy: 'Мистическая', dream: 'Снятся глубины океана', symbol: 'Рыба' },
      { energy: 'Высокая',     dream: 'Сны растворяют границы миров', symbol: 'Туман' },
      { energy: 'Тонкая',      dream: 'Снятся ангелы и иные существа', symbol: 'Волна' },
    ],
  };

  const list = forecasts[signKey] || forecasts['aries'];
  return list[seed % list.length];
}

function getCurrentSign(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return SIGNS[0];
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return SIGNS[1];
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return SIGNS[2];
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return SIGNS[3];
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return SIGNS[4];
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return SIGNS[5];
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return SIGNS[6];
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return SIGNS[7];
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return SIGNS[8];
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return SIGNS[9];
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return SIGNS[10];
  return SIGNS[11];
}

export default function MysticWidgets() {
  const today = new Date();
  const moon = getMoonPhase(today);
  const currentSign = getCurrentSign(today);

  const [expanded, setExpanded] = useState<'horoscope' | 'moon' | 'wise' | null>(null);
  const [selectedSign, setSelectedSign] = useState(currentSign);
  const [showSignPicker, setShowSignPicker] = useState(false);

  const forecast = getDreamForecast(selectedSign.key, today);
  const quote = getDailyQuote(today);

  return (
    <div className="max-w-3xl mx-auto px-3 md:px-4 pt-3 pb-1 flex flex-col gap-3">

      {/* Верхний ряд: Луна + Гороскоп */}
      <div className="flex gap-3">

      {/* Лунный календарь */}
      <div className="flex-1 glass border border-border/30 rounded-2xl px-4 py-3 cursor-pointer hover:border-primary/30 transition-all"
        onClick={() => setExpanded(expanded === 'moon' ? null : 'moon')}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{moon.emoji}</span>
            <div>
              <div className="text-xs text-muted-foreground font-raleway uppercase tracking-widest leading-none mb-0.5">Луна</div>
              <div className="text-sm font-raleway text-foreground font-medium">{moon.name} · {moon.day} день</div>
            </div>
          </div>
          <Icon name={expanded === 'moon' ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground flex-shrink-0" />
        </div>

        {expanded === 'moon' && (
          <div className="mt-3 pt-3 border-t border-border/20 space-y-2 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${moon.illumination}%` }} />
              </div>
              <span className="text-xs text-muted-foreground font-raleway">{moon.illumination}%</span>
            </div>
            <div className="text-xs text-muted-foreground font-raleway">
              {LUNAR_MEANINGS[moon.day] || 'День луны'}
            </div>
            <div className="text-xs text-primary/80 font-raleway italic">✦ {moon.advice}</div>
          </div>
        )}
      </div>

      {/* Гороскоп */}
      <div className="flex-1 glass border border-border/30 rounded-2xl px-4 py-3 cursor-pointer hover:border-primary/30 transition-all"
        onClick={() => { setExpanded(expanded === 'horoscope' ? null : 'horoscope'); setShowSignPicker(false); }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{selectedSign.emoji}</span>
            <div>
              <div className="text-xs text-muted-foreground font-raleway uppercase tracking-widest leading-none mb-0.5">Гороскоп снов</div>
              <div className="text-sm font-raleway text-foreground font-medium">{selectedSign.name} · {forecast.energy}</div>
            </div>
          </div>
          <Icon name={expanded === 'horoscope' ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground flex-shrink-0" />
        </div>

        {expanded === 'horoscope' && (
          <div className="mt-3 pt-3 border-t border-border/20 space-y-3 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="text-xs text-muted-foreground font-raleway">
              <span className="text-foreground/80">{forecast.dream}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-primary/80 font-raleway">
              <span className="text-muted-foreground">Символ ночи:</span>
              <span className="font-medium text-primary">✦ {forecast.symbol}</span>
            </div>

            {/* Смена знака */}
            <button
              className="text-xs text-muted-foreground hover:text-foreground font-raleway flex items-center gap-1.5 transition-colors"
              onClick={() => setShowSignPicker(!showSignPicker)}
            >
              <Icon name="RefreshCw" size={11} />
              Сменить знак
            </button>

            {showSignPicker && (
              <div className="grid grid-cols-6 gap-1.5 pt-1">
                {SIGNS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => { setSelectedSign(s); setShowSignPicker(false); }}
                    title={s.name}
                    className={`text-center py-1 rounded-lg text-base transition-all hover:bg-primary/20
                      ${selectedSign.key === s.key ? 'bg-primary/30 ring-1 ring-primary/50' : ''}`}
                  >
                    {s.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      </div>{/* конец верхнего ряда */}

      {/* Мудрая минутка */}
      <div
        className="glass border border-border/30 rounded-2xl px-4 py-3 cursor-pointer hover:border-primary/30 transition-all"
        onClick={() => setExpanded(expanded === 'wise' ? null : 'wise')}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl flex-shrink-0">💫</span>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground font-raleway uppercase tracking-widest leading-none mb-0.5">
                Мудрая минутка · {today.getDate()} число
              </div>
              <div className="text-sm font-raleway text-foreground font-medium truncate">
                {quote.text}
              </div>
            </div>
          </div>
          <Icon name={expanded === 'wise' ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground flex-shrink-0" />
        </div>

        {expanded === 'wise' && (
          <div className="mt-3 pt-3 border-t border-border/20 animate-fade-in-up">
            <p className="text-sm font-raleway text-foreground/90 leading-relaxed">
              ✦ {quote.text}
            </p>
            <p className="text-xs text-muted-foreground font-raleway mt-2">
              Совет #{quote.number} из 30 — меняется каждый день
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface WeatherData {
  temp: number;
  desc: string;
  icon: string;
  city: string;
  humidity: number;
  wind: number;
}

function getMoonPhase(date: Date): { name: string; emoji: string; day: number; illumination: number; advice: string } {
  const known = new Date(2000, 0, 6); // новолуние
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = 29.53058867;
  const day = ((diff % cycle) + cycle) % cycle;
  const illumination = Math.round(50 * (1 - Math.cos((2 * Math.PI * day) / cycle)));

  let name: string, emoji: string, advice: string;
  if (day < 1.5) { name = 'Новолуние'; emoji = '🌑'; advice = 'Время для новых намерений и планов'; }
  else if (day < 7.4) { name = 'Растущий серп'; emoji = '🌒'; advice = 'Сны вещие — обратите внимание на детали'; }
  else if (day < 9.9) { name = 'Первая четверть'; emoji = '🌓'; advice = 'Сны отражают внутренние противоречия'; }
  else if (day < 14.8) { name = 'Растущая луна'; emoji = '🌔'; advice = 'Энергия нарастает — сны яркие и насыщенные'; }
  else if (day < 16.3) { name = 'Полнолуние'; emoji = '🌕'; advice = 'Мощное время для толкования снов'; }
  else if (day < 21.2) { name = 'Убывающая луна'; emoji = '🌖'; advice = 'Сны помогают отпустить прошлое'; }
  else if (day < 23.7) { name = 'Последняя четверть'; emoji = '🌗'; advice = 'Время анализа и подведения итогов'; }
  else if (day < 28.0) { name = 'Убывающий серп'; emoji = '🌘'; advice = 'Сны уводят вглубь подсознания'; }
  else { name = 'Тёмная луна'; emoji = '🌑'; advice = 'Прислушайтесь к тишине внутри себя'; }

  return { name, emoji, day: Math.round(day) + 1, illumination, advice };
}

function getLunarDayMeaning(day: number): string {
  const meanings: Record<number, string> = {
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
  return meanings[day] || 'День луны';
}

const WEATHER_EMOJIS: Record<string, string> = {
  'ясно': '☀️', 'облачно': '☁️', 'пасмурно': '🌥️', 'дождь': '🌧️',
  'снег': '❄️', 'гроза': '⛈️', 'туман': '🌫️', 'морось': '🌦️',
};

function getWeatherEmoji(desc: string): string {
  const lower = desc.toLowerCase();
  for (const [key, emoji] of Object.entries(WEATHER_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🌤️';
}

export default function MysticWidgets() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);
  const [expanded, setExpanded] = useState<'weather' | 'moon' | null>(null);

  const today = new Date();
  const moon = getMoonPhase(today);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
          );
          const data = await res.json();
          const cur = data.current;
          const code = cur.weather_code;

          const getDesc = (c: number) => {
            if (c === 0) return 'Ясно';
            if (c <= 3) return 'Облачно';
            if (c <= 49) return 'Туман';
            if (c <= 59) return 'Морось';
            if (c <= 69) return 'Дождь';
            if (c <= 79) return 'Снег';
            if (c <= 99) return 'Гроза';
            return 'Переменно';
          };

          // Получаем название города через reverse geocoding
          let city = 'Ваш город';
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`
            );
            const geo = await geoRes.json();
            city = geo.address?.city || geo.address?.town || geo.address?.village || 'Ваш город';
          } catch { /* ignore */ }

          setWeather({
            temp: Math.round(cur.temperature_2m),
            desc: getDesc(code),
            icon: getWeatherEmoji(getDesc(code)),
            city,
            humidity: cur.relative_humidity_2m,
            wind: Math.round(cur.wind_speed_10m),
          });
        } catch {
          setWeatherError(true);
        } finally {
          setWeatherLoading(false);
        }
      },
      () => { setWeatherError(true); setWeatherLoading(false); }
    );
  }, []);

  const dreamWeatherAdvice = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes('ясно') || d.includes('солнечно')) return 'Ясная погода благоприятна для светлых снов';
    if (d.includes('дождь') || d.includes('морось')) return 'Дождь усиливает интуитивные сновидения';
    if (d.includes('гроза')) return 'Грозовая ночь — к пророческим снам';
    if (d.includes('снег')) return 'Снег несёт сны об очищении и покое';
    if (d.includes('туман')) return 'Туманная погода открывает мистические образы';
    return 'Природа шепчет тайны в ваши сны';
  };

  return (
    <div className="max-w-3xl mx-auto px-3 md:px-4 pt-3 pb-1 flex gap-3">
      {/* Погода */}
      <div
        className="flex-1 glass border border-border/30 rounded-2xl px-4 py-3 cursor-pointer hover:border-primary/30 transition-all"
        onClick={() => setExpanded(expanded === 'weather' ? null : 'weather')}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">
              {weatherLoading ? '⏳' : weatherError ? '🌤️' : weather?.icon}
            </span>
            <div>
              <div className="text-xs text-muted-foreground font-raleway uppercase tracking-widest leading-none mb-0.5">Погода</div>
              <div className="text-sm font-raleway text-foreground font-medium">
                {weatherLoading ? 'Определяю...' : weatherError ? 'Нет данных' : `${weather?.temp}° · ${weather?.desc}`}
              </div>
            </div>
          </div>
          <Icon name={expanded === 'weather' ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground flex-shrink-0" />
        </div>

        {expanded === 'weather' && (
          <div className="mt-3 pt-3 border-t border-border/20 space-y-2 animate-fade-in-up">
            {weather && !weatherError && (
              <>
                <div className="text-xs text-muted-foreground font-raleway flex items-center gap-1.5">
                  <Icon name="MapPin" size={11} />{weather.city}
                </div>
                <div className="flex gap-4 text-xs font-raleway text-muted-foreground">
                  <span>💧 Влажность {weather.humidity}%</span>
                  <span>💨 Ветер {weather.wind} км/ч</span>
                </div>
              </>
            )}
            <div className="text-xs text-primary/80 font-raleway italic">
              ✦ {weather && !weatherError ? dreamWeatherAdvice(weather.desc) : 'Погода влияет на глубину и яркость снов'}
            </div>
          </div>
        )}
      </div>

      {/* Лунный календарь */}
      <div
        className="flex-1 glass border border-border/30 rounded-2xl px-4 py-3 cursor-pointer hover:border-primary/30 transition-all"
        onClick={() => setExpanded(expanded === 'moon' ? null : 'moon')}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{moon.emoji}</span>
            <div>
              <div className="text-xs text-muted-foreground font-raleway uppercase tracking-widest leading-none mb-0.5">Луна</div>
              <div className="text-sm font-raleway text-foreground font-medium">
                {moon.name} · {moon.day} день
              </div>
            </div>
          </div>
          <Icon name={expanded === 'moon' ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground flex-shrink-0" />
        </div>

        {expanded === 'moon' && (
          <div className="mt-3 pt-3 border-t border-border/20 space-y-2 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/60 transition-all"
                  style={{ width: `${moon.illumination}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-raleway">{moon.illumination}%</span>
            </div>
            <div className="text-xs text-muted-foreground font-raleway">
              {getLunarDayMeaning(moon.day)}
            </div>
            <div className="text-xs text-primary/80 font-raleway italic">
              ✦ {moon.advice}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

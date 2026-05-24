import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ContactPageProps {
  onNavigate?: (page: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contacts = [
    { icon: 'Mail', label: 'Email', value: 'hello@morpheus.app', href: 'mailto:hello@morpheus.app' },
    { icon: 'MessageCircle', label: 'Telegram', value: '@morpheus_dreams', href: '#' },
    { icon: 'Instagram', label: 'Instagram', value: '@morpheus.dreams', href: '#' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="font-cormorant text-4xl md:text-5xl font-light text-foreground mb-3">
            Связаться с нами
          </h1>
          <div className="mystic-divider my-4" />
          <p className="text-muted-foreground font-raleway">
            Вопросы, предложения или просто хотите поделиться удивительным сном?
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact cards */}
          <div className="md:col-span-2 space-y-4">
            {contacts.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                className="glass border border-border/30 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition-all group animate-fade-in-up block"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <Icon name={c.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-raleway uppercase tracking-widest">{c.label}</div>
                  <div className="text-sm text-foreground font-raleway mt-0.5">{c.value}</div>
                </div>
                <Icon name="ArrowRight" size={16} className="text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>
            ))}

            <div className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-2xl mb-3">⏰</div>
              <h3 className="font-cormorant text-xl text-foreground mb-2">Время ответа</h3>
              <p className="text-sm text-muted-foreground font-raleway">Обычно отвечаем в течение 24 часов. Срочные вопросы — через Telegram.</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {sent ? (
              <div className="glass border border-primary/30 rounded-2xl p-10 text-center">
                <div className="text-6xl mb-4 animate-float">🌙</div>
                <h3 className="font-cormorant text-3xl text-foreground mb-3">Послание отправлено</h3>
                <p className="text-muted-foreground font-raleway text-sm">
                  Звёзды получили ваше сообщение. Мы ответим в течение 24 часов.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-6 glass border border-primary/30 text-primary hover:bg-primary/10 font-raleway text-sm px-6 py-2.5 rounded-xl transition-all"
                >
                  Написать ещё
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass border border-border/30 rounded-2xl p-6 space-y-4">
                <h2 className="font-cormorant text-2xl text-foreground mb-2">Написать сообщение</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-raleway uppercase tracking-widest mb-1.5 block">Имя</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Ваше имя"
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all font-raleway"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-raleway uppercase tracking-widest mb-1.5 block">Email</label>
                    <input
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      type="email"
                      placeholder="your@email.com"
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all font-raleway"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-raleway uppercase tracking-widest mb-1.5 block">Тема</label>
                  <input
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Тема обращения"
                    className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all font-raleway"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-raleway uppercase tracking-widest mb-1.5 block">Сообщение</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Ваше сообщение или описание сна..."
                    rows={5}
                    className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all font-raleway resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-raleway text-sm py-3 rounded-xl hover:bg-primary/80 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 animate-glow"
                >
                  <Icon name="Send" size={16} />
                  Отправить послание
                </button>
                <p className="text-xs text-muted-foreground font-raleway text-center">
                  Отправляя форму, вы соглашаетесь с{' '}
                  {onNavigate ? (
                    <button type="button" onClick={() => onNavigate('privacy')} className="text-primary underline hover:no-underline">
                      Политикой конфиденциальности
                    </button>
                  ) : 'Политикой конфиденциальности'}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
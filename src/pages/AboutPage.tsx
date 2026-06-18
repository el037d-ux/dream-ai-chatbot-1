const team = [
  {
    name: 'Архип Лунин',
    role: 'Основатель & Психолог',
    emoji: '🌙',
    bio: 'Практикующий психоаналитик с 12-летним опытом. Специализация — аналитическая психология Юнга.',
  },
  {
    name: 'Вера Звёздная',
    role: 'AI-исследователь',
    emoji: '✨',
    bio: 'PhD в нейронауках. Разработала алгоритм семантического анализа снов на основе архетипических паттернов.',
  },
  {
    name: 'Максим Глубин',
    role: 'Разработчик',
    emoji: '🔮',
    bio: 'Fullstack-разработчик, интегрирующий последние достижения ИИ в сферу психологии и мистики.',
  },
];

const values = [
  { icon: '🧠', title: 'Научная основа', desc: 'Каждое толкование базируется на проверенных психологических теориях Юнга и Фрейда' },
  { icon: '🔒', title: 'Приватность', desc: 'Ваши сны — только ваши. Полное шифрование и анонимность данных' },
  { icon: '✨', title: 'Глубина', desc: 'Не поверхностные гадания, а настоящий психологический анализ архетипов' },
  { icon: '🌌', title: 'Мистическое измерение', desc: 'Соединяем науку с древней мудростью толкования сновидений' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 pb-24" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="text-6xl mb-4 animate-float">🌙</div>
          <h1 className="font-cormorant text-4xl md:text-6xl font-light text-foreground mb-4">
            О СонникАИ
          </h1>
          <div className="mystic-divider my-6" />
          <p className="text-foreground/80 font-raleway text-lg leading-relaxed max-w-2xl mx-auto">
            СонникАИ — это мост между наукой и мистикой, созданный для тех, кто хочет понять скрытый язык своего подсознания.
          </p>
        </div>

        {/* Mission */}
        <div className="glass border border-primary/20 rounded-2xl p-8 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="font-cormorant text-3xl text-foreground mb-4">Наша миссия</h2>
          <p className="text-foreground/80 font-raleway leading-relaxed mb-4">
            Каждую ночь вы путешествуете в мир, где архетипы говорят на языке образов, где желания находят форму, а страхи обретают лицо. Мы создали СонникАИ, чтобы помочь вам расшифровать это послание.
          </p>
          <p className="text-foreground/70 font-raleway leading-relaxed">
            Используя глубинный психологический анализ Карла Юнга и Зигмунда Фрейда, наш ИИ преобразует ваши сны в ценные психологические инсайты, которые помогают лучше понять себя.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="glass border border-border/30 rounded-2xl p-5 animate-fade-in-up hover:border-primary/30 transition-all"
              style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
            >
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="font-cormorant text-xl text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground font-raleway leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="font-cormorant text-3xl text-center text-foreground mb-2">Команда</h2>
          <div className="mystic-divider mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div
                key={member.name}
                className="glass border border-border/30 rounded-2xl p-6 text-center hover:border-primary/30 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15 + 0.5}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-3xl mx-auto mb-4 animate-glow">
                  {member.emoji}
                </div>
                <h3 className="font-cormorant text-xl text-foreground mb-1">{member.name}</h3>
                <p className="text-xs text-primary font-raleway uppercase tracking-widest mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground font-raleway leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="mt-14 text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="mystic-divider mb-8" />
          <blockquote className="font-cormorant text-2xl md:text-3xl italic text-foreground/70 leading-relaxed">
            «Сон — это маленькая скрытая дверь в сокровенную глубину души»
          </blockquote>
          <p className="text-sm text-muted-foreground font-raleway mt-3">— Карл Густав Юнг</p>
        </div>
      </div>
    </div>
  );
}
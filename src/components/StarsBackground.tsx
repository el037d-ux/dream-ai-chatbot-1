import { useMemo } from 'react';

export default function StarsBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="stars-bg">
      {/* Nebula blobs */}
      <div
        className="nebula"
        style={{
          width: 600,
          height: 600,
          top: '-10%',
          left: '-10%',
          background: 'radial-gradient(circle, hsl(270 60% 35% / 0.4), transparent 70%)',
          animationDelay: '0s',
        }}
      />
      <div
        className="nebula"
        style={{
          width: 500,
          height: 500,
          bottom: '0%',
          right: '-5%',
          background: 'radial-gradient(circle, hsl(245 60% 30% / 0.35), transparent 70%)',
          animationDelay: '4s',
        }}
      />
      <div
        className="nebula"
        style={{
          width: 400,
          height: 400,
          top: '40%',
          left: '40%',
          background: 'radial-gradient(circle, hsl(290 50% 25% / 0.25), transparent 70%)',
          animationDelay: '2s',
        }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

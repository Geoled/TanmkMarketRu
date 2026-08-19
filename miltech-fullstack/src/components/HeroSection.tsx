'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Shield, Target, Zap, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const words = ['ТЕХНИКА', 'ВООРУЖЕНИЕ', 'ОБОРУДОВАНИЕ', 'ЗАПЧАСТИ'];

  // Typewriter effect
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentWord.substring(0, typedText.length + 1));
        if (typedText.length === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setTypedText(currentWord.substring(0, typedText.length - 1));
        if (typedText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentWordIndex]);

  // Radar/Scanner animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawRadar = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.4;

      // Draw concentric circles
      ctx.strokeStyle = 'rgba(72, 187, 120, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (maxRadius / 5) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw cross lines
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      // Draw rotating scanner line
      angle += 0.02;
      const gradient = ctx.createConicGradient(angle, centerX, centerY);
      gradient.addColorStop(0, 'rgba(72, 187, 120, 0)');
      gradient.addColorStop(0.8, 'rgba(72, 187, 120, 0)');
      gradient.addColorStop(1, 'rgba(72, 187, 120, 0.3)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, angle - Math.PI / 4, angle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Draw random blips (targets)
      const time = Date.now() * 0.001;
      for (let i = 0; i < 8; i++) {
        const blipAngle = (i / 8) * Math.PI * 2 + time * 0.1;
        const blipDistance = maxRadius * (0.3 + Math.sin(time + i) * 0.2);
        const blipX = centerX + Math.cos(blipAngle) * blipDistance;
        const blipY = centerY + Math.sin(blipAngle) * blipDistance;

        ctx.fillStyle = `rgba(237, 137, 54, ${0.5 + Math.sin(time * 2 + i) * 0.3})`;
        ctx.beginPath();
        ctx.arc(blipX, blipY, 3 + Math.sin(time * 3 + i) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(drawRadar);
    };

    drawRadar();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative h-[600px] overflow-hidden tactical-grid">
      {/* Radar Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-tactical-black/50 to-tactical-black" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          {/* Military Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-steel-gray/50 border border-radioactive-green/30 rounded backdrop-blur-sm hud-border-corner">
            <Shield className="w-5 h-5 text-radioactive-green animate-pulse-military" />
            <span className="text-radioactive-green font-mono text-sm tracking-wider">СИСТЕМА АКТИВНА</span>
          </div>

          {/* Main Headline with Typewriter */}
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            <span className="text-white">ВОЕННАЯ</span>
            <br />
            <span className="text-warning-orange glitch" data-text={typedText}>
              {typedText}
            </span>
            <span className="animate-pulse text-warning-orange">|</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-8 max-w-2xl font-light leading-relaxed">
            Единая платформа для приобретения специализированной техники, 
            вооружения и комплектующих. Проверенные поставщики. Гарантированное качество.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/create" className="btn-military btn-primary flex items-center gap-2">
              <Target className="w-5 h-5" />
              Разместить объявление
            </Link>
            <Link href="/map" className="btn-military flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Карта объектов
            </Link>
          </div>

          {/* Stats HUD */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-steel-gray/30 border border-steel-light p-4 hud-border-corner fade-in fade-in-delay-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-radioactive-green" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Объектов</span>
              </div>
              <div className="text-2xl font-display font-bold text-white">847</div>
            </div>

            <div className="bg-steel-gray/30 border border-steel-light p-4 hud-border-corner fade-in fade-in-delay-2">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-warning-orange" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Категорий</span>
              </div>
              <div className="text-2xl font-display font-bold text-white">6</div>
            </div>

            <div className="bg-steel-gray/30 border border-steel-light p-4 hud-border-corner fade-in fade-in-delay-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-alert-red" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Сделок</span>
              </div>
              <div className="text-2xl font-display font-bold text-white">1.2K</div>
            </div>

            <div className="bg-steel-gray/30 border border-steel-light p-4 hud-border-corner fade-in fade-in-delay-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-hud-cyan" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Онлайн</span>
              </div>
              <div className="text-2xl font-display font-bold text-white">342</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-radioactive-green/50 to-transparent" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-warning-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-radioactive-green/5 rounded-full blur-3xl" />
    </section>
  );
}

import { Shield, Github, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--bg-primary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* О проекте */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-[var(--accent)]" />
              <span className="text-xl font-bold text-white">MilTech</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Платформа для покупки и продажи военной техники, запчастей и оборудования.
              Надежность и безопасность каждой сделки.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <a href="/" className="hover:text-[var(--accent)] transition-colors">
                  Главная
                </a>
              </li>
              <li>
                <a href="/create" className="hover:text-[var(--accent)] transition-colors">
                  Создать объявление
                </a>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@miltech.com"
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="border-t border-[var(--bg-primary)] mt-8 pt-8 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            © {currentYear} MilTech. Все права защищены. 
            <span className="ml-2">🛡️ Защищено военным шифрованием</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

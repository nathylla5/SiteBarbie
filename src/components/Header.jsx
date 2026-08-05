import React from 'react';
import { Volume2, VolumeX, LogOut, Sun, Moon } from 'lucide-react';

export default function Header({ user, onLogout, isPlayingMusic, toggleMusic, theme, toggleTheme }) {
  return (
    <header className="site-header">
      <div className="header-content">
        <div className="logo-container" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            id="logoBarbie" 
            src="/images/logoBarbie.png" 
            alt="Barbie Logo" 
            className="logo-img" 
          />
        </div>

        <nav className="header-nav">
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            className={`nav-btn ${isPlayingMusic ? 'active' : ''}`}
            onClick={toggleMusic}
            title={isPlayingMusic ? "Pausar Música da Barbie" : "Tocar Música da Barbie"}
          >
            {isPlayingMusic ? <Volume2 size={18} className="sparkle-icon" /> : <VolumeX size={18} />}
            <span>{isPlayingMusic ? "Tocando" : "Música Tema"}</span>
          </button>

          <a 
            href="https://www.jogos360.com.br/barbie/" 
            target="_blank" 
            rel="noreferrer noopener"
            className="nav-btn"
            title="Jogos da Barbie"
          >
            <img src="/images/IconGame.png" alt="Jogos" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            <span>Jogos</span>
          </a>

          {user && (
            <button className="nav-btn" onClick={onLogout} title="Sair da Conta">
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

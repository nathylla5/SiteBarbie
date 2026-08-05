import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import MovieCard from './components/MovieCard';
import VideoModal from './components/VideoModal';
import ProgressBar from './components/ProgressBar';
import KanbanBoard from './components/KanbanBoard';
import { MOVIES } from './data/movies';
import { CHRONOLOGIES } from './data/chronologies';
import { Search, Sparkles, LayoutGrid, Kanban, Film, Info } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Active View Mode: 'catalog' or 'kanban'
  const [viewMode, setViewMode] = useState('catalog');

  // Active Chronology Tab
  const [activeChronology, setActiveChronology] = useState('lancamento');

  // Watched Movies State
  const [watchedIds, setWatchedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('barbie_watched_movies');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Kanban Board State
  const [kanbanState, setKanbanState] = useState(() => {
    try {
      const saved = localStorage.getItem('barbie_kanban_board');
      return saved ? JSON.parse(saved) : { wantToWatch: [], watching: [], completed: [] };
    } catch (e) {
      return { wantToWatch: [], watching: [], completed: [] };
    }
  });

  // Theme Management (Light / Dark mode)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('barbie_theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const audioRef = useRef(null);

  // Persist Watched Movies
  useEffect(() => {
    localStorage.setItem('barbie_watched_movies', JSON.stringify(watchedIds));
  }, [watchedIds]);

  // Persist Kanban Board
  useEffect(() => {
    localStorage.setItem('barbie_kanban_board', JSON.stringify(kanbanState));
  }, [kanbanState]);

  // Apply Theme Data Attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('barbie_theme', newTheme);
  };

  // Toggle Watched Status
  const toggleWatched = (movieId) => {
    setWatchedIds(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
  };

  // Check login session on mount
  useEffect(() => {
    const loggedUser = localStorage.getItem('barbie_logged_in');
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  // Handle music toggle
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((err) => {
        console.warn('Audio play error:', err);
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('barbie_logged_in');
    setUser(null);
  };

  // Get active chronology metadata
  const activeChronologyObj = CHRONOLOGIES.find(c => c.id === activeChronology) || CHRONOLOGIES[0];

  // Filter & Sort movies based on search, category and selected chronology order
  const filteredMovies = MOVIES.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === 'all') return matchesSearch;
    if (categoryFilter === 'disponiveis') return matchesSearch && Boolean(movie.videoUrl);
    return matchesSearch && movie.category === categoryFilter;
  }).sort((a, b) => {
    const orderA = a.order?.[activeChronology] ?? 999;
    const orderB = b.order?.[activeChronology] ?? 999;
    return orderA - orderB;
  });

  if (!user) {
    return (
      <div className="app-container">
        <AuthModal 
          onLoginSuccess={(email) => setUser(email)} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </div>
    );
  }

  return (
    <div className="app-container fade-in">
      <audio 
        ref={audioRef} 
        src="/media/Barbie_Life_in_the_Dreamhouse_Opening_3_ypXwI6X.mp3" 
        loop 
      />

      <Header 
        user={user} 
        onLogout={handleLogout} 
        isPlayingMusic={isPlayingMusic} 
        toggleMusic={toggleMusic} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="main-content">
        {/* Progress Bar Header */}
        <ProgressBar 
          watchedCount={watchedIds.length} 
          totalCount={MOVIES.length} 
        />

        {/* View Switcher (Catálogo vs Kanban) */}
        <div className="view-mode-bar">
          <button 
            className={`view-mode-btn ${viewMode === 'catalog' ? 'active' : ''}`}
            onClick={() => setViewMode('catalog')}
          >
            <LayoutGrid size={18} />
            <span>Catálogo & Cronologias</span>
          </button>

          <button 
            className={`view-mode-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
          >
            <Kanban size={18} />
            <span>Modo Kanban (Minha Maratona)</span>
          </button>
        </div>

        {viewMode === 'catalog' ? (
          <>
            {/* Chronology Selector Tabs */}
            <section className="chronology-section">
              <div className="chronology-tabs">
                {CHRONOLOGIES.map(chrono => (
                  <button
                    key={chrono.id}
                    className={`chrono-tab ${activeChronology === chrono.id ? 'active' : ''}`}
                    onClick={() => setActiveChronology(chrono.id)}
                  >
                    <span>{chrono.shortTitle}</span>
                  </button>
                ))}
              </div>

              {/* Active Chronology Summary Header */}
              <div className="chronology-summary-card fade-in">
                <div className="summary-badge">
                  <Sparkles size={16} />
                  <span>{activeChronologyObj.badge}</span>
                </div>
                <h2>{activeChronologyObj.title}</h2>
                <p>{activeChronologyObj.summary}</p>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="search-filter-bar">
                <div className="search-box">
                  <Search className="search-icon" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar por título de filme..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>

                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todas as Categorias ({MOVIES.length})</option>
                  <option value="disponiveis">Disponíveis ({MOVIES.filter(m => m.videoUrl).length})</option>
                  <option value="Clássicos">Clássicos</option>
                  <option value="Fadas & Magia">Fadas & Magia</option>
                  <option value="Musicais">Musicais</option>
                  <option value="Princesas">Princesas</option>
                  <option value="Sereias">Sereias</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Modernos">Modernos</option>
                </select>
              </div>
            </section>

            {/* Movies Grid */}
            {filteredMovies.length > 0 ? (
              <div className="movie-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onSelectMovie={(m) => setSelectedMovie(m)} 
                    isWatched={watchedIds.includes(movie.id)}
                    onToggleWatched={toggleWatched}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>Nenhum filme encontrado nesta categoria ou cronologia!</h3>
                <p>Tente ajustar seu termo de busca ou selecionar outra aba de cronologia.</p>
              </div>
            )}
          </>
        ) : (
          /* Kanban Board View */
          <KanbanBoard 
            movies={MOVIES}
            kanbanState={kanbanState}
            setKanbanState={setKanbanState}
            onSelectMovie={(m) => setSelectedMovie(m)}
            toggleWatched={toggleWatched}
            watchedIds={watchedIds}
          />
        )}
      </main>

      <VideoModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />

      <footer className="site-footer">
        <p>© Barbie's World — Feito com amor e magia por Barbie Programadora ✨</p>
      </footer>
    </div>
  );
}

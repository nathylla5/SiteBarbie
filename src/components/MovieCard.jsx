import React from 'react';
import { Play, Star, CheckCircle2, Heart, Clock } from 'lucide-react';

export default function MovieCard({ movie, onSelectMovie, isWatched, onToggleWatched }) {
  const hasStream = Boolean(movie.videoUrl);

  return (
    <div className={`movie-card fade-in ${isWatched ? 'watched-card' : ''}`}>
      <div className="poster-wrapper">
        <img 
          src={movie.image} 
          alt={movie.title} 
          className="movie-poster"
          loading="lazy" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/logoBarbie.png';
          }}
        />

        {/* Watched Badge Overlay */}
        {isWatched && (
          <div className="watched-badge">
            <CheckCircle2 size={14} color="#ffffff" fill="var(--glow-pink)" />
            <span>Assistido</span>
          </div>
        )}

        {hasStream && !isWatched && (
          <div className="stream-badge">
            <Play size={12} fill="white" /> Assistir
          </div>
        )}

        {/* Play Overlay */}
        <div className="play-overlay" onClick={() => onSelectMovie(movie)}>
          <div className="play-btn-circle">
            <Play size={26} fill="var(--dark-pink)" style={{ marginLeft: '4px' }} />
          </div>
        </div>
      </div>

      <div className="movie-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        
        <div className="movie-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{movie.year}</span>
            {movie.duration && (
              <span style={{ opacity: 0.8, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                • <Clock size={11} /> {movie.duration}
              </span>
            )}
          </span>

          {/* Toggle Watched Checkbox Button */}
          <button 
            type="button"
            className={`watched-toggle-btn ${isWatched ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatched(movie.id);
            }}
            title={isWatched ? "Marcar como Não Assistido" : "Marcar como Assistido"}
          >
            <Heart size={16} fill={isWatched ? "var(--glow-pink)" : "none"} color={isWatched ? "var(--glow-pink)" : "var(--primary-pink)"} />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Play, ArrowLeft, ArrowRight, Check, Plus, Film, Trash2, Heart } from 'lucide-react';

export default function KanbanBoard({ movies, kanbanState, setKanbanState, onSelectMovie, toggleWatched, watchedIds }) {
  // Columns definition
  const columns = [
    { id: 'wantToWatch', title: 'Quero Assistir', color: '#3b82f6', icon: '✨' },
    { id: 'watching', title: 'Assistindo', color: '#eab308', icon: '🍿' },
    { id: 'completed', title: 'Concluídos / Minha Cronologia', color: '#22c55e', icon: '👑' }
  ];

  // Helper to move item to a specific column
  const moveMovie = (movieId, targetCol) => {
    setKanbanState(prev => {
      const newState = { ...prev };
      // Remove from all columns
      Object.keys(newState).forEach(col => {
        newState[col] = newState[col].filter(id => id !== movieId);
      });
      // Add to target column
      if (targetCol) {
        newState[targetCol] = [...newState[targetCol], movieId];
      }
      return newState;
    });

    // Automatically mark as watched if moved to 'completed'
    if (targetCol === 'completed' && !watchedIds.includes(movieId)) {
      toggleWatched(movieId);
    }
  };

  const removeFromKanban = (movieId) => {
    moveMovie(movieId, null);
  };

  // Find movies not currently assigned to any kanban column
  const assignedIds = new Set([
    ...(kanbanState.wantToWatch || []),
    ...(kanbanState.watching || []),
    ...(kanbanState.completed || [])
  ]);

  const unassignedMovies = movies.filter(m => !assignedIds.has(m.id));

  return (
    <div className="kanban-wrapper fade-in">
      <div className="kanban-header">
        <h2>📋 Quadro Kanban - Personalize sua Cronologia</h2>
        <p>Organize seus filmes da Barbie em colunas de maratona personalizadas.</p>
        
        {/* Quick Add Dropdown for unassigned movies */}
        {unassignedMovies.length > 0 && (
          <div className="kanban-add-bar">
            <span>Adicionar ao Quadro: </span>
            <select 
              className="kanban-add-select"
              onChange={(e) => {
                if (e.target.value) {
                  moveMovie(e.target.value, 'wantToWatch');
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Selecione um filme para adicionar...</option>
              {unassignedMovies.map(m => (
                <option key={m.id} value={m.id}>{m.title} ({m.year})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="kanban-columns">
        {columns.map(col => {
          const colMovieIds = kanbanState[col.id] || [];
          const colMovies = colMovieIds.map(id => movies.find(m => m.id === id)).filter(Boolean);

          return (
            <div key={col.id} className="kanban-column">
              <div className="column-header" style={{ borderTopColor: col.color }}>
                <h3>
                  <span>{col.icon}</span>
                  <span>{col.title}</span>
                </h3>
                <span className="column-count">{colMovies.length}</span>
              </div>

              <div className="column-cards">
                {colMovies.length > 0 ? (
                  colMovies.map(movie => (
                    <div key={movie.id} className="kanban-card">
                      <div className="kanban-card-top">
                        <img 
                          src={movie.image} 
                          alt={movie.title} 
                          className="kanban-card-poster"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/logoBarbie.png';
                          }}
                        />
                        <div className="kanban-card-info">
                          <h4>{movie.title}</h4>
                          <span className="kanban-card-year">{movie.year} • {movie.duration}</span>
                          {movie.videoUrl && (
                            <button 
                              className="kanban-play-btn" 
                              onClick={() => onSelectMovie(movie)}
                              title="Assistir agora"
                            >
                              <Play size={12} fill="white" /> Play
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Move Actions */}
                      <div className="kanban-card-actions">
                        {col.id !== 'wantToWatch' && (
                          <button 
                            onClick={() => moveMovie(movie.id, col.id === 'completed' ? 'watching' : 'wantToWatch')}
                            title="Mover para coluna anterior"
                            className="kanban-move-btn"
                          >
                            <ArrowLeft size={14} />
                          </button>
                        )}

                        <button 
                          onClick={() => removeFromKanban(movie.id)}
                          title="Remover do Quadro"
                          className="kanban-remove-btn"
                        >
                          <Trash2 size={14} />
                        </button>

                        {col.id !== 'completed' && (
                          <button 
                            onClick={() => moveMovie(movie.id, col.id === 'wantToWatch' ? 'watching' : 'completed')}
                            title="Mover para próxima coluna"
                            className="kanban-move-btn"
                          >
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-column-placeholder">
                    Nenhum filme nesta coluna
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

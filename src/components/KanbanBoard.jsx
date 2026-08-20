import React, { useState } from 'react';
import { 
  Play, ArrowLeft, ArrowRight, Check, Plus, Film, Trash2, 
  Heart, Layers, Search, CheckSquare, Square, Sparkles, X 
} from 'lucide-react';

export default function KanbanBoard({ 
  movies, 
  kanbanState, 
  setKanbanState, 
  onSelectMovie, 
  toggleWatched, 
  watchedIds 
}) {
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchSearch, setBatchSearch] = useState('');
  const [batchCategory, setBatchCategory] = useState('all');
  const [selectedMovieIds, setSelectedMovieIds] = useState([]);

  // Definição das colunas
  const columns = [
    { id: 'wantToWatch', title: 'Quero Assistir', color: '#3b82f6', icon: '✨' },
    { id: 'watching', title: 'Assistindo Agora', color: '#eab308', icon: '🍿' },
    { id: 'completed', title: 'Concluídos / Minha Cronologia', color: '#22c55e', icon: '👑' }
  ];

  // Helper para mover filme de coluna
  const moveMovie = (movieId, targetCol) => {
    setKanbanState(prev => {
      const newState = {
        wantToWatch: (prev.wantToWatch || []).filter(id => id !== movieId),
        watching: (prev.watching || []).filter(id => id !== movieId),
        completed: (prev.completed || []).filter(id => id !== movieId)
      };

      if (targetCol) {
        newState[targetCol] = [...(newState[targetCol] || []), movieId];
      }
      return newState;
    });

    // Se mover para 'completed', marca como assistido
    if (targetCol === 'completed' && !watchedIds.includes(movieId)) {
      toggleWatched(movieId);
    }
  };

  const removeFromKanban = (movieId) => {
    moveMovie(movieId, null);
  };

  // IDs já alocados em alguma coluna
  const assignedIds = new Set([
    ...(kanbanState.wantToWatch || []),
    ...(kanbanState.watching || []),
    ...(kanbanState.completed || [])
  ]);

  const unassignedMovies = movies.filter(m => !assignedIds.has(m.id));

  // Filmes filtrados para o modal de seleção em lote
  const modalAvailableMovies = unassignedMovies.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(batchSearch.toLowerCase());
    const matchesCategory = batchCategory === 'all' || m.category === batchCategory;
    return matchesSearch && matchesCategory;
  });

  // Alternar seleção de um filme no lote
  const toggleBatchSelect = (movieId) => {
    setSelectedMovieIds(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
  };

  // Selecionar todos os visíveis no modal
  const handleSelectAllVisible = () => {
    const visibleIds = modalAvailableMovies.map(m => m.id);
    setSelectedMovieIds(Array.from(new Set([...selectedMovieIds, ...visibleIds])));
  };

  // Desmarcar todos
  const handleDeselectAll = () => {
    setSelectedMovieIds([]);
  };

  // Confirmar adição em lote para 'wantToWatch'
  const handleConfirmBatchAdd = () => {
    if (selectedMovieIds.length === 0) return;

    setKanbanState(prev => {
      const existingWant = prev.wantToWatch || [];
      const newItems = selectedMovieIds.filter(id => !existingWant.includes(id));
      return {
        ...prev,
        wantToWatch: [...existingWant, ...newItems]
      };
    });

    setSelectedMovieIds([]);
    setShowBatchModal(false);
  };

  // Adicionar TODOS os filmes do catálogo de uma vez para 'Quero Assistir'
  const handleAddAllToWantToWatch = () => {
    const allIds = movies.map(m => m.id);
    setKanbanState(prev => {
      const alreadyInOther = new Set([...(prev.watching || []), ...(prev.completed || [])]);
      const newToWant = allIds.filter(id => !alreadyInOther.has(id));
      return {
        ...prev,
        wantToWatch: newToWant
      };
    });
  };

  return (
    <div className="kanban-wrapper fade-in">
      <div className="kanban-header">
        <h2>📋 Quadro Kanban - Personalize sua Maratona</h2>
        <p>Organize seus filmes da Barbie e acompanhe sua maratona em tempo real.</p>
        
        {/* Barra de Ações Rápidas */}
        <div className="kanban-actions-toolbar">
          <button 
            className="kanban-batch-btn pulse-button"
            onClick={() => {
              setSelectedMovieIds([]);
              setShowBatchModal(true);
            }}
          >
            <Layers size={17} />
            <span>Selecionar Filmes em Lote ({unassignedMovies.length} disponíveis)</span>
          </button>

          {unassignedMovies.length > 0 && (
            <button 
              className="kanban-add-all-btn"
              onClick={handleAddAllToWantToWatch}
              title="Adicionar todos os filmes restantes para 'Quero Assistir'"
            >
              <Sparkles size={16} />
              <span>Adicionar Todos ({unassignedMovies.length})</span>
            </button>
          )}

          {/* Seletor Individual Rápido */}
          {unassignedMovies.length > 0 && (
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
              <option value="" disabled>+ Adicionar filme individual...</option>
              {unassignedMovies.map(m => (
                <option key={m.id} value={m.id}>{m.title} ({m.year})</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Colunas do Kanban */}
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
                          
                          {/* Botão de Assistir que move automaticamente para Assistindo Agora */}
                          <button 
                            className="kanban-play-btn" 
                            onClick={() => onSelectMovie(movie)}
                            title="Assistir agora (move automaticamente para 'Assistindo Agora')"
                          >
                            <Play size={13} fill="white" />
                            <span>{col.id === 'watching' ? 'Continuar' : 'Assistir'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Ações de Mover de Coluna */}
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

      {/* MODAL DE SELEÇÃO EM LOTE */}
      {showBatchModal && (
        <div className="modal-overlay fade-in" onClick={() => setShowBatchModal(false)}>
          <div className="batch-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="batch-modal-header">
              <div className="batch-header-title">
                <Layers size={22} className="sparkle-icon" />
                <h3>Selecionar Filmes para Quero Assistir</h3>
              </div>
              <button 
                className="close-modal-btn" 
                onClick={() => setShowBatchModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Filtros do Modal */}
            <div className="batch-modal-filters">
              <div className="batch-search-box">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Buscar filmes por título..." 
                  value={batchSearch}
                  onChange={(e) => setBatchSearch(e.target.value)}
                  className="batch-search-input"
                />
              </div>

              <select 
                value={batchCategory} 
                onChange={(e) => setBatchCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Clássicos">Clássicos</option>
                <option value="Fadas & Magia">Fadas & Magia</option>
                <option value="Musicais">Musicais</option>
                <option value="Princesas">Princesas</option>
                <option value="Sereias">Sereias</option>
                <option value="Aventura">Aventura</option>
                <option value="Modernos">Modernos</option>
              </select>
            </div>

            {/* Barra de Ações Rápidas de Seleção */}
            <div className="batch-selection-toolbar">
              <button 
                className="batch-tool-btn" 
                onClick={handleSelectAllVisible}
              >
                <CheckSquare size={16} />
                <span>Marcar Todos Visíveis ({modalAvailableMovies.length})</span>
              </button>
              <button 
                className="batch-tool-btn" 
                onClick={handleDeselectAll}
                disabled={selectedMovieIds.length === 0}
              >
                <Square size={16} />
                <span>Desmarcar Todos</span>
              </button>
              <span className="batch-count-tag">
                {selectedMovieIds.length} selecionado(s)
              </span>
            </div>

            {/* Grid de Seleção de Filmes */}
            <div className="batch-movies-list">
              {modalAvailableMovies.length > 0 ? (
                modalAvailableMovies.map(movie => {
                  const isSelected = selectedMovieIds.includes(movie.id);
                  return (
                    <div 
                      key={movie.id} 
                      className={`batch-movie-item ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => toggleBatchSelect(movie.id)}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => {}} // tratado no clique do card
                        className="batch-checkbox"
                      />
                      <img 
                        src={movie.image} 
                        alt={movie.title} 
                        className="batch-movie-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/logoBarbie.png';
                        }}
                      />
                      <div className="batch-movie-info">
                        <h4>{movie.title}</h4>
                        <span>{movie.year} • {movie.category}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-batch-notice">
                  {unassignedMovies.length === 0 
                    ? "✨ Todos os filmes do catálogo já foram adicionados ao seu quadro!" 
                    : "Nenhum filme encontrado com os filtros atuais."}
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="batch-modal-footer">
              <button 
                className="batch-cancel-btn" 
                onClick={() => setShowBatchModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="batch-confirm-btn"
                onClick={handleConfirmBatchAdd}
                disabled={selectedMovieIds.length === 0}
              >
                <Plus size={18} />
                <span>Adicionar {selectedMovieIds.length} Filme(s) a 'Quero Assistir' 💖</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

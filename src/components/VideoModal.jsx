import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Film, Sparkles, Loader2, CheckCircle, Clock, Heart, 
  ExternalLink, Eye, Play
} from 'lucide-react';
import { apiService } from '../services/api';

export default function VideoModal({ 
  movie, 
  onClose, 
  user = null, 
  isWatched = false,
  onToggleWatched = () => {},
  kanbanState = { wantToWatch: [], watching: [], completed: [] },
  setKanbanState = () => {}
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Checagem de URL válida
  const rawVideoUrl = movie?.videoUrl;
  const hasValidVideo = Boolean(
    rawVideoUrl && 
    rawVideoUrl !== 'null' && 
    rawVideoUrl !== 'undefined' && 
    String(rawVideoUrl).trim().length > 5
  );

  // Determinar status atual no Kanban
  const currentStage = useMemo(() => {
    if (!movie) return 'wantToWatch';
    if (isWatched || kanbanState.completed?.includes(movie.id)) return 'completed';
    if (kanbanState.watching?.includes(movie.id)) return 'watching';
    return 'wantToWatch';
  }, [movie, isWatched, kanbanState]);

  // URL estável para o iframe
  const videoSrc = useMemo(() => {
    if (!hasValidVideo || !rawVideoUrl) return '';
    let url = String(rawVideoUrl).trim();
    const sep = url.includes('?') ? '&' : '?';

    // Para YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return `${url}${sep}autoplay=1&playsinline=1`;
    }

    // Para Archive.org
    if (url.includes('archive.org')) {
      return `${url}${sep}autoplay=1`;
    }

    // Para Vimeo
    if (url.includes('vimeo.com')) {
      return `${url}${sep}autoplay=1`;
    }

    // Padrão (Google Drive e outros)
    if (!url.includes('autoplay=')) {
      return `${url}${sep}autoplay=1`;
    }
    return url;
  }, [hasValidVideo, rawVideoUrl]);

  // Reset loading on movie change
  useEffect(() => {
    if (movie) {
      setIsLoading(true);
    }
  }, [movie?.id]);

  // Atalho ESC
  useEffect(() => {
    if (!movie) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [movie, onClose]);

  // Mover de estágio na maratona
  const handleSetStage = (targetStage) => {
    if (!movie) return;

    setKanbanState(prev => {
      const newState = {
        wantToWatch: (prev.wantToWatch || []).filter(id => id !== movie.id),
        watching: (prev.watching || []).filter(id => id !== movie.id),
        completed: (prev.completed || []).filter(id => id !== movie.id)
      };

      newState[targetStage] = [...(newState[targetStage] || []), movie.id];

      try {
        localStorage.setItem('barbie_kanban_board', JSON.stringify(newState));
      } catch (e) {}

      return newState;
    });

    if (targetStage === 'completed' && !isWatched) {
      onToggleWatched(movie.id);
      showToast('🎉 Parabéns! Filme concluído e adicionado à sua lista de assistidos!');
    } else if (targetStage === 'watching') {
      showToast('🍿 Filme marcado como "Assistindo Agora"');
    } else {
      showToast('✨ Filme movido para "Quero Assistir"');
    }

    if (user) {
      const userId = user.id || user.email || user;
      apiService.updateUserProgress(userId, movie.id, targetStage === 'completed', targetStage).catch(() => {});
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!movie) return null;

  const modalJSX = (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-content single-player-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2 className="modal-title">
              <Film size={22} className="sparkle-icon" />
              <span>{movie.title} ({movie.year})</span>
            </h2>
            <span className="movie-duration-tag">{movie.duration || '85 min'}</span>
          </div>

          <button className="close-modal-btn" onClick={onClose} title="Fechar Player (ESC)">
            <X size={22} />
          </button>
        </div>

        {/* Video Container */}
        <div className="video-container">
          {hasValidVideo ? (
            <>
              {/* Loader overlay */}
              {isLoading && (
                <div className="video-loader fade-in">
                  <Loader2 size={50} className="spinner-icon" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={20} style={{ color: 'var(--gold-accent)' }} />
                    <h3 style={{ fontSize: '1.15rem', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                      Preparando a mágica... O filme já vai começar!
                    </h3>
                    <Sparkles size={20} style={{ color: 'var(--gold-accent)' }} />
                  </div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    Carregando transmissão
                  </p>
                </div>
              )}

              {/* Toast de Notificação */}
              {toastMessage && (
                <div className="video-toast fade-in">
                  <Sparkles size={16} style={{ color: 'var(--gold-accent)' }} />
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* Player Iframe Principal */}
              <iframe
                className="video-iframe"
                src={videoSrc}
                title={movie.title}
                onLoad={() => setIsLoading(false)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
              ></iframe>
            </>
          ) : (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <Sparkles size={48} style={{ marginBottom: '1rem', color: 'var(--gold-accent)' }} />
              <h3>Este filme faz parte do catálogo de clássicos da Barbie!</h3>
              <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
                O link de transmissão para este título em breve estará disponível.
              </p>
            </div>
          )}
        </div>

        {/* Barra de Status da Maratona */}
        <div className="marathon-stage-bar">
          <div className="stage-info-group">
            <span className="stage-label">Status da Maratona:</span>
            <div className="stage-pills-group">
              <button 
                className={`stage-pill ${currentStage === 'wantToWatch' ? 'is-active' : ''}`}
                onClick={() => handleSetStage('wantToWatch')}
                title="Mover para Quero Assistir"
              >
                ✨ Quero Assistir
              </button>

              <button 
                className={`stage-pill watching-pill ${currentStage === 'watching' ? 'is-active' : ''}`}
                onClick={() => handleSetStage('watching')}
                title="Marcar como Assistindo Agora"
              >
                🍿 Assistindo Agora
              </button>

              <button 
                className={`stage-pill completed-pill ${currentStage === 'completed' ? 'is-active' : ''}`}
                onClick={() => handleSetStage('completed')}
                title="Marcar como Concluído / Assistido"
              >
                👑 Concluído {isWatched && '✓'}
              </button>
            </div>
          </div>

          <div className="stage-actions-group">
            {currentStage !== 'completed' ? (
              <button 
                className="complete-movie-btn"
                onClick={() => handleSetStage('completed')}
                title="Marcar filme como concluído na maratona"
              >
                <CheckCircle size={16} />
                <span>Terminei de Assistir ✨</span>
              </button>
            ) : (
              <div className="completed-badge-tag">
                <CheckCircle size={16} />
                <span>Assistido com Sucesso</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Description */}
        <div className="modal-body">
          <p className="modal-description">
            {movie.description || 'Assista a esta mágica história e reviva os clássicos inesquecíveis do universo Barbie.'}
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}

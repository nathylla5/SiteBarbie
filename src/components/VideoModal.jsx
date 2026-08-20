import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Film, Sparkles, Loader2 } from 'lucide-react';

export default function VideoModal({ movie, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (movie) {
      setIsLoading(true);
    }
  }, [movie?.id]);

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

  if (!movie) return null;

  const modalJSX = (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Film size={22} className="sparkle-icon" />
            <span>{movie.title} ({movie.year})</span>
          </h2>
          <button className="close-modal-btn" onClick={onClose} title="Fechar Player">
            <X size={22} />
          </button>
        </div>

        <div className="video-container">
          {movie.videoUrl ? (
            <>
              {/* Loader overlay displayed until iframe completes loading */}
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
                    Carregando player de transmissão
                  </p>
                </div>
              )}

              <iframe
                className="video-iframe"
                src={movie.videoUrl}
                title={movie.title}
                onLoad={() => setIsLoading(false)}
                style={{
                  opacity: isLoading ? 0 : 1,
                  transition: 'opacity 0.4s ease-in-out'
                }}
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

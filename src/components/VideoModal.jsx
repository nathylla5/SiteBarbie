import React, { useEffect } from 'react';
import { X, Film, Sparkles } from 'lucide-react';

export default function VideoModal({ movie, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  return (
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
            <iframe
              className="video-iframe"
              src={movie.videoUrl}
              title={movie.title}
              allowFullScreen
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
            ></iframe>
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
}

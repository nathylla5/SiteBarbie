import React from 'react';
import { Sparkles, CheckCircle2, Heart } from 'lucide-react';

export default function ProgressBar({ watchedCount, totalCount }) {
  const percentage = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  return (
    <div className="progress-container fade-in">
      <div className="progress-header">
        <div className="progress-title">
          <Heart size={20} fill="var(--glow-pink)" color="var(--glow-pink)" className="sparkle-icon" />
          <span>Progresso da Maratona Barbie</span>
        </div>
        <div className="progress-badge">
          <CheckCircle2 size={16} color="var(--gold-accent)" />
          <span>Você assistiu <strong>{watchedCount}</strong> de <strong>{totalCount}</strong> filmes ({percentage}%)</span>
        </div>
      </div>

      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        >
          {percentage > 5 && (
            <span className="progress-percentage-text">{percentage}%</span>
          )}
        </div>
      </div>
    </div>
  );
}

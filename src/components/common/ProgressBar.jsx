import React from 'react';

export function ProgressBar({ value = 0, max = 100, height = 6, color = 'var(--accent-primary)', showLabel = false }) {
  const percentage = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <div className="progress-container">
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>Progress</span>
          <span className="font-mono font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height }}>
        <div 
          className="progress-fill" 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color 
          }} 
        />
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, actionText, onAction, secondaryActionText, onSecondaryAction }) {
  return (
    <div className="empty-state-card">
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={24} />
        </div>
      )}
      <h4 className="empty-state-title">{title}</h4>
      {description && <p className="empty-state-desc">{description}</p>}
      {(actionText || secondaryActionText) && (
        <div className="empty-state-actions">
          {actionText && (
            <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
              {actionText}
            </button>
          )}
          {secondaryActionText && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={onSecondaryAction}>
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function Badge({ variant = 'neutral', children, className = '', icon: Icon }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

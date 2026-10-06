import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, badge, accentColor }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {Icon && (
          <div 
            className="stat-card-icon-wrapper" 
            style={{ 
              backgroundColor: accentColor ? `rgba(${accentColor}, 0.12)` : 'var(--bg-surface-elevated)',
              color: accentColor ? `rgb(${accentColor})` : 'var(--text-secondary)'
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      {(subtext || badge) && (
        <div className="stat-card-footer">
          {badge && <span className="stat-badge">{badge}</span>}
          {subtext && <span className="stat-subtext">{subtext}</span>}
        </div>
      )}
    </div>
  );
}

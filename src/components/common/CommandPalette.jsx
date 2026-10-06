import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  LayoutDashboard, 
  GraduationCap, 
  Flame, 
  Code2, 
  Target, 
  BarChart3, 
  Settings,
  PlusCircle,
  X,
  ArrowRight
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onQuickAction }) {
  const navigate = useNavigate();
  const { subjects, skills, habits, tasks, goals } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onQuickAction?.('open_palette');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onQuickAction]);

  if (!isOpen) return null;

  // Search filter
  const q = query.toLowerCase().trim();

  const navigationResults = [
    { label: 'Go to Dashboard', path: '/', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Go to College Hub (Attendance & Timetable)', path: '/college', icon: GraduationCap, category: 'Navigation' },
    { label: 'Go to Habits & Streaks', path: '/habits', icon: Flame, category: 'Navigation' },
    { label: 'Go to Skills & Practice', path: '/skills', icon: Code2, category: 'Navigation' },
    { label: 'Go to Goals & Milestones', path: '/goals', icon: Target, category: 'Navigation' },
    { label: 'Go to Progress Analytics', path: '/progress', icon: BarChart3, category: 'Navigation' },
    { label: 'Go to Settings', path: '/settings', icon: Settings, category: 'Navigation' },
  ].filter((item) => item.label.toLowerCase().includes(q));

  const subjectsResults = subjects
    .filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
    .map((s) => ({
      label: `${s.name} (${s.code})`,
      detail: `Attendance: ${((s.attendedClasses / (s.totalClasses || 1)) * 100).toFixed(0)}%`,
      action: () => navigate('/college'),
      category: 'College Subjects',
      icon: GraduationCap,
    }));

  const habitsResults = habits
    .filter((h) => h.name.toLowerCase().includes(q) || h.category.toLowerCase().includes(q))
    .map((h) => ({
      label: h.name,
      detail: `Streak: ${h.currentStreak || 0} days`,
      action: () => navigate('/habits'),
      category: 'Habits',
      icon: Flame,
    }));

  const skillsResults = skills
    .filter((sk) => sk.name.toLowerCase().includes(q) || sk.category.toLowerCase().includes(q))
    .map((sk) => ({
      label: sk.name,
      detail: `${sk.practiceHours}h practiced • ${sk.level}`,
      action: () => navigate('/skills'),
      category: 'Skills',
      icon: Code2,
    }));

  const handleSelect = (item) => {
    if (item.path) navigate(item.path);
    else if (item.action) item.action();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '580px', padding: 0, overflow: 'hidden' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', gap: '0.75rem' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            className="input"
            style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '1rem', boxShadow: 'none' }}
            placeholder="Type a command or search subjects, habits, skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="btn btn-ghost btn-icon-only btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '0.5rem 0' }}>
          
          {navigationResults.length > 0 && (
            <div className="command-group">
              <div className="command-group-title">PAGES</div>
              {navigationResults.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    className="command-item"
                    onClick={() => handleSelect(item)}
                  >
                    <Icon size={16} color="var(--text-secondary)" />
                    <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                    <ArrowRight size={14} color="var(--text-muted)" />
                  </button>
                );
              })}
            </div>
          )}

          {subjectsResults.length > 0 && (
            <div className="command-group">
              <div className="command-group-title">COLLEGE SUBJECTS</div>
              {subjectsResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="command-item"
                  onClick={() => handleSelect(item)}
                >
                  <GraduationCap size={16} color="var(--accent-primary)" />
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  <span className="text-xs text-muted">{item.detail}</span>
                </button>
              ))}
            </div>
          )}

          {skillsResults.length > 0 && (
            <div className="command-group">
              <div className="command-group-title">SKILLS</div>
              {skillsResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="command-item"
                  onClick={() => handleSelect(item)}
                >
                  <Code2 size={16} color="var(--accent-blue)" />
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  <span className="text-xs text-muted">{item.detail}</span>
                </button>
              ))}
            </div>
          )}

          {habitsResults.length > 0 && (
            <div className="command-group">
              <div className="command-group-title">HABITS</div>
              {habitsResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="command-item"
                  onClick={() => handleSelect(item)}
                >
                  <Flame size={16} color="var(--warning)" />
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  <span className="text-xs text-muted">{item.detail}</span>
                </button>
              ))}
            </div>
          )}

          {navigationResults.length === 0 && subjectsResults.length === 0 && skillsResults.length === 0 && habitsResults.length === 0 && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '0.875rem' }}>No matching results for "{query}"</p>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div style={{ padding: '0.5rem 1.25rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-xs text-muted">Use <kbd className="kbd">ESC</kbd> to exit</span>
          <span className="text-xs text-muted">CampusGrowth OS</span>
        </div>
      </div>
    </div>
  );
}

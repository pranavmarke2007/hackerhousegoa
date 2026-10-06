import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Flame, 
  Code2, 
  Target, 
  BarChart3, 
  Settings,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/college', label: 'College', icon: GraduationCap },
  { path: '/habits', label: 'Habits', icon: Flame },
  { path: '/skills', label: 'Skills', icon: Code2 },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/progress', label: 'Progress', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { user, overviewStats, habits } = useApp();

  // Calculate active habits completed today
  const totalHabits = habits.length;
  const completedHabitsToday = habits.filter((h) => {
    const todayKey = new Date().toISOString().split('T')[0];
    return !!h.history?.[todayKey];
  }).length;

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-icon">
          <Sparkles size={18} color="#ffffff" />
        </div>
        <div>
          <span className="brand-title">CampusGrowth</span>
          <span className="brand-tag">Student OS</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">MENU</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.label === 'Habits' && totalHabits > 0 && (
                <span className="nav-badge">
                  {completedHabitsToday}/{totalHabits}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* College Attendance Quick Status Card */}
      <div className="sidebar-status-card">
        <div className="sidebar-status-header">
          <span className="text-xs" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            COLLEGE ATTENDANCE
          </span>
          {overviewStats.attendance.percentage >= (user.targetAttendance || 75) ? (
            <ShieldCheck size={14} color="var(--success)" />
          ) : (
            <AlertCircle size={14} color="var(--warning)" />
          )}
        </div>
        <div className="sidebar-status-value" style={{ color: overviewStats.attendance.statusColor }}>
          {overviewStats.attendance.formatted}
        </div>
        <div className="progress-track" style={{ height: 4, marginTop: '0.4rem' }}>
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min(overviewStats.attendance.percentage, 100)}%`,
              backgroundColor: overviewStats.attendance.statusColor 
            }} 
          />
        </div>
        <span className="text-xs text-muted" style={{ display: 'block', marginTop: '0.35rem' }}>
          Target: {user.targetAttendance || 75}% minimum
        </span>
      </div>

      {/* User Mini Profile */}
      <div className="sidebar-user-footer">
        <div className="user-avatar">
          {user.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'PS'}
        </div>
        <div className="user-details">
          <p className="user-name">{user.name}</p>
          <p className="user-course">{user.course.split(' ')[0]} • {user.semester.split(' ')[0]}</p>
        </div>
      </div>
    </aside>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sun, 
  Moon, 
  Search, 
  Timer, 
  Bell, 
  AlertTriangle, 
  Calendar,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import FocusTimerModal from './FocusTimerModal';

export default function Header({ onOpenCommandPalette }) {
  const { user, settings, updateSettings, exams, assignments, subjects } = useApp();
  const [showTimer, setShowTimer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format today's date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // Generate actionable notifications
  const lowAttendanceSubjects = subjects.filter((s) => {
    const pct = s.totalClasses > 0 ? (s.attendedClasses / s.totalClasses) * 100 : 100;
    return pct < (user.targetAttendance || 75);
  });

  const pendingAssignments = assignments.filter((a) => !a.completed);
  const upcomingExams = exams.slice(0, 2);

  const totalAlerts = lowAttendanceSubjects.length + (pendingAssignments.length > 0 ? 1 : 0);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <div>
            <h1 className="header-greeting">
              {getGreeting()}, {user.name ? user.name.split(' ')[0] : 'Student'}
            </h1>
            <p className="header-date">
              <Calendar size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
              {formattedDate} • <span className="text-secondary">{user.semester}</span>
            </p>
          </div>
        </div>

        <div className="header-right">
          {/* Quick Search / Command Palette Trigger */}
          <button 
            type="button"
            className="search-trigger-btn"
            onClick={onOpenCommandPalette}
            title="Search & Quick Actions (Ctrl + K)"
            aria-label="Search actions"
          >
            <Search size={15} />
            <span className="search-placeholder">Quick search...</span>
            <kbd className="kbd">⌘K</kbd>
          </button>

          {/* Pomodoro Focus Timer */}
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowTimer(true)}
            title="Start Study Timer"
          >
            <Timer size={15} color="var(--accent-primary)" />
            <span className="hide-mobile">Focus Timer</span>
          </button>

          {/* Notifications Trigger */}
          <div style={{ position: 'relative' }}>
            <button 
              type="button"
              className="btn btn-secondary btn-icon-only"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              title="Notifications & Alerts"
            >
              <Bell size={16} />
              {totalAlerts > 0 && <span className="notification-dot" />}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications & Alerts</h4>
                  <span className="text-xs text-secondary">{totalAlerts} active</span>
                </div>
                <div className="notifications-body">
                  {lowAttendanceSubjects.map((sub) => (
                    <div key={sub.id} className="notification-item warning">
                      <AlertTriangle size={15} className="notification-icon" />
                      <div>
                        <p className="notification-title">{sub.name} Attendance Alert</p>
                        <p className="notification-desc">
                          Current: {((sub.attendedClasses / sub.totalClasses) * 100).toFixed(0)}% (Below {user.targetAttendance}% target)
                        </p>
                      </div>
                    </div>
                  ))}

                  {pendingAssignments.length > 0 && (
                    <div className="notification-item info">
                      <BookOpen size={15} className="notification-icon" />
                      <div>
                        <p className="notification-title">{pendingAssignments.length} Assignments Due</p>
                        <p className="notification-desc">Review your deadlines on the College tab</p>
                      </div>
                    </div>
                  )}

                  {upcomingExams.map((ex) => (
                    <div key={ex.id} className="notification-item">
                      <Calendar size={15} className="notification-icon" />
                      <div>
                        <p className="notification-title">{ex.examName}</p>
                        <p className="notification-desc">Exam date: {ex.date}</p>
                      </div>
                    </div>
                  ))}

                  {totalAlerts === 0 && upcomingExams.length === 0 && (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={24} style={{ margin: '0 auto 0.5rem auto', color: 'var(--success)' }} />
                      <p style={{ fontSize: '0.875rem' }}>All caught up! No urgent alerts.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button 
            type="button"
            className="btn btn-secondary btn-icon-only"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {settings.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Focus Timer Modal */}
      {showTimer && <FocusTimerModal onClose={() => setShowTimer(false)} />}
    </>
  );
}

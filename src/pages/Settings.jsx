import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  User, 
  Bell, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Settings() {
  const { 
    user, 
    updateUser, 
    settings, 
    updateSettings, 
    resetToDemoData, 
    exportData, 
    importData 
  } = useApp();

  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    college: user.college || '',
    course: user.course || '',
    semester: user.semester || '',
    targetAttendance: user.targetAttendance || 75,
    dailyGoalHours: user.dailyGoalHours || 4,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUser({
      ...profileForm,
      targetAttendance: Number(profileForm.targetAttendance) || 75,
      dailyGoalHours: Number(profileForm.dailyGoalHours) || 4,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const result = importData(json);
        if (result.success) {
          alert('Data successfully imported from backup!');
        } else {
          alert('Failed to import data: ' + result.error);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '860px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2>System Settings & Preferences</h2>
        <p className="text-secondary text-sm">
          Customize student profile, appearance theme, attendance thresholds, and manage data backups.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* 1. Appearance & Theme */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Sun size={18} color="var(--accent-primary)" />
              <span>Appearance & Theme</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`theme-selector-card ${settings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => updateSettings({ theme: 'dark' })}
            >
              <div className="theme-preview dark-preview">
                <div className="theme-preview-sidebar" />
                <div className="theme-preview-content">
                  <div className="theme-preview-bar" />
                  <div className="theme-preview-bar short" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontWeight: 600 }}>
                <Moon size={15} /> Dark Mode (Default)
              </div>
            </button>

            <button
              type="button"
              className={`theme-selector-card ${settings.theme === 'light' ? 'active' : ''}`}
              onClick={() => updateSettings({ theme: 'light' })}
            >
              <div className="theme-preview light-preview">
                <div className="theme-preview-sidebar" />
                <div className="theme-preview-content">
                  <div className="theme-preview-bar" />
                  <div className="theme-preview-bar short" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontWeight: 600 }}>
                <Sun size={15} /> Light Mode
              </div>
            </button>
          </div>
        </div>

        {/* 2. Student Profile */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <User size={18} color="var(--accent-blue)" />
              <span>Student Profile & Targets</span>
            </span>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">College / University</label>
                <input
                  type="text"
                  className="input"
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Degree & Program</label>
                <input
                  type="text"
                  className="input"
                  value={profileForm.course}
                  onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Semester / Term</label>
                <input
                  type="text"
                  className="input"
                  value={profileForm.semester}
                  onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Minimum Attendance Threshold (%)</label>
                <input
                  type="number"
                  min="50"
                  max="95"
                  className="input"
                  value={profileForm.targetAttendance}
                  onChange={(e) => setProfileForm({ ...profileForm, targetAttendance: Number(e.target.value) })}
                  required
                />
                <span className="text-xs text-muted">Usually 75% for university eligibility</span>
              </div>

              <div className="form-group">
                <label className="form-label">Daily Deep Work Target (Hours)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  className="input"
                  value={profileForm.dailyGoalHours}
                  onChange={(e) => setProfileForm({ ...profileForm, dailyGoalHours: Number(e.target.value) })}
                  required
                />
                <span className="text-xs text-muted">Daily target for deliberate practice</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
              {savedSuccess ? (
                <span style={{ color: 'var(--success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={16} /> Profile saved successfully!
                </span>
              ) : <div />}

              <button type="submit" className="btn btn-primary">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* 3. Notifications & Reminders */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Bell size={18} color="var(--warning)" />
              <span>Reminders & Notifications</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <p className="font-semibold text-primary" style={{ fontSize: '0.9rem' }}>Assignment Deadlines</p>
                <p className="text-xs text-secondary">Notify 24 hours prior to assignment submission deadlines</p>
              </div>
              <input
                type="checkbox"
                checked={!!settings.notifications?.assignments}
                onChange={(e) => updateSettings({ notifications: { ...settings.notifications, assignments: e.target.checked } })}
                style={{ width: 18, height: 18, accentColor: 'var(--accent-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <p className="font-semibold text-primary" style={{ fontSize: '0.9rem' }}>Exam Countdown Alerts</p>
                <p className="text-xs text-secondary">Show countdown and syllabus readiness alerts on top bar</p>
              </div>
              <input
                type="checkbox"
                checked={!!settings.notifications?.exams}
                onChange={(e) => updateSettings({ notifications: { ...settings.notifications, exams: e.target.checked } })}
                style={{ width: 18, height: 18, accentColor: 'var(--accent-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem 0' }}>
              <div>
                <p className="font-semibold text-primary" style={{ fontSize: '0.9rem' }}>Daily Habit Check-in</p>
                <p className="text-xs text-secondary">Remind in the evening for remaining unchecked habits</p>
              </div>
              <input
                type="checkbox"
                checked={!!settings.notifications?.habits}
                onChange={(e) => updateSettings({ notifications: { ...settings.notifications, habits: e.target.checked } })}
                style={{ width: 18, height: 18, accentColor: 'var(--accent-primary)' }}
              />
            </label>
          </div>
        </div>

        {/* 4. Data Persistence & Backups */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Database size={18} color="var(--purple)" />
              <span>Data Management & Backup</span>
            </span>
          </div>

          <p className="text-sm text-secondary" style={{ marginBottom: '1.25rem' }}>
            All your tasks, attendance, habits, and study logs are stored locally in your browser. You can export a JSON backup or restore anytime.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={exportData}
            >
              <Download size={15} /> Export Backup (JSON)
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} /> Restore from JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportFile}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setResetConfirmOpen(true)}
            >
              <RotateCcw size={14} /> Reset to Sample Student Data
            </button>
          </div>
        </div>

      </div>

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={() => {
          resetToDemoData();
          setResetConfirmOpen(false);
        }}
        title="Reset to Demo Data"
        message="This will replace all current data with the realistic starter student dataset. Are you sure?"
        confirmText="Reset Data"
        isDestructive={false}
      />

    </div>
  );
}

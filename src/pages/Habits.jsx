import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  Plus, 
  Check, 
  Trash2, 
  Edit2, 
  Code2, 
  Calendar, 
  Target, 
  Award, 
  Clock, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatDateKey, calculateStreak } from '../services/storage';
import confetti from 'canvas-confetti';

export default function Habits() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabit, skills } = useApp();

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitForm, setHabitForm] = useState({
    name: '',
    category: 'Coding',
    linkedSkillId: '',
    targetMinutes: 30,
    frequency: 'daily',
    reminderTime: '19:00',
  });

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: '' });

  // Compute 7 days for the weekly grid (Monday through Sunday or past 7 days)
  const todayKey = formatDateKey(new Date());

  const daysToShow = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = formatDateKey(d);
    return {
      dateKey: key,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: key === todayKey,
    };
  });

  const handleOpenCreateHabit = () => {
    setEditingHabit(null);
    setHabitForm({
      name: '',
      category: 'Coding',
      linkedSkillId: skills[0]?.id || '',
      targetMinutes: 45,
      frequency: 'daily',
      reminderTime: '19:00',
    });
    setIsHabitModalOpen(true);
  };

  const handleOpenEditHabit = (h) => {
    setEditingHabit(h);
    setHabitForm({
      name: h.name,
      category: h.category,
      linkedSkillId: h.linkedSkillId || '',
      targetMinutes: h.targetMinutes || 30,
      frequency: h.frequency || 'daily',
      reminderTime: h.reminderTime || '19:00',
    });
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = (e) => {
    e.preventDefault();
    if (!habitForm.name.trim()) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, habitForm);
    } else {
      addHabit(habitForm);
    }
    setIsHabitModalOpen(false);
  };

  const handleToggle = (habitId, dateKey) => {
    toggleHabit(habitId, dateKey);
    // Trigger celebratory confetti if completing today
    const h = habits.find((item) => item.id === habitId);
    if (h && !h.history?.[dateKey] && dateKey === todayKey) {
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  // Overall weekly completion percentage across all habits
  let totalOpportunities = 0;
  let totalCompletions = 0;
  habits.forEach((h) => {
    daysToShow.forEach((d) => {
      totalOpportunities++;
      if (h.history?.[d.dateKey]) totalCompletions++;
    });
  });
  const overallWeeklyPct = totalOpportunities > 0 ? Math.round((totalCompletions / totalOpportunities) * 100) : 0;

  return (
    <div className="page-wrapper">
      
      {/* Top Banner & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Daily Habits & Consistency</h2>
          <p className="text-secondary text-sm">
            Build compounding consistency. Linked habits contribute directly to skill practice hours.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreateHabit}
        >
          <Plus size={16} /> New Habit
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <div className="stat-card">
          <span className="stat-card-label">Overall 7-Day Consistency</span>
          <div className="stat-card-value font-mono" style={{ color: 'var(--accent-primary)' }}>
            {overallWeeklyPct}%
          </div>
          <span className="stat-subtext">{totalCompletions} of {totalOpportunities} target days completed</span>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Active Habits</span>
          <div className="stat-card-value">{habits.length}</div>
          <span className="stat-subtext">
            {habits.filter((h) => !!h.history?.[todayKey]).length} completed today
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Best Active Streak</span>
          <div className="stat-card-value font-mono" style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Flame size={24} color="var(--warning)" />
            {Math.max(...habits.map((h) => h.currentStreak || 0), 0)} days
          </div>
          <span className="stat-subtext">Keep the momentum going</span>
        </div>
      </div>

      {/* Main Habit Matrix Table Card */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        {habits.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <Flame size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h4>No habits added yet</h4>
            <p className="text-sm text-secondary" style={{ marginTop: '0.25rem', maxWidth: '380px', margin: '0.25rem auto 0 auto' }}>
              Start building your daily ritual: practice coding, read documentation, or revise notes daily.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1.25rem' }}
              onClick={handleOpenCreateHabit}
            >
              + Create First Habit
            </button>
          </div>
        ) : (
          <table className="habit-matrix-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', minWidth: '220px' }}>Habit Details</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Streak</th>
                {daysToShow.map((d) => (
                  <th 
                    key={d.dateKey} 
                    style={{ textAlign: 'center', width: '64px' }}
                    className={d.isToday ? 'th-today' : ''}
                  >
                    <div style={{ fontSize: '0.72rem', color: d.isToday ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {d.dayName}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: d.isToday ? 700 : 500, color: d.isToday ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                      {d.dayNumber}
                    </div>
                  </th>
                ))}
                <th style={{ textAlign: 'center', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => {
                const linkedSkill = skills.find((s) => s.id === habit.linkedSkillId);
                const { currentStreak } = calculateStreak(habit.history || {});
                
                // Calculate completion rate for this habit across the 7 days
                const completedInPeriod = daysToShow.filter((d) => !!habit.history?.[d.dateKey]).length;
                const habitPct = Math.round((completedInPeriod / 7) * 100);

                return (
                  <tr key={habit.id}>
                    {/* Habit info */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span className="font-semibold text-primary">{habit.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span className="badge badge-neutral">{habit.category}</span>
                          {linkedSkill && (
                            <span className="badge badge-blue" title={`Linked to ${linkedSkill.name}`}>
                              <Code2 size={11} /> {linkedSkill.name.split(' ')[0]}
                            </span>
                          )}
                          <span className="text-xs text-muted">
                            <Clock size={11} style={{ display: 'inline', marginRight: 2, verticalAlign: -1 }} />
                            {habit.targetMinutes}m
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Streaks */}
                    <td style={{ textAlign: 'center' }}>
                      <div className="habit-streak-pill" style={{ margin: '0 auto', display: 'inline-flex' }}>
                        <Flame size={14} color="var(--warning)" />
                        <span className="font-mono font-bold">{currentStreak}d</span>
                      </div>
                      <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                        Best: {habit.bestStreak || currentStreak}d
                      </div>
                    </td>

                    {/* 7 Days Grid Cells */}
                    {daysToShow.map((d) => {
                      const isDone = !!habit.history?.[d.dateKey];
                      return (
                        <td key={d.dateKey} style={{ textAlign: 'center' }} className={d.isToday ? 'td-today' : ''}>
                          <button
                            type="button"
                            className={`habit-matrix-check-btn ${isDone ? 'checked' : ''} ${d.isToday ? 'today' : ''}`}
                            onClick={() => handleToggle(habit.id, d.dateKey)}
                            aria-label={`${habit.name} on ${d.dayName} ${d.dayNumber}: ${isDone ? 'Completed' : 'Incomplete'}`}
                            title={`${d.dayName}, ${d.dateKey}: ${isDone ? 'Completed (Click to undo)' : 'Click to complete'}`}
                          >
                            {isDone && <Check size={14} strokeWidth={3} />}
                          </button>
                        </td>
                      );
                    })}

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-only btn-sm"
                          onClick={() => handleOpenEditHabit(habit)}
                          aria-label="Edit habit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-only btn-sm"
                          onClick={() => setDeleteConfirm({ isOpen: true, id: habit.id, title: `Delete "${habit.name}"?` })}
                          aria-label="Delete habit"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Habit Create / Edit Modal */}
      <Modal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        title={editingHabit ? 'Edit Habit' : 'Create New Habit'}
      >
        <form onSubmit={handleSaveHabit}>
          <div className="form-group">
            <label className="form-label">Habit Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Solve 2 LeetCode questions"
              value={habitForm.name}
              onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="select"
                value={habitForm.category}
                onChange={(e) => setHabitForm({ ...habitForm, category: e.target.value })}
              >
                <option value="Coding">Coding</option>
                <option value="Development">Development</option>
                <option value="Academics">Academics</option>
                <option value="Health">Health & Fitness</option>
                <option value="Knowledge">Knowledge & Reading</option>
                <option value="Self Growth">Self Growth</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="300"
                step="5"
                className="input"
                value={habitForm.targetMinutes}
                onChange={(e) => setHabitForm({ ...habitForm, targetMinutes: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Connect Skill & Habit */}
          <div className="form-group">
            <label className="form-label">Link to Skill (Automatic practice hour logging)</label>
            <select
              className="select"
              value={habitForm.linkedSkillId}
              onChange={(e) => setHabitForm({ ...habitForm, linkedSkillId: e.target.value })}
            >
              <option value="">-- No Linked Skill --</option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.level})
                </option>
              ))}
            </select>
            <span className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
              When you mark this habit complete, it automatically adds {habitForm.targetMinutes}m to your skill progress!
            </span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Frequency</label>
              <select
                className="select"
                value={habitForm.frequency}
                onChange={(e) => setHabitForm({ ...habitForm, frequency: e.target.value })}
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays Only</option>
                <option value="weekends">Weekends Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Daily Reminder Time</label>
              <input
                type="time"
                className="input"
                value={habitForm.reminderTime}
                onChange={(e) => setHabitForm({ ...habitForm, reminderTime: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsHabitModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
        onConfirm={() => deleteHabit(deleteConfirm.id)}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? All past streak and completion history will be removed."
        confirmText="Delete"
        isDestructive={true}
      />

    </div>
  );
}

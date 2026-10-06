import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Code2, 
  Flame, 
  Trash2, 
  Edit2, 
  ChevronRight, 
  Award, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { getDaysRemaining, formatDateKey } from '../services/storage';
import confetti from 'canvas-confetti';

export default function Goals() {
  const { 
    goals, 
    addGoal, 
    updateGoal, 
    deleteGoal, 
    toggleGoalMilestone, 
    addGoalMilestone, 
    removeGoalMilestone,
    skills, 
    habits 
  } = useApp();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: 'Career',
    deadline: formatDateKey(new Date()),
    linkedSkillId: '',
    linkedHabitIds: [],
  });

  // Milestone input per goal
  const [milestoneInputs, setMilestoneInputs] = useState({});

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: '' });

  const handleOpenCreateGoal = () => {
    setEditingGoal(null);
    setGoalForm({
      title: '',
      description: '',
      category: 'Career',
      deadline: formatDateKey(new Date()),
      linkedSkillId: skills[0]?.id || '',
      linkedHabitIds: [],
    });
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (g) => {
    setEditingGoal(g);
    setGoalForm({
      title: g.title,
      description: g.description || '',
      category: g.category || 'Career',
      deadline: g.deadline,
      linkedSkillId: g.linkedSkillId || '',
      linkedHabitIds: g.linkedHabitIds || [],
    });
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, goalForm);
    } else {
      addGoal({
        ...goalForm,
        milestones: [
          { id: `ms-${Date.now()}-1`, title: 'Define target curriculum & timeline', completed: true, dueDate: formatDateKey(new Date()) },
          { id: `ms-${Date.now()}-2`, title: 'First major milestone checkpoint', completed: false, dueDate: '' },
        ]
      });
    }
    setIsGoalModalOpen(false);
  };

  const handleToggleMilestone = (goalId, milestoneId, isCurrentlyCompleted) => {
    toggleGoalMilestone(goalId, milestoneId);
    if (!isCurrentlyCompleted) {
      try {
        confetti({ particleCount: 45, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleAddMilestone = (goalId) => {
    const text = milestoneInputs[goalId];
    if (!text || !text.trim()) return;
    addGoalMilestone(goalId, text.trim());
    setMilestoneInputs({ ...milestoneInputs, [goalId]: '' });
  };

  return (
    <div className="page-wrapper">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Goals & Key Milestones</h2>
          <p className="text-secondary text-sm">
            High-level long term targets connected to your daily habits and skill roadmaps.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreateGoal}
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <Target size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h4>No goals established yet</h4>
          <p className="text-sm text-secondary" style={{ marginTop: '0.25rem', maxWidth: '400px', margin: '0.25rem auto 0 auto' }}>
            Set meaningful targets like securing an internship, publishing an open source app, or acing semester exams.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ marginTop: '1.25rem' }}
            onClick={handleOpenCreateGoal}
          >
            + Create First Goal
          </button>
        </div>
      ) : (
        <div className="goals-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {goals.map((goal) => {
            const totalMilestones = goal.milestones?.length || 0;
            const completedMilestones = goal.milestones?.filter((m) => m.completed).length || 0;
            const progressPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
            const daysLeft = getDaysRemaining(goal.deadline);
            const linkedSkill = skills.find((s) => s.id === goal.linkedSkillId);

            return (
              <div key={goal.id} className="card goal-card">
                <div className="goal-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-primary">{goal.category}</span>
                      {linkedSkill && (
                        <span className="badge badge-blue">
                          <Code2 size={12} /> {linkedSkill.name}
                        </span>
                      )}
                    </div>
                    <h3 className="goal-title">{goal.title}</h3>
                    {goal.description && <p className="goal-desc">{goal.description}</p>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="countdown-badge">
                      <Calendar size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                      {daysLeft > 0 ? `${daysLeft} days remaining` : daysLeft === 0 ? 'Due Today' : 'Completed'}
                    </div>

                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon-only btn-sm"
                        onClick={() => handleOpenEditGoal(goal)}
                        aria-label="Edit goal"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon-only btn-sm"
                        onClick={() => setDeleteConfirm({ isOpen: true, id: goal.id, title: `Delete "${goal.title}"?` })}
                        aria-label="Delete goal"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    <span>Milestones Completed: {completedMilestones}/{totalMilestones}</span>
                    <span className="font-mono font-bold" style={{ color: progressPct === 100 ? 'var(--success)' : 'var(--accent-primary)' }}>
                      {progressPct}%
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 6 }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${progressPct}%`,
                        backgroundColor: progressPct === 100 ? 'var(--success)' : 'var(--accent-primary)' 
                      }} 
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="goal-milestones-section">
                  <span className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    ACTIONABLE MILESTONES:
                  </span>

                  <div className="goal-milestones-list">
                    {goal.milestones?.map((m) => (
                      <div 
                        key={m.id} 
                        className="goal-milestone-item"
                        onClick={() => handleToggleMilestone(goal.id, m.id, m.completed)}
                      >
                        <button
                          type="button"
                          className="task-check-btn"
                          style={{ width: 16, height: 16 }}
                          aria-label={m.completed ? 'Mark milestone incomplete' : 'Mark milestone complete'}
                        >
                          {m.completed ? (
                            <CheckCircle2 size={16} color="var(--success)" />
                          ) : (
                            <Circle size={16} color="var(--text-muted)" />
                          )}
                        </button>
                        <span className={`text-sm ${m.completed ? 'topic-done-text' : ''}`} style={{ flex: 1 }}>
                          {m.title}
                        </span>
                        {m.dueDate && (
                          <span className="text-xs text-muted" style={{ marginRight: '0.5rem' }}>
                            Target: {m.dueDate}
                          </span>
                        )}
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-only btn-sm hide-hover"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeGoalMilestone(goal.id, m.id);
                          }}
                          aria-label="Remove milestone"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Milestone Input */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                      placeholder="+ Add milestone (e.g. Build authentication service)"
                      value={milestoneInputs[goal.id] || ''}
                      onChange={(e) => setMilestoneInputs({ ...milestoneInputs, [goal.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMilestone(goal.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAddMilestone(goal.id)}
                      disabled={!milestoneInputs[goal.id]?.trim()}
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
      >
        <form onSubmit={handleSaveGoal}>
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Crack Summer Software Engineering Internship"
              value={goalForm.title}
              onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Goal Description / Success Criteria</label>
            <textarea
              className="textarea"
              rows="3"
              placeholder="e.g. Solve 150+ DSA questions, publish 2 fullstack web projects..."
              value={goalForm.description}
              onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="select"
                value={goalForm.category}
                onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
              >
                <option value="Career">Career & Placement</option>
                <option value="Academics">Academics & CGPA</option>
                <option value="Engineering">Engineering / Coding</option>
                <option value="Personal">Personal Growth</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Deadline</label>
              <input
                type="date"
                className="input"
                value={goalForm.deadline}
                onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Link to Primary Skill</label>
            <select
              className="select"
              value={goalForm.linkedSkillId}
              onChange={(e) => setGoalForm({ ...goalForm, linkedSkillId: e.target.value })}
            >
              <option value="">-- None --</option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.level})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsGoalModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingGoal ? 'Save Changes' : 'Establish Goal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
        onConfirm={() => deleteGoal(deleteConfirm.id)}
        title="Delete Goal"
        message="Are you sure you want to delete this goal and its associated milestones?"
        confirmText="Delete"
        isDestructive={true}
      />

    </div>
  );
}

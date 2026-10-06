import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Code2, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit2, 
  Clock, 
  Flame, 
  Layers, 
  BookOpen, 
  Check, 
  X,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatDateKey } from '../services/storage';
import confetti from 'canvas-confetti';

export default function Skills() {
  const { 
    skills, 
    addSkill, 
    updateSkill, 
    deleteSkill, 
    toggleSkillTopic, 
    addSkillTopic, 
    removeSkillTopic,
    logSkillPractice,
    habits 
  } = useApp();

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Core Computer Science',
    level: 'Intermediate',
    targetHours: 100,
    practiceHours: 0,
  });

  // Quick Log Practice Modal state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedSkillForLog, setSelectedSkillForLog] = useState(null);
  const [logMinutes, setLogMinutes] = useState(45);
  const [logNotes, setLogNotes] = useState('');

  // Topic input per skill
  const [topicInputs, setTopicInputs] = useState({});

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: '' });

  const handleOpenCreateSkill = () => {
    setEditingSkill(null);
    setSkillForm({
      name: '',
      category: 'Core Computer Science',
      level: 'Intermediate',
      targetHours: 100,
      practiceHours: 0,
    });
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (s) => {
    setEditingSkill(s);
    setSkillForm({
      name: s.name,
      category: s.category,
      level: s.level || 'Intermediate',
      targetHours: s.targetHours || 100,
      practiceHours: s.practiceHours || 0,
    });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;

    if (editingSkill) {
      updateSkill(editingSkill.id, skillForm);
    } else {
      addSkill({
        ...skillForm,
        topics: [
          { id: `top-${Date.now()}-1`, name: 'Fundamentals & Syntax', completed: true },
          { id: `top-${Date.now()}-2`, name: 'Core Problem Solving', completed: false },
        ]
      });
    }
    setIsSkillModalOpen(false);
  };

  const handleOpenLogModal = (skill) => {
    setSelectedSkillForLog(skill);
    setLogMinutes(45);
    setLogNotes('');
    setIsLogModalOpen(true);
  };

  const handleSavePracticeLog = (e) => {
    e.preventDefault();
    if (!selectedSkillForLog) return;
    logSkillPractice(selectedSkillForLog.id, Number(logMinutes), logNotes);
    setIsLogModalOpen(false);
    try {
      confetti({ particleCount: 50, spread: 55, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleAddTopic = (skillId) => {
    const text = topicInputs[skillId];
    if (!text || !text.trim()) return;
    addSkillTopic(skillId, text.trim());
    setTopicInputs({ ...topicInputs, [skillId]: '' });
  };

  return (
    <div className="page-wrapper">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Skills & Technical Mastery</h2>
          <p className="text-secondary text-sm">
            Track deliberate practice hours, roadmap topics, and skill milestones.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreateSkill}
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <Code2 size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h4>No skills added yet</h4>
          <p className="text-sm text-secondary" style={{ marginTop: '0.25rem', maxWidth: '380px', margin: '0.25rem auto 0 auto' }}>
            Choose an engineering skill you want to master (e.g. Java DSA, React, System Design).
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ marginTop: '1.25rem' }}
            onClick={handleOpenCreateSkill}
          >
            + Add First Skill
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {skills.map((skill) => {
            const totalTopics = skill.topics?.length || 0;
            const completedTopics = skill.topics?.filter((t) => t.completed).length || 0;
            const topicProgressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
            const hoursProgressPct = skill.targetHours > 0 ? Math.min(Math.round((skill.practiceHours / skill.targetHours) * 100), 100) : 0;

            // Find linked habits
            const linkedHabits = habits.filter((h) => h.linkedSkillId === skill.id);

            return (
              <div key={skill.id} className="card skill-card">
                {/* Header */}
                <div className="card-header" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <span className="badge badge-neutral">{skill.category}</span>
                      <span className={`badge ${
                        skill.level === 'Advanced' ? 'badge-primary' : skill.level === 'Intermediate' ? 'badge-blue' : 'badge-neutral'
                      }`}>
                        {skill.level}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem' }}>{skill.name}</h3>
                  </div>

                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon-only btn-sm"
                      onClick={() => handleOpenEditSkill(skill)}
                      aria-label="Edit skill"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon-only btn-sm"
                      onClick={() => setDeleteConfirm({ isOpen: true, id: skill.id, title: `Delete "${skill.name}"?` })}
                      aria-label="Delete skill"
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Practice Hours & Progress */}
                <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="text-xs text-secondary font-semibold">DELIBERATE PRACTICE</span>
                    <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>
                      {skill.practiceHours} / {skill.targetHours} hours ({hoursProgressPct}%)
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 6 }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${hoursProgressPct}%`,
                        backgroundColor: 'var(--accent-primary)' 
                      }} 
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.65rem' }}>
                    <span className="text-xs text-muted">
                      Topics covered: {completedTopics}/{totalTopics} ({topicProgressPct}%)
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenLogModal(skill)}
                    >
                      <Clock size={13} /> Log Practice
                    </button>
                  </div>
                </div>

                {/* Linked Habits (Section 9: Connect Skills and Habits) */}
                {linkedHabits.length > 0 && (
                  <div style={{ marginBottom: '1rem', padding: '0.6rem 0.8rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <Flame size={13} color="var(--warning)" />
                      <span className="text-xs font-semibold text-secondary">LINKED DAILY HABIT</span>
                    </div>
                    {linkedHabits.map((h) => (
                      <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span>{h.name}</span>
                        <span className="badge badge-warning">{h.currentStreak || 0}d streak</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Topics Roadmap Checklist */}
                <div>
                  <span className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    CURRICULUM & TOPICS:
                  </span>

                  <div className="skill-topics-list">
                    {skill.topics?.map((topic) => (
                      <div 
                        key={topic.id} 
                        className="skill-topic-item"
                        onClick={() => toggleSkillTopic(skill.id, topic.id)}
                      >
                        <button
                          type="button"
                          className="task-check-btn"
                          style={{ width: 16, height: 16 }}
                          aria-label={topic.completed ? 'Mark topic incomplete' : 'Mark topic complete'}
                        >
                          {topic.completed ? (
                            <CheckCircle2 size={16} color="var(--success)" />
                          ) : (
                            <Circle size={16} color="var(--text-muted)" />
                          )}
                        </button>
                        <span className={`text-sm ${topic.completed ? 'topic-done-text' : ''}`} style={{ flex: 1 }}>
                          {topic.name}
                        </span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-only btn-sm hide-hover"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSkillTopic(skill.id, topic.id);
                          }}
                          aria-label="Remove topic"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Topic Input */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                      placeholder="+ Add topic (e.g. Dynamic Programming)"
                      value={topicInputs[skill.id] || ''}
                      onChange={(e) => setTopicInputs({ ...topicInputs, [skill.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopic(skill.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAddTopic(skill.id)}
                      disabled={!topicInputs[skill.id]?.trim()}
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

      {/* Skill Modal */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
      >
        <form onSubmit={handleSaveSkill}>
          <div className="form-group">
            <label className="form-label">Skill Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Java + Data Structures & Algorithms"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="select"
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
              >
                <option value="Core Computer Science">Core Computer Science</option>
                <option value="Frontend Engineering">Frontend Engineering</option>
                <option value="Backend Engineering">Backend Engineering</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="System Design">System Design</option>
                <option value="Career & Soft Skills">Career & Soft Skills</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current Level</label>
              <select
                className="select"
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Target Mastery Hours</label>
              <input
                type="number"
                min="10"
                max="1000"
                className="input"
                value={skillForm.targetHours}
                onChange={(e) => setSkillForm({ ...skillForm, targetHours: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Already Practiced Hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                className="input"
                value={skillForm.practiceHours}
                onChange={(e) => setSkillForm({ ...skillForm, practiceHours: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsSkillModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSkill ? 'Save Changes' : 'Create Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Practice Hours Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title={`Log Practice: ${selectedSkillForLog?.name || 'Skill'}`}
      >
        <form onSubmit={handleSavePracticeLog}>
          <div className="form-group">
            <label className="form-label">Practice Duration (Minutes)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {[30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  className={`btn btn-sm ${logMinutes === mins ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setLogMinutes(mins)}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <input
              type="number"
              min="5"
              max="600"
              className="input"
              value={logMinutes}
              onChange={(e) => setLogMinutes(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Practice Notes / Topics Covered</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Solved 3 medium sliding window questions"
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Record Practice
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
        onConfirm={() => deleteSkill(deleteConfirm.id)}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? All topics and tracked practice progress will be permanently removed."
        confirmText="Delete"
        isDestructive={true}
      />

    </div>
  );
}

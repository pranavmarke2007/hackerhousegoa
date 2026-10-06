import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, CheckCircle2, BookOpen, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FocusTimerModal({ onClose }) {
  const { skills, subjects, addStudySession, logSkillPractice } = useApp();
  
  const [selectedDuration, setSelectedDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [sessionNotes, setSessionNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef(null);

  // Handle countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleSelectPreset = (minutes) => {
    setIsActive(false);
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsCompleted(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
    setIsCompleted(false);
  };

  const handleSaveSession = (e) => {
    e.preventDefault();
    const durationMinutes = selectedDuration;

    // Log study session
    addStudySession({
      durationMinutes,
      skillId: selectedSkillId || null,
      subjectId: selectedSubjectId || null,
      notes: sessionNotes.trim() || `Completed ${selectedDuration} min focus block`,
    });

    onClose();
  };

  // Format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const progressPercentage = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  return (
    <Modal isOpen={true} onClose={onClose} title="Deep Work Focus Timer" maxWidth="480px">
      <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem 0' }}>
        
        {/* Preset Selector */}
        <div className="timer-presets" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              type="button"
              className={`btn btn-sm ${selectedDuration === mins ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleSelectPreset(mins)}
              disabled={isActive}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Big Timer Display */}
        <div className="timer-display-box" style={{ 
          margin: '0 auto 1.5rem auto', 
          width: '200px', 
          height: '200px', 
          borderRadius: '50%', 
          border: '4px solid var(--border-default)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          background: 'var(--bg-surface-elevated)'
        }}>
          <span className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
            {isActive ? 'In Focus Mode' : isCompleted ? 'Session Complete!' : 'Ready'}
          </span>
        </div>

        {/* Timer Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
            onClick={toggleTimer}
            style={{ minWidth: '120px' }}
          >
            {isActive ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start Focus</>}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-icon-only"
            onClick={resetTimer}
            title="Reset Timer"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Association & Logging Form */}
        <form onSubmit={handleSaveSession} style={{ textAlign: 'left', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Link Focus to Skill (Optional)</label>
            <select
              className="select"
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
            >
              <option value="">-- None / General Study --</option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.level})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Link to College Subject (Optional)</label>
            <select
              className="select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              <option value="">-- None --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Session Notes / Outcome</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Solved 2 DP problems, read Chapter 4 notes"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Save Session
            </button>
          </div>
        </form>

      </div>
    </Modal>
  );
}

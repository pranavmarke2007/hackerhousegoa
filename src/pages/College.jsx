import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  ShieldCheck, 
  Trash2, 
  Edit2, 
  Clock, 
  User, 
  Layers, 
  Check, 
  X,
  ChevronRight,
  Filter
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { calculateAttendance, getDaysRemaining, formatDateKey } from '../services/storage';

const TABS = [
  { id: 'subjects', label: 'Subjects & Attendance', icon: GraduationCap },
  { id: 'assignments', label: 'Assignments', icon: FileText },
  { id: 'timetable', label: 'Weekly Timetable', icon: Calendar },
  { id: 'exams', label: 'Exams & Syllabus', icon: BookOpen },
];

export default function College() {
  const { 
    user,
    subjects, 
    addSubject, 
    updateSubject, 
    deleteSubject, 
    recordAttendance,
    assignments, 
    addAssignment, 
    updateAssignment, 
    deleteAssignment, 
    toggleAssignment,
    timetable, 
    addTimetableEntry, 
    deleteTimetableEntry,
    exams, 
    addExam, 
    updateExam, 
    deleteExam, 
    toggleExamTopic,
    addExamTopic
  } = useApp();

  const [activeTab, setActiveTab] = useState('subjects');

  // --- SUBJECT MODAL STATE ---
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    professor: '',
    room: '',
    attendedClasses: 0,
    totalClasses: 0,
    credits: 3,
    color: '#f97316',
  });

  // --- ASSIGNMENT MODAL STATE ---
  const [isAsnModalOpen, setIsAsnModalOpen] = useState(false);
  const [editingAsn, setEditingAsn] = useState(null);
  const [asnFilter, setAsnFilter] = useState('all'); // all, pending, completed, overdue
  const [asnForm, setAsnForm] = useState({
    title: '',
    subjectId: '',
    deadline: formatDateKey(new Date()),
    priority: 'medium',
    notes: '',
  });

  // --- TIMETABLE MODAL STATE ---
  const [isTtModalOpen, setIsTtModalOpen] = useState(false);
  const [selectedTimetableDay, setSelectedTimetableDay] = useState(1); // 1 = Monday
  const [ttForm, setTtForm] = useState({
    day: 1,
    dayName: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subjectId: '',
    type: 'Lecture',
    room: 'Hall 302',
  });

  // --- EXAM MODAL STATE ---
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [selectedExamForTopics, setSelectedExamForTopics] = useState(null);
  const [examForm, setExamForm] = useState({
    subjectId: '',
    examName: '',
    date: formatDateKey(new Date()),
    time: '10:00 - 13:00',
    room: 'Hall A',
    targetMarks: 50,
    weightage: 'Midterm (30%)',
  });

  // Delete Confirm Dialog state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '' });

  // --- HANDLERS: SUBJECTS ---
  const handleOpenCreateSubject = () => {
    setEditingSubject(null);
    setSubjectForm({
      name: '',
      code: '',
      professor: '',
      room: '',
      attendedClasses: 30,
      totalClasses: 35,
      credits: 4,
      color: '#f97316',
    });
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (sub) => {
    setEditingSubject(sub);
    setSubjectForm({
      name: sub.name,
      code: sub.code,
      professor: sub.professor || '',
      room: sub.room || '',
      attendedClasses: sub.attendedClasses || 0,
      totalClasses: sub.totalClasses || 0,
      credits: sub.credits || 3,
      color: sub.color || '#f97316',
    });
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!subjectForm.name.trim() || !subjectForm.code.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, subjectForm);
    } else {
      addSubject(subjectForm);
    }
    setIsSubjectModalOpen(false);
  };

  // --- HANDLERS: ASSIGNMENTS ---
  const handleOpenCreateAsn = () => {
    setEditingAsn(null);
    setAsnForm({
      title: '',
      subjectId: subjects[0]?.id || '',
      deadline: formatDateKey(new Date()),
      priority: 'medium',
      notes: '',
    });
    setIsAsnModalOpen(true);
  };

  const handleOpenEditAsn = (asn) => {
    setEditingAsn(asn);
    setAsnForm({
      title: asn.title,
      subjectId: asn.subjectId,
      deadline: asn.deadline,
      priority: asn.priority || 'medium',
      notes: asn.notes || '',
    });
    setIsAsnModalOpen(true);
  };

  const handleSaveAsn = (e) => {
    e.preventDefault();
    if (!asnForm.title.trim()) return;

    if (editingAsn) {
      updateAssignment(editingAsn.id, asnForm);
    } else {
      addAssignment(asnForm);
    }
    setIsAsnModalOpen(false);
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((asn) => {
    const today = formatDateKey(new Date());
    if (asnFilter === 'pending') return !asn.completed;
    if (asnFilter === 'completed') return asn.completed;
    if (asnFilter === 'overdue') return !asn.completed && asn.deadline < today;
    return true;
  });

  // --- HANDLERS: TIMETABLE ---
  const handleOpenCreateTt = () => {
    const daysMap = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday' };
    setTtForm({
      day: selectedTimetableDay,
      dayName: daysMap[selectedTimetableDay] || 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      subjectId: subjects[0]?.id || '',
      type: 'Lecture',
      room: 'Hall 302',
    });
    setIsTtModalOpen(true);
  };

  const handleSaveTt = (e) => {
    e.preventDefault();
    const daysMap = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday' };
    addTimetableEntry({
      ...ttForm,
      dayName: daysMap[ttForm.day],
    });
    setIsTtModalOpen(false);
  };

  // --- HANDLERS: EXAMS ---
  const handleOpenCreateExam = () => {
    setEditingExam(null);
    setExamForm({
      subjectId: subjects[0]?.id || '',
      examName: '',
      date: formatDateKey(new Date()),
      time: '10:00 - 13:00',
      room: 'Main Hall',
      targetMarks: 50,
      weightage: 'Midterm (30%)',
    });
    setIsExamModalOpen(true);
  };

  const handleOpenEditExam = (exam) => {
    setEditingExam(exam);
    setExamForm({
      subjectId: exam.subjectId,
      examName: exam.examName,
      date: exam.date,
      time: exam.time || '10:00 - 13:00',
      room: exam.room || 'Main Hall',
      targetMarks: exam.targetMarks || 50,
      weightage: exam.weightage || 'Midterm',
    });
    setIsExamModalOpen(true);
  };

  const handleSaveExam = (e) => {
    e.preventDefault();
    if (!examForm.examName.trim()) return;

    if (editingExam) {
      updateExam(editingExam.id, examForm);
    } else {
      addExam(examForm);
    }
    setIsExamModalOpen(false);
  };

  const handleAddExamTopic = (e) => {
    e.preventDefault();
    if (!selectedExamForTopics || !newTopicName.trim()) return;
    addExamTopic(selectedExamForTopics.id, newTopicName);
    setNewTopicName('');
  };

  // Execute confirm delete
  const executeDelete = () => {
    if (deleteConfirm.type === 'subject') deleteSubject(deleteConfirm.id);
    if (deleteConfirm.type === 'assignment') deleteAssignment(deleteConfirm.id);
    if (deleteConfirm.type === 'timetable') deleteTimetableEntry(deleteConfirm.id);
    if (deleteConfirm.type === 'exam') deleteExam(deleteConfirm.id);
  };

  return (
    <div className="page-wrapper">
      
      {/* College Page Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>College Academic Hub</h2>
          <p className="text-secondary text-sm">
            {user.course} • {user.semester} • Target Attendance: {user.targetAttendance}%
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="tab-switcher">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: SUBJECTS & ATTENDANCE
          ========================================================================= */}
      {activeTab === 'subjects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3>Enrolled Subjects</h3>
              <p className="text-xs text-muted">Track attendance ratio, safe miss allowance, and make-up classes</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreateSubject}
            >
              <Plus size={15} /> Add Subject
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <GraduationCap size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4>No subjects added yet</h4>
              <p className="text-sm text-secondary" style={{ marginTop: '0.25rem' }}>
                Add your semester courses to track attendance and syllabus.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ marginTop: '1rem' }}
                onClick={handleOpenCreateSubject}
              >
                + Add First Subject
              </button>
            </div>
          ) : (
            <div className="grid-2">
              {subjects.map((sub) => {
                const math = calculateAttendance(sub.attendedClasses, sub.totalClasses, user.targetAttendance || 75);
                const isBelowTarget = math.isWarning;

                return (
                  <div key={sub.id} className="subject-card">
                    {/* Top Row: Code, Name, Actions */}
                    <div className="subject-card-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span 
                            className="badge badge-neutral" 
                            style={{ borderLeft: `3px solid ${sub.color || 'var(--accent-primary)'}`, fontWeight: 700 }}
                          >
                            {sub.code}
                          </span>
                          <span className="text-xs text-muted">{sub.credits} Credits</span>
                        </div>
                        <h4 className="subject-name" style={{ marginTop: '0.35rem' }}>
                          {sub.name}
                        </h4>
                        <span className="text-xs text-secondary" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: '0.2rem' }}>
                          <User size={12} /> {sub.professor || 'Faculty'} • {sub.room || 'Classroom'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-only btn-sm"
                          onClick={() => handleOpenEditSubject(sub)}
                          aria-label="Edit subject"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-only btn-sm"
                          onClick={() => setDeleteConfirm({ isOpen: true, type: 'subject', id: sub.id, title: `Delete "${sub.name}"?` })}
                          aria-label="Delete subject"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Attendance Metric & Progress Bar */}
                    <div className="subject-attendance-section">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <div>
                          <span className="font-mono text-xl font-bold" style={{ color: math.statusColor }}>
                            {math.formattedPercentage}%
                          </span>
                          <span className="text-xs text-muted" style={{ marginLeft: '0.5rem' }}>
                            ({sub.attendedClasses} / {sub.totalClasses} classes)
                          </span>
                        </div>
                        <span className={`badge ${isBelowTarget ? 'badge-danger' : 'badge-success'}`}>
                          {math.statusText}
                        </span>
                      </div>

                      <div className="progress-track" style={{ height: 6 }}>
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${Math.min(math.percentage, 100)}%`,
                            backgroundColor: math.statusColor 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Accurate Guidance Box */}
                    <div className={`attendance-math-callout ${isBelowTarget ? 'danger-box' : 'safe-box'}`}>
                      {isBelowTarget ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertTriangle size={15} color="var(--danger)" style={{ flexShrink: 0 }} />
                          <span className="text-xs">
                            Must attend next <strong>{math.neededToReachTarget}</strong> consecutive classes to reach {user.targetAttendance}%.
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ShieldCheck size={15} color="var(--success)" style={{ flexShrink: 0 }} />
                          <span className="text-xs">
                            Safe! You can miss up to <strong>{math.canMiss}</strong> classes before falling below {user.targetAttendance}%.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Live Attendance Logging Action Buttons */}
                    <div className="subject-attendance-actions">
                      <span className="text-xs text-muted font-medium">Record class:</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => recordAttendance(sub.id, true)}
                          title="I attended this class (+1 attended, +1 total)"
                        >
                          <Check size={14} color="var(--success)" /> Attended
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => recordAttendance(sub.id, false)}
                          title="I missed this class (+0 attended, +1 total)"
                        >
                          <X size={14} color="var(--danger)" /> Missed
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: ASSIGNMENTS
          ========================================================================= */}
      {activeTab === 'assignments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Filter size={15} color="var(--text-muted)" />
              {['all', 'pending', 'completed', 'overdue'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`btn btn-sm ${asnFilter === filter ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAsnFilter(filter)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreateAsn}
            >
              <Plus size={15} /> Add Assignment
            </button>
          </div>

          {filteredAssignments.length === 0 ? (
            <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <FileText size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4>No assignments found</h4>
              <p className="text-sm text-secondary" style={{ marginTop: '0.25rem' }}>
                {asnFilter === 'all' ? 'You have no recorded college assignments.' : `No ${asnFilter} assignments.`}
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1rem' }}
                onClick={handleOpenCreateAsn}
              >
                + Add Assignment
              </button>
            </div>
          ) : (
            <div className="assignments-grid">
              {filteredAssignments.map((asn) => {
                const subject = subjects.find((s) => s.id === asn.subjectId);
                const daysLeft = getDaysRemaining(asn.deadline);
                const isOverdue = !asn.completed && daysLeft < 0;

                return (
                  <div key={asn.id} className={`assignment-card ${asn.completed ? 'completed' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <button
                        type="button"
                        className="task-check-btn"
                        onClick={() => toggleAssignment(asn.id)}
                        aria-label={asn.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {asn.completed ? (
                          <CheckCircle2 size={18} color="var(--success)" />
                        ) : (
                          <Circle size={18} color="var(--text-muted)" />
                        )}
                      </button>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 className={`asn-title ${asn.completed ? 'line-through' : ''}`}>
                            {asn.title}
                          </h4>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon-only btn-sm"
                              onClick={() => handleOpenEditAsn(asn)}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-icon-only btn-sm"
                              onClick={() => setDeleteConfirm({ isOpen: true, type: 'assignment', id: asn.id, title: `Delete "${asn.title}"?` })}
                              style={{ color: 'var(--danger)' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {asn.notes && (
                          <p className="asn-notes">{asn.notes}</p>
                        )}

                        <div className="asn-footer">
                          {subject && (
                            <span 
                              className="badge badge-neutral" 
                              style={{ borderLeft: `3px solid ${subject.color || 'var(--accent-primary)'}` }}
                            >
                              {subject.code}
                            </span>
                          )}
                          <span className={`badge ${
                            asn.priority === 'high' ? 'badge-danger' : asn.priority === 'medium' ? 'badge-warning' : 'badge-neutral'
                          }`}>
                            {asn.priority} priority
                          </span>
                          <span className={`text-xs ${isOverdue ? 'text-danger font-medium' : 'text-muted'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <Calendar size={12} /> Due: {asn.deadline} ({daysLeft >= 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d overdue`})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: TIMETABLE
          ========================================================================= */}
      {activeTab === 'timetable' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3>Weekly Class Schedule</h3>
              <p className="text-xs text-muted">Complete lecture and practical laboratory timetable</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreateTt}
            >
              <Plus size={15} /> Add Timetable Slot
            </button>
          </div>

          {/* Day Tabs (especially helpful on Mobile and Tablet) */}
          <div className="timetable-day-selector" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {[
              { day: 1, name: 'Monday' },
              { day: 2, name: 'Tuesday' },
              { day: 3, name: 'Wednesday' },
              { day: 4, name: 'Thursday' },
              { day: 5, name: 'Friday' },
            ].map((d) => (
              <button
                key={d.day}
                type="button"
                className={`btn btn-sm ${selectedTimetableDay === d.day ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedTimetableDay(d.day)}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* Schedule view for selected day */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][selectedTimetableDay - 1]} Schedule
              </span>
              <span className="text-xs text-muted">
                {timetable.filter((tt) => tt.day === selectedTimetableDay).length} sessions
              </span>
            </div>

            <div className="timetable-list">
              {timetable.filter((tt) => tt.day === selectedTimetableDay).length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p style={{ fontSize: '0.875rem' }}>No lectures scheduled for this day.</p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.75rem' }}
                    onClick={handleOpenCreateTt}
                  >
                    + Add class slot
                  </button>
                </div>
              ) : (
                timetable
                  .filter((tt) => tt.day === selectedTimetableDay)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((slot) => {
                    const subject = subjects.find((s) => s.id === slot.subjectId);
                    return (
                      <div key={slot.id} className="timetable-slot-row">
                        <div className="tt-time-pill font-mono">
                          <span>{slot.startTime}</span>
                          <span className="text-xs text-muted">to {slot.endTime}</span>
                        </div>

                        <div className="tt-details">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="font-semibold text-primary">
                              {subject ? subject.name : 'College Session'}
                            </span>
                            {subject && (
                              <span className="badge badge-neutral">{subject.code}</span>
                            )}
                            <span className="badge badge-primary">{slot.type}</span>
                          </div>
                          <div className="tt-sub-meta">
                            <span>Room: {slot.room}</span>
                            {subject?.professor && <span>• Faculty: {subject.professor}</span>}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-only btn-sm"
                          onClick={() => setDeleteConfirm({ isOpen: true, type: 'timetable', id: slot.id, title: 'Remove slot?' })}
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: EXAMS & SYLLABUS
          ========================================================================= */}
      {activeTab === 'exams' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3>Exams & Syllabus Readiness</h3>
              <p className="text-xs text-muted">Track topics prepared and exam date countdowns</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreateExam}
            >
              <Plus size={15} /> Add Exam
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <BookOpen size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4>No exams scheduled</h4>
              <p className="text-sm text-secondary" style={{ marginTop: '0.25rem' }}>
                Add your upcoming midterms and finals to track syllabus coverage.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ marginTop: '1rem' }}
                onClick={handleOpenCreateExam}
              >
                + Schedule Exam
              </button>
            </div>
          ) : (
            <div className="grid-2">
              {exams.map((exam) => {
                const subject = subjects.find((s) => s.id === exam.subjectId);
                const daysLeft = getDaysRemaining(exam.date);
                const totalTopics = exam.syllabusTopics?.length || 0;
                const preparedTopics = exam.syllabusTopics?.filter((t) => t.prepared).length || 0;
                const progressPct = totalTopics > 0 ? Math.round((preparedTopics / totalTopics) * 100) : 0;

                return (
                  <div key={exam.id} className="card">
                    {/* Header */}
                    <div className="card-header" style={{ alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          {subject && <span className="badge badge-neutral">{subject.code}</span>}
                          <span className="badge badge-warning">{exam.weightage}</span>
                        </div>
                        <h4 style={{ fontSize: '1.05rem' }}>{exam.examName}</h4>
                        <p className="text-xs text-secondary" style={{ marginTop: '0.25rem' }}>
                          <Calendar size={12} style={{ display: 'inline', marginRight: 3, verticalAlign: -1 }} />
                          {exam.date} • {exam.time} • {exam.room}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                        <span className={`countdown-badge ${daysLeft <= 7 ? 'urgent' : ''}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Today' : 'Completed'}
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon-only btn-sm"
                            onClick={() => handleOpenEditExam(exam)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon-only btn-sm"
                            onClick={() => setDeleteConfirm({ isOpen: true, type: 'exam', id: exam.id, title: `Delete exam "${exam.examName}"?` })}
                            style={{ color: 'var(--danger)' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Readiness Bar */}
                    <div style={{ margin: '0.75rem 0 1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        <span>Syllabus Readiness</span>
                        <span className="font-mono font-semibold" style={{ color: progressPct >= 70 ? 'var(--success)' : 'var(--accent-primary)' }}>
                          {progressPct}% ({preparedTopics}/{totalTopics} topics)
                        </span>
                      </div>
                      <div className="progress-track" style={{ height: 6 }}>
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${progressPct}%`,
                            backgroundColor: progressPct >= 70 ? 'var(--success)' : 'var(--accent-primary)' 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Topics Checklist */}
                    <div className="syllabus-checklist">
                      <span className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        SYLLABUS TOPICS:
                      </span>
                      
                      {exam.syllabusTopics?.length === 0 ? (
                        <p className="text-xs text-muted" style={{ padding: '0.5rem 0' }}>No topics added yet.</p>
                      ) : (
                        exam.syllabusTopics.map((topic) => (
                          <div 
                            key={topic.id} 
                            className="syllabus-topic-item"
                            onClick={() => toggleExamTopic(exam.id, topic.id)}
                          >
                            <button
                              type="button"
                              className="task-check-btn"
                              style={{ width: 16, height: 16 }}
                            >
                              {topic.prepared ? (
                                <CheckCircle2 size={16} color="var(--success)" />
                              ) : (
                                <Circle size={16} color="var(--text-muted)" />
                              )}
                            </button>
                            <span className={`text-sm ${topic.prepared ? 'prepared-text' : ''}`}>
                              {topic.name}
                            </span>
                          </div>
                        ))
                      )}

                      {/* Quick Add Topic Input */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <input
                          type="text"
                          className="input"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                          placeholder="+ Add topic (e.g. Graph BFS/DFS)"
                          value={selectedExamForTopics?.id === exam.id ? newTopicName : ''}
                          onFocus={() => setSelectedExamForTopics(exam)}
                          onChange={(e) => {
                            setSelectedExamForTopics(exam);
                            setNewTopicName(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddExamTopic(e);
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={handleAddExamTopic}
                          disabled={!newTopicName.trim() || selectedExamForTopics?.id !== exam.id}
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
        </div>
      )}

      {/* =========================================================================
          MODALS
          ========================================================================= */}

      {/* Subject Modal */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
      >
        <form onSubmit={handleSaveSubject}>
          <div className="form-group">
            <label className="form-label">Subject Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Data Structures & Algorithms"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Subject Code</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. CS501"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                className="input"
                value={subjectForm.credits}
                onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Professor / Faculty</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Dr. Suresh Naik"
                value={subjectForm.professor}
                onChange={(e) => setSubjectForm({ ...subjectForm, professor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Room / Hall</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Hall 302"
                value={subjectForm.room}
                onChange={(e) => setSubjectForm({ ...subjectForm, room: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Attended Classes</label>
              <input
                type="number"
                min="0"
                className="input"
                value={subjectForm.attendedClasses}
                onChange={(e) => setSubjectForm({ ...subjectForm, attendedClasses: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Classes</label>
              <input
                type="number"
                min="0"
                className="input"
                value={subjectForm.totalClasses}
                onChange={(e) => setSubjectForm({ ...subjectForm, totalClasses: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsSubjectModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assignment Modal */}
      <Modal
        isOpen={isAsnModalOpen}
        onClose={() => setIsAsnModalOpen(false)}
        title={editingAsn ? 'Edit Assignment' : 'Add Assignment'}
      >
        <form onSubmit={handleSaveAsn}>
          <div className="form-group">
            <label className="form-label">Assignment Title</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Red-Black & AVL Trees Implementation"
              value={asnForm.title}
              onChange={(e) => setAsnForm({ ...asnForm, title: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select
                className="select"
                value={asnForm.subjectId}
                onChange={(e) => setAsnForm({ ...asnForm, subjectId: e.target.value })}
                required
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="select"
                value={asnForm.priority}
                onChange={(e) => setAsnForm({ ...asnForm, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              className="input"
              value={asnForm.deadline}
              onChange={(e) => setAsnForm({ ...asnForm, deadline: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Instructions</label>
            <textarea
              className="textarea"
              rows="3"
              placeholder="e.g. Upload PDF to portal, include code screenshots..."
              value={asnForm.notes}
              onChange={(e) => setAsnForm({ ...asnForm, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAsnModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAsn ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Timetable Slot Modal */}
      <Modal
        isOpen={isTtModalOpen}
        onClose={() => setIsTtModalOpen(false)}
        title="Add Timetable Slot"
      >
        <form onSubmit={handleSaveTt}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Day</label>
              <select
                className="select"
                value={ttForm.day}
                onChange={(e) => setTtForm({ ...ttForm, day: Number(e.target.value) })}
              >
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="select"
                value={ttForm.type}
                onChange={(e) => setTtForm({ ...ttForm, type: e.target.value })}
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab Practical</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <select
              className="select"
              value={ttForm.subjectId}
              onChange={(e) => setTtForm({ ...ttForm, subjectId: e.target.value })}
              required
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="input"
                value={ttForm.startTime}
                onChange={(e) => setTtForm({ ...ttForm, startTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="input"
                value={ttForm.endTime}
                onChange={(e) => setTtForm({ ...ttForm, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Room / Lab</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Hall 302 or Lab 4"
              value={ttForm.room}
              onChange={(e) => setTtForm({ ...ttForm, room: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsTtModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Slot
            </button>
          </div>
        </form>
      </Modal>

      {/* Exam Modal */}
      <Modal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        title={editingExam ? 'Edit Exam' : 'Schedule Exam'}
      >
        <form onSubmit={handleSaveExam}>
          <div className="form-group">
            <label className="form-label">Exam Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Data Structures Midterm"
              value={examForm.examName}
              onChange={(e) => setExamForm({ ...examForm, examName: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select
                className="select"
                value={examForm.subjectId}
                onChange={(e) => setExamForm({ ...examForm, subjectId: e.target.value })}
                required
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Weightage / Type</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Midterm (30%)"
                value={examForm.weightage}
                onChange={(e) => setExamForm({ ...examForm, weightage: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="input"
                value={examForm.date}
                onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. 10:00 - 13:00"
                value={examForm.time}
                onChange={(e) => setExamForm({ ...examForm, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Exam Room</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Auditorium Hall B"
              value={examForm.room}
              onChange={(e) => setExamForm({ ...examForm, room: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsExamModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingExam ? 'Save Changes' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this item? Associated entries may also be removed.`}
        confirmText="Delete"
        isDestructive={true}
      />

    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Flame, 
  Clock, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Target, 
  Timer,
  ChevronRight,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  Code2
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import { formatDateKey, getDaysRemaining } from '../services/storage';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { 
    user, 
    overviewStats, 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTask, 
    habits, 
    toggleHabit, 
    subjects, 
    timetable, 
    exams,
    studySessions
  } = useApp();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'College',
    subjectId: '',
    priority: 'medium',
    dueDate: formatDateKey(new Date()),
    dueTime: '20:00',
  });

  const todayKey = formatDateKey(new Date());

  // Filter today's tasks
  const todayTasks = tasks.filter((t) => t.dueDate === todayKey || !t.dueDate);

  // Today's day number (0 = Sunday, 1 = Monday, ... 6 = Saturday)
  const currentDayIndex = new Date().getDay();
  // Map day index to timetable day (1..5 for Mon-Fri)
  const todayTimetable = timetable
    .filter((tt) => tt.day === (currentDayIndex === 0 ? 7 : currentDayIndex))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Determine current active class based on local hour/minute
  const getCurrentClassStatus = (startTime, endTime) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (currentMinutes >= startTotal && currentMinutes <= endTotal) {
      return 'active';
    } else if (currentMinutes < startTotal && startTotal - currentMinutes <= 120) {
      return 'upcoming';
    }
    return 'normal';
  };

  // Activity summary for the past 7 days (Mon-Sun)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = formatDateKey(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Count completed habits on this date
    const habitsCompleted = habits.filter((h) => !!h.history?.[key]).length;
    // Count tasks completed on this date
    const tasksDone = tasks.filter((t) => t.completed && t.completedAt === key).length;
    // Study minutes logged on this date
    const studyMins = studySessions.filter((s) => s.date === key).reduce((acc, s) => acc + s.durationMinutes, 0);

    const score = habitsCompleted * 15 + tasksDone * 10 + (studyMins / 60) * 20;

    return {
      dateKey: key,
      dayName,
      isToday: key === todayKey,
      habitsCompleted,
      tasksDone,
      studyMins,
      score: Math.min(Math.round(score), 100),
    };
  });

  const handleOpenCreateTask = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      category: 'College',
      subjectId: subjects[0]?.id || '',
      priority: 'medium',
      dueDate: formatDateKey(new Date()),
      dueTime: '20:00',
    });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      category: task.category || 'College',
      subjectId: task.subjectId || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || formatDateKey(new Date()),
      dueTime: task.dueTime || '20:00',
    });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, taskForm);
    } else {
      addTask(taskForm);
    }
    setIsTaskModalOpen(false);
  };

  return (
    <div className="page-wrapper">
      
      {/* 1. Top Overview Metrics */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          label="Today's Tasks"
          value={overviewStats.tasks.text}
          subtext={`${tasks.filter((t) => !t.completed).length} total pending`}
          icon={CheckCircle2}
          accentColor="249, 115, 22"
        />
        <StatCard
          label="College Attendance"
          value={overviewStats.attendance.formatted}
          subtext={
            overviewStats.attendance.percentage >= (user.targetAttendance || 75)
              ? `Safe (Target: ${user.targetAttendance || 75}%)`
              : `Warning (Target: ${user.targetAttendance || 75}%)`
          }
          icon={GraduationCap}
          accentColor={
            overviewStats.attendance.percentage >= (user.targetAttendance || 75)
              ? '16, 185, 129'
              : '239, 68, 68'
          }
        />
        <StatCard
          label="Active Skills"
          value={overviewStats.activeSkills}
          subtext="In progress practice"
          icon={Code2}
          accentColor="59, 130, 246"
        />
        <StatCard
          label="Study Today"
          value={overviewStats.study.formatted}
          subtext={`Goal: ${user.dailyGoalHours || 4}h/day`}
          icon={Clock}
          accentColor="139, 92, 246"
        />
      </div>

      {/* 2. Main Dashboard Two-Column Grid */}
      <div className="dashboard-main-grid">
        
        {/* LEFT COLUMN: Tasks & Habits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Today's Tasks Section */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <CheckCircle2 size={18} color="var(--accent-primary)" />
                <span>Today's Tasks</span>
                <span className="badge badge-neutral" style={{ marginLeft: '0.25rem' }}>
                  {todayTasks.filter((t) => t.completed).length}/{todayTasks.length}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleOpenCreateTask}
              >
                <Plus size={14} /> Add Task
              </button>
            </div>

            <div className="tasks-list">
              {todayTasks.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p style={{ fontSize: '0.875rem' }}>No tasks scheduled for today.</p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.75rem' }}
                    onClick={handleOpenCreateTask}
                  >
                    + Add your first task
                  </button>
                </div>
              ) : (
                todayTasks.map((task) => {
                  const subject = subjects.find((s) => s.id === task.subjectId);
                  return (
                    <div 
                      key={task.id} 
                      className={`task-row ${task.completed ? 'completed' : ''}`}
                    >
                      <button
                        type="button"
                        className="task-check-btn"
                        onClick={() => toggleTask(task.id)}
                        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {task.completed ? (
                          <CheckCircle2 size={18} color="var(--success)" />
                        ) : (
                          <Circle size={18} color="var(--text-muted)" />
                        )}
                      </button>

                      <div className="task-content">
                        <span className="task-title">{task.title}</span>
                        <div className="task-meta">
                          {subject && (
                            <span 
                              className="badge badge-neutral" 
                              style={{ borderLeft: `3px solid ${subject.color || 'var(--accent-primary)'}` }}
                            >
                              {subject.code}
                            </span>
                          )}
                          <span className={`badge ${
                            task.priority === 'high' ? 'badge-danger' : task.priority === 'medium' ? 'badge-warning' : 'badge-neutral'
                          }`}>
                            {task.priority}
                          </span>
                          {task.dueTime && (
                            <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <Clock size={11} /> {task.dueTime}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="task-actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-only btn-sm"
                          onClick={() => handleOpenEditTask(task)}
                          aria-label="Edit task"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-only btn-sm"
                          onClick={() => deleteTask(task.id)}
                          aria-label="Delete task"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Today's Habits Section */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Flame size={18} color="var(--warning)" />
                <span>Today's Habits</span>
              </div>
              <Link to="/habits" className="btn btn-ghost btn-sm">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="habits-dashboard-list">
              {habits.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p style={{ fontSize: '0.875rem' }}>No habits tracked yet.</p>
                  <Link to="/habits" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
                    + Setup habits
                  </Link>
                </div>
              ) : (
                habits.map((habit) => {
                  const isDoneToday = !!habit.history?.[todayKey];
                  return (
                    <div key={habit.id} className="habit-dashboard-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        <button
                          type="button"
                          className={`habit-toggle-btn ${isDoneToday ? 'done' : ''}`}
                          onClick={() => toggleHabit(habit.id, todayKey)}
                          aria-label={isDoneToday ? 'Mark habit undone' : 'Mark habit done'}
                        >
                          {isDoneToday && <Check size={14} color="#ffffff" />}
                        </button>
                        <div>
                          <p className={`habit-item-title ${isDoneToday ? 'line-through' : ''}`}>
                            {habit.name}
                          </p>
                          <span className="text-xs text-muted">
                            {habit.category} • {habit.targetMinutes}m target
                          </span>
                        </div>
                      </div>

                      <div className="habit-streak-pill">
                        <Flame size={13} color="var(--warning)" />
                        <span>{habit.currentStreak || 0}d</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Weekly Activity Progress */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Calendar size={18} color="var(--accent-blue)" />
                <span>Weekly Activity</span>
              </div>
              <span className="text-xs text-muted">Habits • Study • Tasks</span>
            </div>

            <div className="weekly-activity-grid">
              {past7Days.map((day) => (
                <div 
                  key={day.dateKey} 
                  className={`activity-day-col ${day.isToday ? 'today' : ''}`}
                >
                  <div className="activity-bar-container">
                    <div 
                      className="activity-bar-fill" 
                      style={{ 
                        height: `${Math.max(day.score, 8)}%`,
                        backgroundColor: day.score > 60 ? 'var(--accent-primary)' : day.score > 20 ? 'var(--accent-blue)' : 'var(--bg-surface-elevated)'
                      }} 
                    />
                  </div>
                  <span className="activity-day-name">{day.dayName}</span>
                  <span className="activity-detail-text">
                    {day.studyMins > 0 ? `${Math.round(day.studyMins / 60)}h` : `${day.habitsCompleted}hbt`}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Today's Classes & Upcoming Exams */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Today's Schedule */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <GraduationCap size={18} color="var(--accent-primary)" />
                <span>Today's Schedule</span>
              </div>
              <Link to="/college" className="btn btn-ghost btn-sm">
                Timetable <ChevronRight size={14} />
              </Link>
            </div>

            <div className="schedule-list">
              {todayTimetable.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p style={{ fontSize: '0.875rem' }}>No college lectures scheduled for today.</p>
                  <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>Enjoy your study & self-growth time!</p>
                </div>
              ) : (
                todayTimetable.map((slot) => {
                  const subject = subjects.find((s) => s.id === slot.subjectId);
                  const status = getCurrentClassStatus(slot.startTime, slot.endTime);

                  return (
                    <div key={slot.id} className={`schedule-slot-card ${status}`}>
                      <div className="schedule-time-box">
                        <span className="font-mono text-sm font-semibold">{slot.startTime}</span>
                        <span className="text-xs text-muted">{slot.endTime}</span>
                      </div>

                      <div className="schedule-details">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="schedule-subject-name">
                            {subject ? subject.name : 'College Session'}
                          </span>
                          {status === 'active' && (
                            <span className="badge badge-primary">LIVE NOW</span>
                          )}
                          {status === 'upcoming' && (
                            <span className="badge badge-warning">NEXT UP</span>
                          )}
                        </div>
                        <div className="schedule-meta">
                          <span>{slot.type}</span>
                          <span>•</span>
                          <span>{slot.room}</span>
                          {subject?.professor && (
                            <>
                              <span>•</span>
                              <span>{subject.professor}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Exams Countdown */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <BookOpen size={18} color="var(--danger)" />
                <span>Upcoming Exams</span>
              </div>
              <Link to="/college" className="btn btn-ghost btn-sm">
                All Exams <ChevronRight size={14} />
              </Link>
            </div>

            <div className="exams-dashboard-list">
              {exams.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p style={{ fontSize: '0.875rem' }}>No upcoming exams scheduled.</p>
                </div>
              ) : (
                exams.slice(0, 3).map((exam) => {
                  const daysLeft = getDaysRemaining(exam.date);
                  const totalTopics = exam.syllabusTopics?.length || 0;
                  const preparedTopics = exam.syllabusTopics?.filter((t) => t.prepared).length || 0;
                  const prepPercentage = totalTopics > 0 ? Math.round((preparedTopics / totalTopics) * 100) : 0;

                  return (
                    <div key={exam.id} className="exam-card-mini">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p className="exam-mini-name">{exam.examName}</p>
                          <span className="text-xs text-secondary">
                            {exam.date} • {exam.room || 'Examination Hall'}
                          </span>
                        </div>
                        <div className={`countdown-badge ${daysLeft <= 7 ? 'urgent' : ''}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Today' : 'Completed'}
                        </div>
                      </div>

                      <div style={{ marginTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          <span>Syllabus Prepared</span>
                          <span className="font-mono">{prepPercentage}% ({preparedTopics}/{totalTopics})</span>
                        </div>
                        <div className="progress-track" style={{ height: 4 }}>
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${prepPercentage}%`,
                              backgroundColor: prepPercentage > 70 ? 'var(--success)' : 'var(--accent-primary)' 
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Task Create/Edit Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <form onSubmit={handleSaveTask}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Complete DBMS normalization questions"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="select"
                value={taskForm.category}
                onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
              >
                <option value="College">College</option>
                <option value="Skill">Skill Development</option>
                <option value="Personal">Personal / Life</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="select"
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Associated Subject (Optional)</label>
            <select
              className="select"
              value={taskForm.subjectId}
              onChange={(e) => setTaskForm({ ...taskForm, subjectId: e.target.value })}
            >
              <option value="">-- None / General --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="input"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Time</label>
              <input
                type="time"
                className="input"
                value={taskForm.dueTime}
                onChange={(e) => setTaskForm({ ...taskForm, dueTime: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsTaskModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

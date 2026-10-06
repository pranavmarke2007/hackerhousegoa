import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  GraduationCap, 
  Flame, 
  Code2, 
  Target, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  Award,
  TrendingUp
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { formatDateKey, calculateAttendance } from '../services/storage';

export default function Progress() {
  const { 
    user, 
    subjects, 
    assignments, 
    exams, 
    habits, 
    skills, 
    studySessions, 
    goals, 
    tasks 
  } = useApp();

  // 1. College Math
  let totalAttendedClasses = 0;
  let totalScheduledClasses = 0;
  subjects.forEach((s) => {
    totalAttendedClasses += (s.attendedClasses || 0);
    totalScheduledClasses += (s.totalClasses || 0);
  });
  const overallAttendancePct = totalScheduledClasses > 0 ? (totalAttendedClasses / totalScheduledClasses) * 100 : 100;

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.completed).length;
  const assignmentRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 100;

  // 2. Self Growth Math
  // Total study hours logged
  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // 14 days activity trend
  const past14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = formatDateKey(d);
    const dayLabel = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

    const habitsDone = habits.filter((h) => !!h.history?.[key]).length;
    const studyMins = studySessions.filter((s) => s.date === key).reduce((acc, s) => acc + s.durationMinutes, 0);

    return {
      dateKey: key,
      label: dayLabel,
      habitsDone,
      studyHours: Number((studyMins / 60).toFixed(1)),
    };
  });

  // Study hours by skill breakdown
  const skillHoursMap = {};
  studySessions.forEach((s) => {
    if (s.skillId) {
      const sk = skills.find((item) => item.id === s.skillId);
      const name = sk ? sk.name.split(' ')[0] : 'Other';
      skillHoursMap[name] = (skillHoursMap[name] || 0) + s.durationMinutes;
    }
  });

  // Max study hours in a day for scaling bar chart
  const maxDailyStudyHours = Math.max(...past14Days.map((d) => d.studyHours), 4);

  return (
    <div className="page-wrapper">
      
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Progress Analytics & Reports</h2>
        <p className="text-secondary text-sm">
          Unified academic standing and deliberate self-growth performance metrics.
        </p>
      </div>

      {/* Top Quick Stats */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          label="Overall Attendance"
          value={`${overallAttendancePct.toFixed(1)}%`}
          subtext={`${totalAttendedClasses} of ${totalScheduledClasses} attended`}
          icon={GraduationCap}
          accentColor={overallAttendancePct >= (user.targetAttendance || 75) ? '16, 185, 129' : '239, 68, 68'}
        />
        <StatCard
          label="Assignment Completion"
          value={`${assignmentRate}%`}
          subtext={`${completedAssignments} / ${totalAssignments} turned in`}
          icon={CheckCircle2}
          accentColor="59, 130, 246"
        />
        <StatCard
          label="Total Study Time"
          value={`${totalStudyHours}h`}
          subtext={`${studySessions.length} logged sessions`}
          icon={Clock}
          accentColor="249, 115, 22"
        />
        <StatCard
          label="Active Habits Count"
          value={habits.length}
          subtext={`Avg streak: ${(habits.reduce((acc, h) => acc + (h.currentStreak || 0), 0) / (habits.length || 1)).toFixed(1)}d`}
          icon={Flame}
          accentColor="245, 158, 11"
        />
      </div>

      {/* Analytics Section 1: College Progress */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="section-title-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <GraduationCap size={20} color="var(--accent-primary)" />
          <h3>Academic & College Standing</h3>
        </div>

        <div className="grid-2">
          {/* Subject Attendance Breakdown Bar Chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Subject Attendance Comparison</span>
              <span className="text-xs text-muted">Target: {user.targetAttendance}%</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginTop: '0.5rem' }}>
              {subjects.map((sub) => {
                const math = calculateAttendance(sub.attendedClasses, sub.totalClasses, user.targetAttendance || 75);
                return (
                  <div key={sub.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <span className="font-semibold text-primary">{sub.name} ({sub.code})</span>
                      <span className="font-mono font-bold" style={{ color: math.statusColor }}>
                        {math.formattedPercentage}% ({sub.attendedClasses}/{sub.totalClasses})
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: 8 }}>
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${Math.min(math.percentage, 100)}%`,
                          backgroundColor: math.statusColor 
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exam Readiness & Weightage Matrix */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Exam Syllabus Coverage</span>
              <span className="text-xs text-muted">{exams.length} Upcoming Exams</span>
            </div>

            {exams.length === 0 ? (
              <p className="text-sm text-secondary" style={{ padding: '1rem 0' }}>No exams scheduled.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                {exams.map((exam) => {
                  const total = exam.syllabusTopics?.length || 0;
                  const done = exam.syllabusTopics?.filter((t) => t.prepared).length || 0;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                  return (
                    <div key={exam.id} style={{ background: 'var(--bg-surface-elevated)', padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div>
                          <p className="font-semibold text-primary" style={{ fontSize: '0.9rem' }}>{exam.examName}</p>
                          <span className="text-xs text-secondary">{exam.weightage} • {exam.date}</span>
                        </div>
                        <span className="font-mono text-sm font-bold" style={{ color: pct >= 70 ? 'var(--success)' : 'var(--accent-primary)' }}>
                          {pct}%
                        </span>
                      </div>
                      <div className="progress-track" style={{ height: 6 }}>
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${pct}%`,
                            backgroundColor: pct >= 70 ? 'var(--success)' : 'var(--accent-primary)' 
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Section 2: Self-Growth & Skills */}
      <div>
        <div className="section-title-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Code2 size={20} color="var(--accent-blue)" />
          <h3>Self-Growth & Deliberate Practice</h3>
        </div>

        <div className="grid-2">
          {/* 14-Day Study Hours Chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">14-Day Study Volume Trend</span>
              <span className="text-xs text-muted">Daily Hours</span>
            </div>

            <div className="chart-bars-container" style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '6px', paddingTop: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              {past14Days.map((d) => {
                const heightPct = Math.min((d.studyHours / maxDailyStudyHours) * 100, 100);
                return (
                  <div key={d.dateKey} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div 
                      style={{ 
                        width: '100%', 
                        height: `${Math.max(heightPct, 4)}%`, 
                        backgroundColor: d.studyHours > 0 ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.3s ease'
                      }} 
                      title={`${d.label}: ${d.studyHours}h study, ${d.habitsDone} habits`}
                    />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      {d.label.split('/')[1] || d.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>14 days ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Skill Mastery Hours Distribution */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Skill Mastery Breakdown</span>
              <span className="text-xs text-muted">{skills.length} Tracked Skills</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              {skills.map((skill) => {
                const totalTopics = skill.topics?.length || 0;
                const completedTopics = skill.topics?.filter((t) => t.completed).length || 0;
                const hoursPct = skill.targetHours > 0 ? Math.min(Math.round((skill.practiceHours / skill.targetHours) * 100), 100) : 0;

                return (
                  <div key={skill.id} style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className="font-semibold text-primary" style={{ fontSize: '0.875rem' }}>{skill.name}</span>
                      <span className="badge badge-neutral">{skill.level}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <span>{skill.practiceHours} / {skill.targetHours} hours</span>
                      <span className="font-mono">{hoursPct}%</span>
                    </div>
                    <div className="progress-track" style={{ height: 5 }}>
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${hoursPct}%`,
                          backgroundColor: 'var(--accent-blue)' 
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

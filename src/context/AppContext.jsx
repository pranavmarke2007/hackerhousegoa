import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  storage,
  STORAGE_KEYS,
  calculateAttendance,
  calculateStreak,
  formatDateKey
} from '../services/storage';
import {
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_TASKS,
  INITIAL_HABITS,
  INITIAL_SKILLS,
  INITIAL_GOALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_TIMETABLE,
  INITIAL_STUDY_SESSIONS
} from '../data/initialData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // State variables with storage hydration
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.USER, INITIAL_USER));
  const [subjects, setSubjects] = useState(() => storage.get(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS));
  const [tasks, setTasks] = useState(() => storage.get(STORAGE_KEYS.TASKS, INITIAL_TASKS));
  const [habits, setHabits] = useState(() => storage.get(STORAGE_KEYS.HABITS, INITIAL_HABITS));
  const [skills, setSkills] = useState(() => storage.get(STORAGE_KEYS.SKILLS, INITIAL_SKILLS));
  const [goals, setGoals] = useState(() => storage.get(STORAGE_KEYS.GOALS, INITIAL_GOALS));
  const [assignments, setAssignments] = useState(() => storage.get(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS));
  const [exams, setExams] = useState(() => storage.get(STORAGE_KEYS.EXAMS, INITIAL_EXAMS));
  const [timetable, setTimetable] = useState(() => storage.get(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE));
  const [studySessions, setStudySessions] = useState(() => storage.get(STORAGE_KEYS.STUDY_SESSIONS, INITIAL_STUDY_SESSIONS));
  const [settings, setSettings] = useState(() => storage.get(STORAGE_KEYS.SETTINGS, {
    theme: 'dark',
    notifications: { assignments: true, exams: true, habits: true },
    compactView: false,
  }));

  // Auto-sync theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Persist states to localStorage whenever they change
  useEffect(() => { storage.set(STORAGE_KEYS.USER, user); }, [user]);
  useEffect(() => { storage.set(STORAGE_KEYS.SUBJECTS, subjects); }, [subjects]);
  useEffect(() => { storage.set(STORAGE_KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { storage.set(STORAGE_KEYS.HABITS, habits); }, [habits]);
  useEffect(() => { storage.set(STORAGE_KEYS.SKILLS, skills); }, [skills]);
  useEffect(() => { storage.set(STORAGE_KEYS.GOALS, goals); }, [goals]);
  useEffect(() => { storage.set(STORAGE_KEYS.ASSIGNMENTS, assignments); }, [assignments]);
  useEffect(() => { storage.set(STORAGE_KEYS.EXAMS, exams); }, [exams]);
  useEffect(() => { storage.set(STORAGE_KEYS.TIMETABLE, timetable); }, [timetable]);
  useEffect(() => { storage.set(STORAGE_KEYS.STUDY_SESSIONS, studySessions); }, [studySessions]);
  useEffect(() => { storage.set(STORAGE_KEYS.SETTINGS, settings); }, [settings]);

  // --- USER ACTIONS ---
  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  // --- SUBJECT ACTIONS & ATTENDANCE ---
  const addSubject = (subjectData) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      attendedClasses: Number(subjectData.attendedClasses) || 0,
      totalClasses: Number(subjectData.totalClasses) || 0,
      targetAttendance: Number(user.targetAttendance) || 75,
      color: subjectData.color || '#f97316',
      credits: Number(subjectData.credits) || 3,
      ...subjectData,
    };
    setSubjects((prev) => [...prev, newSub]);
    return newSub;
  };

  const updateSubject = (id, updates) => {
    setSubjects((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    // Clean up associated tasks & timetable entries
    setTasks((prev) => prev.filter((t) => t.subjectId !== id));
    setAssignments((prev) => prev.filter((a) => a.subjectId !== id));
    setExams((prev) => prev.filter((e) => e.subjectId !== id));
    setTimetable((prev) => prev.filter((tt) => tt.subjectId !== id));
  };

  const recordAttendance = (subjectId, wasAttended) => {
    setSubjects((prev) => prev.map((s) => {
      if (s.id !== subjectId) return s;
      const newAttended = wasAttended ? s.attendedClasses + 1 : s.attendedClasses;
      const newTotal = s.totalClasses + 1;
      return {
        ...s,
        attendedClasses: newAttended,
        totalClasses: newTotal,
      };
    }));
  };

  // --- TASK ACTIONS ---
  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      completed: false,
      completedAt: null,
      dueDate: taskData.dueDate || formatDateKey(new Date()),
      dueTime: taskData.dueTime || '20:00',
      priority: taskData.priority || 'medium',
      category: taskData.category || 'College',
      ...taskData,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const nextCompleted = !t.completed;
      return {
        ...t,
        completed: nextCompleted,
        completedAt: nextCompleted ? formatDateKey(new Date()) : null,
      };
    }));
  };

  // --- HABIT ACTIONS ---
  const addHabit = (habitData) => {
    const newHabit = {
      id: `habit-${Date.now()}`,
      currentStreak: 0,
      bestStreak: 0,
      history: {},
      frequency: 'daily',
      targetMinutes: Number(habitData.targetMinutes) || 30,
      ...habitData,
    };
    setHabits((prev) => [...prev, newHabit]);
    return newHabit;
  };

  const updateHabit = (id, updates) => {
    setHabits((prev) => prev.map((h) => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabit = (habitId, dateStr = formatDateKey(new Date())) => {
    setHabits((prev) => prev.map((h) => {
      if (h.id !== habitId) return h;
      const currentVal = !!h.history?.[dateStr];
      const newHistory = { ...h.history, [dateStr]: !currentVal };
      const { currentStreak } = calculateStreak(newHistory);
      const newBestStreak = Math.max(h.bestStreak || 0, currentStreak);

      // If completing today and linked to a skill, add practice contribution
      if (!currentVal && h.linkedSkillId && dateStr === formatDateKey(new Date())) {
        const addedHours = (h.targetMinutes || 30) / 60;
        setSkills((sPrev) => sPrev.map((sk) => {
          if (sk.id !== h.linkedSkillId) return sk;
          return {
            ...sk,
            practiceHours: Number((sk.practiceHours + addedHours).toFixed(1)),
            lastPracticed: dateStr,
          };
        }));
      }

      return {
        ...h,
        history: newHistory,
        currentStreak,
        bestStreak: newBestStreak,
      };
    }));
  };

  // --- SKILL ACTIONS ---
  const addSkill = (skillData) => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      level: skillData.level || 'Beginner',
      targetHours: Number(skillData.targetHours) || 60,
      practiceHours: Number(skillData.practiceHours) || 0,
      topics: skillData.topics || [],
      lastPracticed: formatDateKey(new Date()),
      ...skillData,
    };
    setSkills((prev) => [...prev, newSkill]);
    return newSkill;
  };

  const updateSkill = (id, updates) => {
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSkill = (id) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    // Unlink from habits
    setHabits((prev) => prev.map((h) => h.linkedSkillId === id ? { ...h, linkedSkillId: null } : h));
    // Unlink from goals
    setGoals((prev) => prev.map((g) => g.linkedSkillId === id ? { ...g, linkedSkillId: null } : g));
  };

  const toggleSkillTopic = (skillId, topicId) => {
    setSkills((prev) => prev.map((s) => {
      if (s.id !== skillId) return s;
      const updatedTopics = s.topics.map((top) => top.id === topicId ? { ...top, completed: !top.completed } : top);
      return {
        ...s,
        topics: updatedTopics,
        lastPracticed: formatDateKey(new Date())
      };
    }));
  };

  const addSkillTopic = (skillId, topicName) => {
    if (!topicName.trim()) return;
    setSkills((prev) => prev.map((s) => {
      if (s.id !== skillId) return s;
      return {
        ...s,
        topics: [...(s.topics || []), { id: `top-${Date.now()}`, name: topicName.trim(), completed: false }],
      };
    }));
  };

  const removeSkillTopic = (skillId, topicId) => {
    setSkills((prev) => prev.map((s) => {
      if (s.id !== skillId) return s;
      return {
        ...s,
        topics: s.topics.filter((t) => t.id !== topicId),
      };
    }));
  };

  const logSkillPractice = (skillId, minutes, notes = '') => {
    const hours = Number((minutes / 60).toFixed(1));
    const todayStr = formatDateKey(new Date());

    setSkills((prev) => prev.map((s) => {
      if (s.id !== skillId) return s;
      return {
        ...s,
        practiceHours: Number((s.practiceHours + hours).toFixed(1)),
        lastPracticed: todayStr,
      };
    }));

    // Log study session
    const newSession = {
      id: `sess-${Date.now()}`,
      date: todayStr,
      durationMinutes: minutes,
      skillId,
      subjectId: null,
      notes,
    };
    setStudySessions((prev) => [newSession, ...prev]);
  };

  // --- GOAL ACTIONS ---
  const addGoal = (goalData) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      milestones: goalData.milestones || [],
      linkedHabitIds: goalData.linkedHabitIds || [],
      linkedSkillId: goalData.linkedSkillId || null,
      ...goalData,
    };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id, updates) => {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleGoalMilestone = (goalId, milestoneId) => {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== goalId) return g;
      const updatedMilestones = (g.milestones || []).map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      return {
        ...g,
        milestones: updatedMilestones,
      };
    }));
  };

  const addGoalMilestone = (goalId, milestoneTitle, dueDate = '') => {
    if (!milestoneTitle.trim()) return;
    setGoals((prev) => prev.map((g) => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        milestones: [
          ...(g.milestones || []),
          { id: `ms-${Date.now()}`, title: milestoneTitle.trim(), completed: false, dueDate }
        ]
      };
    }));
  };

  const removeGoalMilestone = (goalId, milestoneId) => {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        milestones: g.milestones.filter((m) => m.id !== milestoneId),
      };
    }));
  };

  // --- ASSIGNMENT ACTIONS ---
  const addAssignment = (asnData) => {
    const newAsn = {
      id: `asn-${Date.now()}`,
      completed: false,
      priority: asnData.priority || 'medium',
      ...asnData,
    };
    setAssignments((prev) => [newAsn, ...prev]);
    return newAsn;
  };

  const updateAssignment = (id, updates) => {
    setAssignments((prev) => prev.map((a) => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAssignment = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAssignment = (id) => {
    setAssignments((prev) => prev.map((a) => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  // --- EXAM ACTIONS ---
  const addExam = (examData) => {
    const newExam = {
      id: `exam-${Date.now()}`,
      syllabusTopics: examData.syllabusTopics || [],
      targetMarks: Number(examData.targetMarks) || 50,
      ...examData,
    };
    setExams((prev) => [...prev, newExam]);
    return newExam;
  };

  const updateExam = (id, updates) => {
    setExams((prev) => prev.map((e) => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExam = (id) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleExamTopic = (examId, topicId) => {
    setExams((prev) => prev.map((e) => {
      if (e.id !== examId) return e;
      const updatedTopics = (e.syllabusTopics || []).map((t) =>
        t.id === topicId ? { ...t, prepared: !t.prepared } : t
      );
      return { ...e, syllabusTopics: updatedTopics };
    }));
  };

  const addExamTopic = (examId, topicName) => {
    if (!topicName.trim()) return;
    setExams((prev) => prev.map((e) => {
      if (e.id !== examId) return e;
      return {
        ...e,
        syllabusTopics: [...(e.syllabusTopics || []), { id: `et-${Date.now()}`, name: topicName.trim(), prepared: false }]
      };
    }));
  };

  // --- TIMETABLE ACTIONS ---
  const addTimetableEntry = (entry) => {
    const newEntry = { id: `tt-${Date.now()}`, ...entry };
    setTimetable((prev) => [...prev, newEntry]);
    return newEntry;
  };

  const updateTimetableEntry = (id, updates) => {
    setTimetable((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTimetableEntry = (id) => {
    setTimetable((prev) => prev.filter((t) => t.id !== id));
  };

  // --- STUDY SESSIONS ---
  const addStudySession = (session) => {
    const newSession = {
      id: `sess-${Date.now()}`,
      date: formatDateKey(new Date()),
      ...session,
    };
    setStudySessions((prev) => [newSession, ...prev]);

    // If session is tied to a skill, update practice hours
    if (session.skillId && session.durationMinutes) {
      const hours = Number((session.durationMinutes / 60).toFixed(1));
      setSkills((prev) => prev.map((s) => {
        if (s.id !== session.skillId) return s;
        return {
          ...s,
          practiceHours: Number((s.practiceHours + hours).toFixed(1)),
          lastPracticed: formatDateKey(new Date()),
        };
      }));
    }
    return newSession;
  };

  const deleteStudySession = (id) => {
    setStudySessions((prev) => prev.filter((s) => s.id !== id));
  };

  // --- SETTINGS ACTIONS ---
  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // --- BACKUP & RESET ---
  const resetToDemoData = () => {
    setUser(INITIAL_USER);
    setSubjects(INITIAL_SUBJECTS);
    setTasks(INITIAL_TASKS);
    setHabits(INITIAL_HABITS);
    setSkills(INITIAL_SKILLS);
    setGoals(INITIAL_GOALS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setExams(INITIAL_EXAMS);
    setTimetable(INITIAL_TIMETABLE);
    setStudySessions(INITIAL_STUDY_SESSIONS);
    setSettings({
      theme: 'dark',
      notifications: { assignments: true, exams: true, habits: true },
      compactView: false,
    });
    storage.clearAll();
  };

  const exportData = () => {
    const backup = {
      user,
      subjects,
      tasks,
      habits,
      skills,
      goals,
      assignments,
      exams,
      timetable,
      studySessions,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campusgrowth_backup_${formatDateKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData) => {
    try {
      if (jsonData.user) setUser(jsonData.user);
      if (jsonData.subjects) setSubjects(jsonData.subjects);
      if (jsonData.tasks) setTasks(jsonData.tasks);
      if (jsonData.habits) setHabits(jsonData.habits);
      if (jsonData.skills) setSkills(jsonData.skills);
      if (jsonData.goals) setGoals(jsonData.goals);
      if (jsonData.assignments) setAssignments(jsonData.assignments);
      if (jsonData.exams) setExams(jsonData.exams);
      if (jsonData.timetable) setTimetable(jsonData.timetable);
      if (jsonData.studySessions) setStudySessions(jsonData.studySessions);
      if (jsonData.settings) setSettings(jsonData.settings);
      return { success: true };
    } catch (err) {
      console.error('Failed to import data:', err);
      return { success: false, error: err.message };
    }
  };

  // --- DYNAMIC OVERVIEW STATS ---
  const overviewStats = useMemo(() => {
    // 1. Tasks
    const todayStr = formatDateKey(new Date());
    const relevantTasks = tasks.filter((t) => t.dueDate === todayStr || !t.dueDate);
    const totalTodayTasks = relevantTasks.length || tasks.length;
    const completedTodayTasks = (relevantTasks.length ? relevantTasks : tasks).filter((t) => t.completed).length;

    // 2. Attendance
    let totalAttended = 0;
    let totalClasses = 0;
    subjects.forEach((s) => {
      totalAttended += (s.attendedClasses || 0);
      totalClasses += (s.totalClasses || 0);
    });
    const attendancePercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 100;

    // 3. Active Skills
    const activeSkillsCount = skills.length;

    // 4. Study Hours Today
    const todaySessions = studySessions.filter((s) => s.date === todayStr);
    const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const hours = Math.floor(todayMinutes / 60);
    const mins = todayMinutes % 60;
    const studyHoursFormatted = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;

    return {
      tasks: {
        completed: completedTodayTasks,
        total: totalTodayTasks,
        text: `${completedTodayTasks} / ${totalTodayTasks} completed`,
      },
      attendance: {
        percentage: attendancePercentage,
        formatted: `${attendancePercentage.toFixed(1)}%`,
        statusColor: attendancePercentage >= (user.targetAttendance || 75) ? 'var(--success)' : 'var(--warning)',
      },
      activeSkills: activeSkillsCount,
      study: {
        totalMinutes: todayMinutes,
        formatted: todayMinutes > 0 ? studyHoursFormatted : '0m',
      },
    };
  }, [tasks, subjects, skills, studySessions, user.targetAttendance]);

  const value = {
    user,
    updateUser,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    recordAttendance,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    toggleSkillTopic,
    addSkillTopic,
    removeSkillTopic,
    logSkillPractice,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalMilestone,
    addGoalMilestone,
    removeGoalMilestone,
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignment,
    exams,
    addExam,
    updateExam,
    deleteExam,
    toggleExamTopic,
    addExamTopic,
    timetable,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
    studySessions,
    addStudySession,
    deleteStudySession,
    settings,
    updateSettings,
    overviewStats,
    resetToDemoData,
    exportData,
    importData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

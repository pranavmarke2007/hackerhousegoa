// LocalStorage Persistence & Calculation Engine

const STORAGE_KEYS = {
  USER: 'campusgrowth_user',
  SUBJECTS: 'campusgrowth_subjects',
  TASKS: 'campusgrowth_tasks',
  HABITS: 'campusgrowth_habits',
  SKILLS: 'campusgrowth_skills',
  GOALS: 'campusgrowth_goals',
  ASSIGNMENTS: 'campusgrowth_assignments',
  EXAMS: 'campusgrowth_exams',
  TIMETABLE: 'campusgrowth_timetable',
  STUDY_SESSIONS: 'campusgrowth_study_sessions',
  SETTINGS: 'campusgrowth_settings',
};

export const storage = {
  get: (key, fallback) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Failed to load ${key} from storage:`, e);
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key} to storage:`, e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove ${key}:`, e);
    }
  },
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
};

export { STORAGE_KEYS };

// Helper to format Date to YYYY-MM-DD in local time
export const formatDateKey = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate real streaks from habit completion history
export const calculateStreak = (history = {}) => {
  const today = new Date();
  const todayKey = formatDateKey(today);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  // Check if active today or yesterday
  let checkDate = new Date(today);
  if (!history[todayKey]) {
    // If not completed today, start checking from yesterday
    if (!history[yesterdayKey]) {
      return { currentStreak: 0, completedToday: false };
    }
    checkDate = yesterday;
  }

  let currentStreak = 0;
  while (true) {
    const key = formatDateKey(checkDate);
    if (history[key]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    completedToday: !!history[todayKey],
  };
};

// Calculate accurate attendance math
export const calculateAttendance = (attended = 0, total = 0, target = 75) => {
  if (total <= 0) {
    return {
      percentage: 100,
      formattedPercentage: '100.0',
      isWarning: false,
      isCritical: false,
      canMiss: 0,
      neededToReachTarget: 0,
      statusText: 'No classes yet',
      statusColor: 'var(--success)'
    };
  }

  const percentage = (attended / total) * 100;
  const targetFrac = target / 100;

  let canMiss = 0;
  let neededToReachTarget = 0;

  if (percentage >= target) {
    // How many consecutive classes can the student miss before falling below target:
    // (attended) / (total + x) >= targetFrac => attended >= targetFrac * (total + x)
    // x <= (attended - targetFrac * total) / targetFrac
    canMiss = Math.floor((attended - targetFrac * total) / targetFrac);
    if (canMiss < 0) canMiss = 0;
  } else {
    // How many consecutive classes must the student attend to reach target:
    // (attended + y) / (total + y) >= targetFrac => attended + y >= targetFrac * total + targetFrac * y
    // y * (1 - targetFrac) >= targetFrac * total - attended
    // y >= (targetFrac * total - attended) / (1 - targetFrac)
    neededToReachTarget = Math.ceil((targetFrac * total - attended) / (1 - targetFrac));
    if (neededToReachTarget < 0) neededToReachTarget = 0;
  }

  const isWarning = percentage < target;
  const isCritical = percentage < target - 10;

  let statusText = 'Safe';
  let statusColor = 'var(--success)';
  if (isCritical) {
    statusText = 'Critical';
    statusColor = 'var(--danger)';
  } else if (isWarning) {
    statusText = 'Low';
    statusColor = 'var(--warning)';
  }

  return {
    percentage,
    formattedPercentage: percentage.toFixed(1),
    isWarning,
    isCritical,
    canMiss,
    neededToReachTarget,
    statusText,
    statusColor
  };
};

// Calculate exam countdown
export const getDaysRemaining = (dateString) => {
  if (!dateString) return 0;
  const target = new Date(dateString);
  const now = new Date();
  // Strip hours for pure day difference
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = targetDay - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

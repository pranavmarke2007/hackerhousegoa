// Helper to generate dates relative to current day
const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_USER = {
  name: 'Pranav Sharma',
  college: 'Goa Engineering College',
  course: 'B.Tech Computer Engineering',
  semester: 'Semester 5 (Fall 2026)',
  targetAttendance: 75,
  dailyGoalHours: 4,
};

export const INITIAL_SUBJECTS = [
  {
    id: 'sub-dsa',
    name: 'Data Structures & Algorithms',
    code: 'CS501',
    professor: 'Dr. Suresh Naik',
    room: 'Hall 302',
    attendedClasses: 42,
    totalClasses: 46,
    color: '#f97316',
    targetAttendance: 75,
    credits: 4,
  },
  {
    id: 'sub-dbms',
    name: 'Database Management Systems',
    code: 'CS502',
    professor: 'Prof. Ananya Roy',
    room: 'Lab 4',
    attendedClasses: 33,
    totalClasses: 38,
    color: '#3b82f6',
    targetAttendance: 75,
    credits: 4,
  },
  {
    id: 'sub-webdev',
    name: 'Web Development & Architectures',
    code: 'CS503',
    professor: 'Prof. Rahul Hegde',
    room: 'Lab 2',
    attendedClasses: 28,
    totalClasses: 31,
    color: '#10b981',
    targetAttendance: 75,
    credits: 3,
  },
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: 'CS504',
    professor: 'Dr. Meera Kamat',
    room: 'Hall 204',
    attendedClasses: 25,
    totalClasses: 35, // 71.4% -> Warning! (Need 5 consecutive classes to reach 75%)
    color: '#ef4444',
    targetAttendance: 75,
    credits: 4,
  },
  {
    id: 'sub-cn',
    name: 'Computer Networks',
    code: 'CS505',
    professor: 'Prof. David Fernandes',
    room: 'Hall 108',
    attendedClasses: 29,
    totalClasses: 34, // 85.3%
    color: '#8b5cf6',
    targetAttendance: 75,
    credits: 3,
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Complete DSA Assignment 3 (Binary Search Trees)',
    subjectId: 'sub-dsa',
    category: 'College',
    priority: 'high',
    dueDate: getRelativeDate(1),
    dueTime: '23:59',
    completed: false,
    completedAt: null,
  },
  {
    id: 'task-2',
    title: 'Build Habit Tracker component in React',
    skillId: 'skill-react',
    category: 'Skill',
    priority: 'medium',
    dueDate: getRelativeDate(0),
    dueTime: '20:00',
    completed: true,
    completedAt: getRelativeDate(0),
  },
  {
    id: 'task-3',
    title: 'Revise DBMS Normalization (BCNF & 3NF)',
    subjectId: 'sub-dbms',
    category: 'College',
    priority: 'high',
    dueDate: getRelativeDate(0),
    dueTime: '18:30',
    completed: false,
    completedAt: null,
  },
  {
    id: 'task-4',
    title: 'Solve 2 Binary Search problems on LeetCode',
    skillId: 'skill-dsa',
    category: 'Skill',
    priority: 'high',
    dueDate: getRelativeDate(0),
    dueTime: '21:30',
    completed: false,
    completedAt: null,
  },
  {
    id: 'task-5',
    title: 'Review OS Semaphore vs Mutex notes',
    subjectId: 'sub-os',
    category: 'College',
    priority: 'low',
    dueDate: getRelativeDate(2),
    dueTime: '17:00',
    completed: true,
    completedAt: getRelativeDate(-1),
  }
];

export const INITIAL_HABITS = [
  {
    id: 'habit-1',
    name: 'DSA Problem Practice (1 hour)',
    category: 'Coding',
    linkedSkillId: 'skill-dsa',
    frequency: 'daily',
    targetMinutes: 60,
    currentStreak: 12,
    bestStreak: 19,
    // Realistic recent days completions
    history: {
      [getRelativeDate(-6)]: true,
      [getRelativeDate(-5)]: true,
      [getRelativeDate(-4)]: true,
      [getRelativeDate(-3)]: true,
      [getRelativeDate(-2)]: true,
      [getRelativeDate(-1)]: true,
      [getRelativeDate(0)]: true,
    },
    reminderTime: '19:00',
  },
  {
    id: 'habit-2',
    name: 'React / Frontend Practice',
    category: 'Development',
    linkedSkillId: 'skill-react',
    frequency: 'daily',
    targetMinutes: 45,
    currentStreak: 7,
    bestStreak: 14,
    history: {
      [getRelativeDate(-6)]: true,
      [getRelativeDate(-5)]: false,
      [getRelativeDate(-4)]: true,
      [getRelativeDate(-3)]: true,
      [getRelativeDate(-2)]: true,
      [getRelativeDate(-1)]: true,
      [getRelativeDate(0)]: false,
    },
    reminderTime: '16:00',
  },
  {
    id: 'habit-3',
    name: 'Workout / Physical Fitness',
    category: 'Health',
    linkedSkillId: null,
    frequency: 'daily',
    targetMinutes: 40,
    currentStreak: 4,
    bestStreak: 21,
    history: {
      [getRelativeDate(-6)]: true,
      [getRelativeDate(-5)]: true,
      [getRelativeDate(-4)]: false,
      [getRelativeDate(-3)]: true,
      [getRelativeDate(-2)]: true,
      [getRelativeDate(-1)]: true,
      [getRelativeDate(0)]: true,
    },
    reminderTime: '06:30',
  },
  {
    id: 'habit-4',
    name: 'Technical Reading / Docs (20 mins)',
    category: 'Knowledge',
    linkedSkillId: 'skill-backend',
    frequency: 'daily',
    targetMinutes: 20,
    currentStreak: 9,
    bestStreak: 15,
    history: {
      [getRelativeDate(-6)]: true,
      [getRelativeDate(-5)]: true,
      [getRelativeDate(-4)]: true,
      [getRelativeDate(-3)]: true,
      [getRelativeDate(-2)]: true,
      [getRelativeDate(-1)]: true,
      [getRelativeDate(0)]: false,
    },
    reminderTime: '22:00',
  },
  {
    id: 'habit-5',
    name: 'Spoken English & Communication Prep',
    category: 'Self Growth',
    linkedSkillId: 'skill-comm',
    frequency: 'daily',
    targetMinutes: 15,
    currentStreak: 3,
    bestStreak: 8,
    history: {
      [getRelativeDate(-6)]: false,
      [getRelativeDate(-5)]: true,
      [getRelativeDate(-4)]: true,
      [getRelativeDate(-3)]: false,
      [getRelativeDate(-2)]: true,
      [getRelativeDate(-1)]: true,
      [getRelativeDate(0)]: false,
    },
    reminderTime: '21:00',
  }
];

export const INITIAL_SKILLS = [
  {
    id: 'skill-dsa',
    name: 'Java + Data Structures & Algorithms',
    category: 'Core Computer Science',
    level: 'Intermediate',
    targetHours: 120,
    practiceHours: 58.5,
    topics: [
      { id: 'top-1', name: 'Arrays & Two Pointers', completed: true },
      { id: 'top-2', name: 'Strings & HashMaps', completed: true },
      { id: 'top-3', name: 'Recursion & Backtracking', completed: true },
      { id: 'top-4', name: 'Linked Lists', completed: true },
      { id: 'top-5', name: 'Stacks & Queues', completed: true },
      { id: 'top-6', name: 'Binary Search', completed: false },
      { id: 'top-7', name: 'Binary Trees & BST', completed: false },
      { id: 'top-8', name: 'Dynamic Programming', completed: false },
      { id: 'top-9', name: 'Graph Algorithms', completed: false },
    ],
    lastPracticed: getRelativeDate(0),
  },
  {
    id: 'skill-react',
    name: 'Modern React & State Architectures',
    category: 'Frontend Engineering',
    level: 'Intermediate',
    targetHours: 80,
    practiceHours: 46.0,
    topics: [
      { id: 'top-r1', name: 'Component Lifecycles & Hooks', completed: true },
      { id: 'top-r2', name: 'Custom Hooks & Reusability', completed: true },
      { id: 'top-r3', name: 'Context API & State Management', completed: true },
      { id: 'top-r4', name: 'Performance Optimization (useMemo/useCallback)', completed: false },
      { id: 'top-r5', name: 'SSR & Next.js App Router', completed: false },
    ],
    lastPracticed: getRelativeDate(-1),
  },
  {
    id: 'skill-backend',
    name: 'Node.js & Distributed Backend Systems',
    category: 'Backend Engineering',
    level: 'Beginner',
    targetHours: 100,
    practiceHours: 24.5,
    topics: [
      { id: 'top-b1', name: 'REST API Design & Express', completed: true },
      { id: 'top-b2', name: 'PostgreSQL & ORMs (Prisma)', completed: true },
      { id: 'top-b3', name: 'JWT Auth & Middleware', completed: true },
      { id: 'top-b4', name: 'Redis Caching & PubSub', completed: false },
      { id: 'top-b5', name: 'Message Queues (RabbitMQ/Kafka)', completed: false },
    ],
    lastPracticed: getRelativeDate(-2),
  },
  {
    id: 'skill-comm',
    name: 'Technical Communication & Behavioral Interviews',
    category: 'Career & Soft Skills',
    level: 'Intermediate',
    targetHours: 30,
    practiceHours: 14.0,
    topics: [
      { id: 'top-c1', name: 'STAR Method Storytelling', completed: true },
      { id: 'top-c2', name: 'System Design Explanation', completed: true },
      { id: 'top-c3', name: 'Live Coding Walkthrough Polish', completed: false },
      { id: 'top-c4', name: 'Mock Technical Interview 1 & 2', completed: false },
    ],
    lastPracticed: getRelativeDate(-1),
  }
];

export const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Crack Summer Software Engineering Internship',
    description: 'Solve 150+ LeetCode problems, finish 2 full-stack portfolio systems, and pass college exams with 8.5+ CGPA.',
    category: 'Career',
    deadline: getRelativeDate(75),
    linkedSkillId: 'skill-dsa',
    linkedHabitIds: ['habit-1', 'habit-2'],
    milestones: [
      { id: 'ms-1', title: 'Complete 50 Medium DSA Questions', completed: true, dueDate: getRelativeDate(-10) },
      { id: 'ms-2', title: 'Publish CampusGrowth OS with full features', completed: true, dueDate: getRelativeDate(0) },
      { id: 'ms-3', title: 'Solve NeetCode 150 Trees & Graphs', completed: false, dueDate: getRelativeDate(30) },
      { id: 'ms-4', title: 'Complete 3 Mock Interviews with Peers', completed: false, dueDate: getRelativeDate(55) },
      { id: 'ms-5', title: 'Submit 20 Targeted Internship Applications', completed: false, dueDate: getRelativeDate(70) },
    ],
  },
  {
    id: 'goal-2',
    title: 'Score 85%+ in Semester 5 University Midterms',
    description: 'Keep attendance above 80% across all subjects and finish all assignments 48 hours before deadlines.',
    category: 'Academics',
    deadline: getRelativeDate(25),
    linkedSkillId: null,
    linkedHabitIds: ['habit-4'],
    milestones: [
      { id: 'ms-201', title: 'Bring OS Attendance back to 75%+', completed: false, dueDate: getRelativeDate(7) },
      { id: 'ms-202', title: 'Complete DBMS Lab 4 & 5 Submissions', completed: true, dueDate: getRelativeDate(-2) },
      { id: 'ms-203', title: 'Solve last 3 years university question papers for DSA', completed: false, dueDate: getRelativeDate(18) },
    ],
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asn-1',
    title: 'DSA Assignment 3: Red-Black & AVL Trees Implementation',
    subjectId: 'sub-dsa',
    deadline: getRelativeDate(2),
    priority: 'high',
    completed: false,
    notes: 'Implement insertion and rotation operations in Java with test cases.',
  },
  {
    id: 'asn-2',
    title: 'DBMS Lab Practical 4: Complex SQL Joins & Subqueries',
    subjectId: 'sub-dbms',
    deadline: getRelativeDate(4),
    priority: 'medium',
    completed: false,
    notes: 'Submit .sql script and query execution plan screenshots.',
  },
  {
    id: 'asn-3',
    title: 'Web Dev Project Phase 1: Responsive Layout & State Engine',
    subjectId: 'sub-webdev',
    deadline: getRelativeDate(6),
    priority: 'high',
    completed: false,
    notes: 'Verify mobile viewport breakpoints and zero horizontal overflow.',
  },
  {
    id: 'asn-4',
    title: 'OS Assignment 2: CPU Scheduling Algorithms (SJF & Round Robin)',
    subjectId: 'sub-os',
    deadline: getRelativeDate(-3),
    priority: 'medium',
    completed: true,
    notes: 'Submitted via college portal.',
  },
  {
    id: 'asn-5',
    title: 'Computer Networks Packet Sniffing Wireshark Lab Report',
    subjectId: 'sub-cn',
    deadline: getRelativeDate(-6),
    priority: 'low',
    completed: true,
    notes: 'Graded: 19/20.',
  }
];

export const INITIAL_EXAMS = [
  {
    id: 'exam-1',
    subjectId: 'sub-dsa',
    examName: 'Data Structures Midterm Examination',
    date: getRelativeDate(12),
    time: '10:00 - 13:00',
    room: 'Auditorium Hall B',
    targetMarks: 50,
    weightage: 'Midterm (30%)',
    syllabusTopics: [
      { id: 'et-1', name: 'Asymptotic Analysis & Master Theorem', prepared: true },
      { id: 'et-2', name: 'Stacks, Queues & Priority Queues', prepared: true },
      { id: 'et-3', name: 'Trees, AVL & Heaps', prepared: true },
      { id: 'et-4', name: 'Hashing & Collision Resolution', prepared: true },
      { id: 'et-5', name: 'Divide & Conquer, Binary Search', prepared: false },
      { id: 'et-6', name: 'Graph Traversals (BFS/DFS)', prepared: false },
    ],
  },
  {
    id: 'exam-2',
    subjectId: 'sub-dbms',
    examName: 'DBMS Midterm Theory & Lab Exam',
    date: getRelativeDate(16),
    time: '14:00 - 17:00',
    room: 'Computer Lab 3',
    targetMarks: 50,
    weightage: 'Midterm (30%)',
    syllabusTopics: [
      { id: 'et-21', name: 'ER Diagrams & Relational Model', prepared: true },
      { id: 'et-22', name: 'Relational Algebra & Tuple Calculus', prepared: true },
      { id: 'et-23', name: 'Functional Dependencies & Normal Forms (1NF-BCNF)', prepared: false },
      { id: 'et-24', name: 'Transactions, ACID & Concurrency Control', prepared: false },
    ],
  },
  {
    id: 'exam-3',
    subjectId: 'sub-os',
    examName: 'Operating Systems Midterm Assessment',
    date: getRelativeDate(21),
    time: '10:00 - 12:30',
    room: 'Hall 204',
    targetMarks: 50,
    weightage: 'Midterm (25%)',
    syllabusTopics: [
      { id: 'et-31', name: 'Process Management & Threads', prepared: true },
      { id: 'et-32', name: 'CPU Scheduling Algorithms', prepared: true },
      { id: 'et-33', name: 'Synchronization & Deadlocks (Banker\'s Alg)', prepared: false },
      { id: 'et-34', name: 'Virtual Memory & Page Replacement', prepared: false },
    ],
  }
];

// Weekly Timetable structure
export const INITIAL_TIMETABLE = [
  // Monday
  { id: 'tt-1', day: 1, dayName: 'Monday', startTime: '09:00', endTime: '10:00', subjectId: 'sub-dsa', type: 'Lecture', room: 'Hall 302' },
  { id: 'tt-2', day: 1, dayName: 'Monday', startTime: '10:00', endTime: '11:00', subjectId: 'sub-cn', type: 'Lecture', room: 'Hall 108' },
  { id: 'tt-3', day: 1, dayName: 'Monday', startTime: '11:15', endTime: '13:15', subjectId: 'sub-dbms', type: 'Lab', room: 'Lab 4' },
  { id: 'tt-4', day: 1, dayName: 'Monday', startTime: '14:00', endTime: '15:00', subjectId: 'sub-webdev', type: 'Lecture', room: 'Lab 2' },

  // Tuesday
  { id: 'tt-5', day: 2, dayName: 'Tuesday', startTime: '09:00', endTime: '10:00', subjectId: 'sub-os', type: 'Lecture', room: 'Hall 204' },
  { id: 'tt-6', day: 2, dayName: 'Tuesday', startTime: '10:00', endTime: '11:00', subjectId: 'sub-dsa', type: 'Lecture', room: 'Hall 302' },
  { id: 'tt-7', day: 2, dayName: 'Tuesday', startTime: '11:15', endTime: '12:15', subjectId: 'sub-dbms', type: 'Lecture', room: 'Hall 302' },
  { id: 'tt-8', day: 2, dayName: 'Tuesday', startTime: '14:00', endTime: '16:00', subjectId: 'sub-webdev', type: 'Lab', room: 'Lab 2' },

  // Wednesday
  { id: 'tt-9', day: 3, dayName: 'Wednesday', startTime: '09:00', endTime: '10:00', subjectId: 'sub-cn', type: 'Lecture', room: 'Hall 108' },
  { id: 'tt-10', day: 3, dayName: 'Wednesday', startTime: '10:00', endTime: '11:00', subjectId: 'sub-os', type: 'Lecture', room: 'Hall 204' },
  { id: 'tt-11', day: 3, dayName: 'Wednesday', startTime: '11:15', endTime: '13:15', subjectId: 'sub-dsa', type: 'Lab', room: 'Lab 1' },
  { id: 'tt-12', day: 3, dayName: 'Wednesday', startTime: '14:00', endTime: '15:00', subjectId: 'sub-dbms', type: 'Lecture', room: 'Hall 302' },

  // Thursday
  { id: 'tt-13', day: 4, dayName: 'Thursday', startTime: '09:00', endTime: '10:00', subjectId: 'sub-webdev', type: 'Lecture', room: 'Lab 2' },
  { id: 'tt-14', day: 4, dayName: 'Thursday', startTime: '10:00', endTime: '11:00', subjectId: 'sub-dsa', type: 'Lecture', room: 'Hall 302' },
  { id: 'tt-15', day: 4, dayName: 'Thursday', startTime: '11:15', endTime: '12:15', subjectId: 'sub-os', type: 'Lecture', room: 'Hall 204' },
  { id: 'tt-16', day: 4, dayName: 'Thursday', startTime: '14:00', endTime: '16:00', subjectId: 'sub-cn', type: 'Lab', room: 'Lab 3' },

  // Friday
  { id: 'tt-17', day: 5, dayName: 'Friday', startTime: '09:00', endTime: '10:00', subjectId: 'sub-dbms', type: 'Lecture', room: 'Hall 302' },
  { id: 'tt-18', day: 5, dayName: 'Friday', startTime: '10:00', endTime: '11:00', subjectId: 'sub-cn', type: 'Lecture', room: 'Hall 108' },
  { id: 'tt-19', day: 5, dayName: 'Friday', startTime: '11:15', endTime: '12:15', subjectId: 'sub-os', type: 'Tutorial', room: 'Hall 204' },
  { id: 'tt-20', day: 5, dayName: 'Friday', startTime: '14:00', endTime: '15:30', subjectId: 'sub-webdev', type: 'Project Review', room: 'Lab 2' },
];

export const INITIAL_STUDY_SESSIONS = [
  { id: 'sess-1', date: getRelativeDate(0), durationMinutes: 60, skillId: 'skill-dsa', subjectId: 'sub-dsa', notes: 'Solved 2 Binary Search questions on LeetCode' },
  { id: 'sess-2', date: getRelativeDate(0), durationMinutes: 45, skillId: 'skill-react', subjectId: 'sub-webdev', notes: 'Built component structure for college timetable' },
  { id: 'sess-3', date: getRelativeDate(-1), durationMinutes: 90, skillId: 'skill-dsa', subjectId: 'sub-dsa', notes: 'Tree traversals and recursion trees' },
  { id: 'sess-4', date: getRelativeDate(-2), durationMinutes: 75, skillId: 'skill-backend', subjectId: 'sub-dbms', notes: 'Database indexing and B+ Tree review' },
  { id: 'sess-5', date: getRelativeDate(-3), durationMinutes: 60, skillId: 'skill-comm', subjectId: null, notes: 'Mock technical intro practice' },
  { id: 'sess-6', date: getRelativeDate(-4), durationMinutes: 120, skillId: 'skill-dsa', subjectId: 'sub-dsa', notes: 'Dynamic programming memoization vs tabulation' },
];

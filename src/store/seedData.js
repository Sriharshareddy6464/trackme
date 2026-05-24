import { v4 as uuidv4 } from 'uuid';

/**
 * Populates the store with 2 sample goals, each with 2 phases and 2 tasks per phase.
 * Called from useTrackingStore initializer when goals is empty.
 * @param {Function} set - Zustand set function
 */
export function seedData(set) {
  const now = new Date().toISOString();

  // ── IDs ──────────────────────────────────────────────────────────────────
  const goal1Id = uuidv4();
  const goal2Id = uuidv4();

  const phase1_1Id = uuidv4(); // Goal 1 – Phase 1
  const phase1_2Id = uuidv4(); // Goal 1 – Phase 2
  const phase2_1Id = uuidv4(); // Goal 2 – Phase 1
  const phase2_2Id = uuidv4(); // Goal 2 – Phase 2

  const task1_1_1Id = uuidv4(); // Goal1 Phase1 Task1
  const task1_1_2Id = uuidv4(); // Goal1 Phase1 Task2
  const task1_2_1Id = uuidv4(); // Goal1 Phase2 Task1
  const task1_2_2Id = uuidv4(); // Goal1 Phase2 Task2
  const task2_1_1Id = uuidv4(); // Goal2 Phase1 Task1
  const task2_1_2Id = uuidv4(); // Goal2 Phase1 Task2
  const task2_2_1Id = uuidv4(); // Goal2 Phase2 Task1
  const task2_2_2Id = uuidv4(); // Goal2 Phase2 Task2

  // ── Goals ─────────────────────────────────────────────────────────────────
  const goals = {
    [goal1Id]: {
      id: goal1Id,
      title: 'Launch Personal Website',
      description: 'Design and build a personal portfolio website to showcase projects and skills.',
      color: '#7F77DD',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      status: 'active',
      phaseIds: [phase1_1Id, phase1_2Id],
      createdAt: now,
      updatedAt: now,
    },
    [goal2Id]: {
      id: goal2Id,
      title: 'Learn TypeScript',
      description: 'Master TypeScript fundamentals and advanced patterns to improve code quality.',
      color: '#1D9E75',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
      status: 'active',
      phaseIds: [phase2_1Id, phase2_2Id],
      createdAt: now,
      updatedAt: now,
    },
  };

  // ── Phases ────────────────────────────────────────────────────────────────
  const phases = {
    [phase1_1Id]: {
      id: phase1_1Id,
      goalId: goal1Id,
      title: 'Design & Planning',
      description: 'Define the visual identity and site structure.',
      order: 0,
      status: 'in_progress',
      taskIds: [task1_1_1Id, task1_1_2Id],
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    [phase1_2Id]: {
      id: phase1_2Id,
      goalId: goal1Id,
      title: 'Development',
      description: 'Build and deploy the website.',
      order: 1,
      status: 'not_started',
      taskIds: [task1_2_1Id, task1_2_2Id],
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    [phase2_1Id]: {
      id: phase2_1Id,
      goalId: goal2Id,
      title: 'Fundamentals',
      description: 'Learn core TypeScript concepts and type system.',
      order: 0,
      status: 'in_progress',
      taskIds: [task2_1_1Id, task2_1_2Id],
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    [phase2_2Id]: {
      id: phase2_2Id,
      goalId: goal2Id,
      title: 'Advanced Topics',
      description: 'Explore generics, decorators, and real-world TypeScript patterns.',
      order: 1,
      status: 'not_started',
      taskIds: [task2_2_1Id, task2_2_2Id],
      startDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  };

  // ── Tasks ─────────────────────────────────────────────────────────────────
  const tasks = {
    [task1_1_1Id]: {
      id: task1_1_1Id,
      phaseId: phase1_1Id,
      goalId: goal1Id,
      title: 'Create wireframes',
      description: 'Sketch low-fidelity wireframes for all key pages.',
      priority: 'high',
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 4,
      actualHours: 0,
      tags: ['design', 'planning'],
      todoIds: [],
      createdAt: now,
    },
    [task1_1_2Id]: {
      id: task1_1_2Id,
      phaseId: phase1_1Id,
      goalId: goal1Id,
      title: 'Define color palette',
      description: 'Choose a cohesive color scheme and typography for the site.',
      priority: 'medium',
      status: 'ongoing',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 2,
      actualHours: 1,
      tags: ['design'],
      todoIds: [],
      createdAt: now,
    },
    [task1_2_1Id]: {
      id: task1_2_1Id,
      phaseId: phase1_2Id,
      goalId: goal1Id,
      title: 'Set up React project',
      description: 'Initialize Vite + React project with routing and base configuration.',
      priority: 'high',
      status: 'todo',
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 3,
      actualHours: 0,
      tags: ['development', 'setup'],
      todoIds: [],
      createdAt: now,
    },
    [task1_2_2Id]: {
      id: task1_2_2Id,
      phaseId: phase1_2Id,
      goalId: goal1Id,
      title: 'Build homepage component',
      description: 'Implement the hero section and navigation for the homepage.',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 6,
      actualHours: 0,
      tags: ['development'],
      todoIds: [],
      createdAt: now,
    },
    [task2_1_1Id]: {
      id: task2_1_1Id,
      phaseId: phase2_1Id,
      goalId: goal2Id,
      title: 'Read TypeScript handbook',
      description: 'Work through the official TypeScript handbook from start to finish.',
      priority: 'high',
      status: 'ongoing',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 8,
      actualHours: 3,
      tags: ['learning', 'typescript'],
      todoIds: [],
      createdAt: now,
    },
    [task2_1_2Id]: {
      id: task2_1_2Id,
      phaseId: phase2_1Id,
      goalId: goal2Id,
      title: 'Complete basic exercises',
      description: 'Solve beginner TypeScript exercises on TypeScript Exercises platform.',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 5,
      actualHours: 0,
      tags: ['learning', 'practice'],
      todoIds: [],
      createdAt: now,
    },
    [task2_2_1Id]: {
      id: task2_2_1Id,
      phaseId: phase2_2Id,
      goalId: goal2Id,
      title: 'Study generics',
      description: 'Deep-dive into TypeScript generics, constraints, and utility types.',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 6,
      actualHours: 0,
      tags: ['typescript', 'advanced'],
      todoIds: [],
      createdAt: now,
    },
    [task2_2_2Id]: {
      id: task2_2_2Id,
      phaseId: phase2_2Id,
      goalId: goal2Id,
      title: 'Build a typed project',
      description: 'Create a small real-world project fully typed with TypeScript.',
      priority: 'high',
      status: 'todo',
      dueDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 12,
      actualHours: 0,
      tags: ['typescript', 'project'],
      todoIds: [],
      createdAt: now,
    },
  };

  set({ goals, phases, tasks, todos: {} });
}

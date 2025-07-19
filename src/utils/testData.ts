import { Resource, Project, Holiday, ProjectStatus } from '../types';
import { RESOURCE_COLORS } from '../constants/colors';
import { 
  formatDate, 
  addDays, 
  getTestDateRanges, 
  getRandomDateInRange, 
  addWorkDays, 
  getWorkDaysCount,
  generateDynamicHolidayDates,
  addMonths 
} from './dateUtils';

/**
 * Generate project with realistic work day calculations
 */
const generateProject = (
  id: string,
  title: string,
  description: string,
  resourceId: string,
  startDate: Date,
  duration: number,
  priority: 'low' | 'medium' | 'high',
  status: ProjectStatus,
  progress: number = 0
): Project => {
  const endDate = addWorkDays(startDate, duration);
  const deadline = addDays(endDate, Math.floor(Math.random() * 7) + 1); // 1-7 days after end
  const workDaysNeeded = getWorkDaysCount(startDate, endDate);
  const estimatedHours = workDaysNeeded * 8; // 8 hours per work day
  const actualHours = Math.floor(estimatedHours * (progress / 100));
  
  // Calculate health score based on progress and timeline
  let healthScore = 90;
  if (status === 'at-risk') healthScore = Math.floor(Math.random() * 30) + 20; // 20-50
  else if (status === 'overdue') healthScore = Math.floor(Math.random() * 40) + 10; // 10-50
  else if (status === 'on-hold') healthScore = Math.floor(Math.random() * 30) + 60; // 60-90
  else if (status === 'completed') healthScore = Math.floor(Math.random() * 20) + 80; // 80-100
  else healthScore = Math.floor(Math.random() * 30) + 70; // 70-100
  
  const project: Project = {
    id,
    title,
    description,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    deadline: formatDate(deadline),
    workDaysNeeded,
    resourceId,
    priority,
    status,
    progress,
    estimatedHours,
    actualHours,
    healthScore,
  };
  
  if (status === 'completed') {
    project.completedDate = formatDate(addDays(endDate, -Math.floor(Math.random() * 5)));
  }
  
  return project;
};

export const generateTestData = (): { resources: Resource[]; projects: Project[]; holidays: Holiday[] } => {
  const today = new Date();
  const dateRanges = getTestDateRanges();
  
  const resources: Resource[] = [
    {
      id: '1',
      name: 'রাফিন আহমেদ',
      role: 'Frontend Developer',
      color: RESOURCE_COLORS[0],
      department: 'Engineering',
    },
    {
      id: '2',
      name: 'তানভীর হাসান',
      role: 'Backend Developer',
      color: RESOURCE_COLORS[1],
      department: 'Engineering',
    },
    {
      id: '3',
      name: 'সাদিয়া খাতুন',
      role: 'UI/UX Designer',
      color: RESOURCE_COLORS[2],
      department: 'Design',
    },
    {
      id: '4',
      name: 'ইমরান হোসেন',
      role: 'QA Engineer',
      color: RESOURCE_COLORS[3],
      department: 'Quality Assurance',
    },
    {
      id: '5',
      name: 'নাফিসা আক্তার',
      role: 'DevOps Engineer',
      color: RESOURCE_COLORS[4],
      department: 'Infrastructure',
    },
    {
      id: '6',
      name: 'আরিফ রহমান',
      role: 'Product Manager',
      color: RESOURCE_COLORS[5],
      department: 'Product',
    },
  ];

  // Generate dynamic projects spanning previous, current, and next month
  const projects: Project[] = [];
  
  // Projects from previous month (completed and ongoing)
  projects.push(
    // Completed projects from previous month
    generateProject(
      'p1',
      'Pathao Brand Guidelines',
      'Establishing comprehensive brand guidelines and design standards',
      '3',
      getRandomDateInRange(dateRanges.prevMonth.start, addDays(dateRanges.prevMonth.end, -10)),
      10,
      'medium',
      'completed',
      100
    ),
    generateProject(
      'p2',
      'Pathao Legacy Code Cleanup',
      'Refactoring and cleaning up legacy codebase',
      '2',
      getRandomDateInRange(dateRanges.prevMonth.start, addDays(dateRanges.prevMonth.end, -15)),
      8,
      'low',
      'completed',
      100
    ),
    
    // Projects started in previous month, continuing to current month
    generateProject(
      'p3',
      'Pathao Rider App UI',
      'Redesigning the rider mobile application interface',
      '1',
      getRandomDateInRange(dateRanges.prevMonth.start, addDays(dateRanges.prevMonth.end, -20)),
      25,
      'high',
      'active',
      75
    ),
    generateProject(
      'p4',
      'Pathao API Gateway',
      'Implementing microservices API gateway architecture',
      '2',
      getRandomDateInRange(dateRanges.prevMonth.start, addDays(dateRanges.prevMonth.end, -15)),
      30,
      'high',
      'at-risk',
      60
    ),
    generateProject(
      'p5',
      'Pathao CI/CD Setup',
      'Setting up continuous integration and deployment pipelines',
      '5',
      getRandomDateInRange(dateRanges.prevMonth.start, addDays(dateRanges.prevMonth.end, -12)),
      20,
      'high',
      'active',
      85
    )
  );
  
  // Projects starting in current month
  projects.push(
    generateProject(
      'p6',
      'Pathao Customer Research',
      'Conducting user research and customer journey mapping',
      '3',
      getRandomDateInRange(dateRanges.currentMonth.start, addDays(dateRanges.currentMonth.start, 5)),
      15,
      'high',
      'active',
      45
    ),
    generateProject(
      'p7',
      'Pathao App Testing',
      'Comprehensive testing of mobile and web applications',
      '4',
      getRandomDateInRange(dateRanges.currentMonth.start, addDays(dateRanges.currentMonth.start, 7)),
      18,
      'high',
      'active',
      70
    ),
    generateProject(
      'p8',
      'Pathao Expansion Strategy',
      'Strategic planning for market expansion and growth',
      '6',
      getRandomDateInRange(dateRanges.currentMonth.start, addDays(dateRanges.currentMonth.start, 3)),
      12,
      'high',
      'overdue',
      50
    ),
    generateProject(
      'p9',
      'Pathao Food Web',
      'Building responsive web application for food delivery',
      '1',
      getRandomDateInRange(addDays(dateRanges.currentMonth.start, 10), addDays(dateRanges.currentMonth.start, 15)),
      12,
      'medium',
      'planning',
      10
    ),
    generateProject(
      'p10',
      'Pathao User DB Migration',
      'Migrating user database to new infrastructure',
      '2',
      getRandomDateInRange(addDays(dateRanges.currentMonth.start, 12), addDays(dateRanges.currentMonth.start, 18)),
      8,
      'high',
      'planning',
      5
    )
  );
  
  // Projects starting in next month
  projects.push(
    generateProject(
      'p11',
      'Pathao Design System',
      'Creating unified design system for all Pathao products',
      '1',
      getRandomDateInRange(dateRanges.nextMonth.start, addDays(dateRanges.nextMonth.start, 10)),
      15,
      'low',
      'planning',
      0
    ),
    generateProject(
      'p12',
      'Pathao Backend Optimization',
      'Performance optimization of backend services',
      '2',
      getRandomDateInRange(dateRanges.nextMonth.start, addDays(dateRanges.nextMonth.start, 5)),
      20,
      'medium',
      'planning',
      0
    ),
    generateProject(
      'p13',
      'Pathao Courier Prototype',
      'Creating interactive prototypes for courier service',
      '3',
      getRandomDateInRange(addDays(dateRanges.nextMonth.start, 8), addDays(dateRanges.nextMonth.start, 15)),
      12,
      'medium',
      'planning',
      0
    ),
    generateProject(
      'p14',
      'Pathao Load Testing',
      'Performance and load testing for peak traffic scenarios',
      '4',
      getRandomDateInRange(addDays(dateRanges.nextMonth.start, 10), addDays(dateRanges.nextMonth.start, 18)),
      10,
      'medium',
      'planning',
      0
    ),
    generateProject(
      'p15',
      'Pathao Cloud Infrastructure',
      'Migrating and optimizing cloud infrastructure',
      '5',
      getRandomDateInRange(addDays(dateRanges.nextMonth.start, 5), addDays(dateRanges.nextMonth.start, 12)),
      15,
      'medium',
      'planning',
      0
    ),
    generateProject(
      'p16',
      'Pathao Security Audit',
      'Security vulnerability assessment and penetration testing',
      '4',
      getRandomDateInRange(addDays(dateRanges.nextMonth.start, 15), addDays(dateRanges.nextMonth.start, 22)),
      18,
      'high',
      'planning',
      0
    ),
    generateProject(
      'p17',
      'Pathao Market Analysis',
      'Comprehensive market research and competitor analysis',
      '6',
      getRandomDateInRange(addDays(dateRanges.nextMonth.start, 8), addDays(dateRanges.nextMonth.start, 15)),
      10,
      'medium',
      'planning',
      0
    ),
    generateProject(
      'p18',
      'Pathao Monitoring System',
      'Implementing comprehensive monitoring and alerting system',
      '5',
      getRandomDateInRange(addDays(dateRanges.nextMonth.start, 20), addDays(dateRanges.nextMonth.end, -5)),
      12,
      'low',
      'planning',
      0
    ),
    generateProject(
      'p19',
      'Pathao 2025 Roadmap',
      'Long-term strategic roadmap and vision planning',
      '6',
      getRandomDateInRange(addDays(dateRanges.nextMonth.start, 25), dateRanges.nextMonth.end),
      8,
      'low',
      'on-hold',
      0
    )
  );

  // Generate dynamic holidays for current year
  const currentYear = today.getFullYear();
  const dynamicHolidayDates = generateDynamicHolidayDates(currentYear);
  
  const holidays: Holiday[] = [
    {
      id: 'h1',
      name: 'শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস',
      date: dynamicHolidayDates.languageDay,
      type: 'national',
      recurring: true,
      description: 'International Mother Language Day',
    },
    {
      id: 'h2',
      name: 'স্বাধীনতা দিবস',
      date: dynamicHolidayDates.independenceDay,
      type: 'national',
      recurring: true,
      description: 'Independence Day of Bangladesh',
    },
    {
      id: 'h3',
      name: 'বাংলা নববর্ষ',
      date: dynamicHolidayDates.bengaliNewYear,
      type: 'national',
      recurring: true,
      description: 'Bengali New Year',
    },
    {
      id: 'h4',
      name: 'মে দিবস',
      date: dynamicHolidayDates.labourDay,
      type: 'national',
      recurring: true,
      description: 'International Labour Day',
    },
    {
      id: 'h5',
      name: 'বিজয় দিবস',
      date: dynamicHolidayDates.victoryDay,
      type: 'national',
      recurring: true,
      description: 'Victory Day of Bangladesh',
    },
    {
      id: 'h6',
      name: 'ঈদুল ফিতর',
      date: dynamicHolidayDates.eidFitr,
      type: 'religious',
      recurring: false,
      description: 'Festival of Breaking the Fast',
    },
    {
      id: 'h7',
      name: 'ঈদুল আযহা',
      date: dynamicHolidayDates.eidAdha,
      type: 'religious',
      recurring: false,
      description: 'Festival of Sacrifice',
    },
    // Add holidays that might fall within our test date range
    {
      id: 'h8',
      name: 'Team Building Day',
      date: formatDate(getRandomDateInRange(dateRanges.currentMonth.start, dateRanges.currentMonth.end)),
      type: 'company',
      recurring: false,
      description: 'Pathao team building and activities day',
    },
    {
      id: 'h9',
      name: 'System Maintenance Day',
      date: formatDate(getRandomDateInRange(dateRanges.nextMonth.start, addDays(dateRanges.nextMonth.start, 15))),
      type: 'company',
      recurring: false,
      description: 'Scheduled system maintenance and upgrades',
    },
  ];

  return { resources, projects, holidays };
};

/**
 * Generate sample leave data spanning multiple months
 */
export const generateLeaveData = () => {
  const dateRanges = getTestDateRanges();
  const leave = [];
  
  // Previous month leave
  leave.push({
    id: 'l1',
    resourceId: '3',
    type: 'vacation',
    startDate: formatDate(getRandomDateInRange(dateRanges.prevMonth.start, addDays(dateRanges.prevMonth.end, -10))),
    endDate: formatDate(getRandomDateInRange(addDays(dateRanges.prevMonth.start, 10), addDays(dateRanges.prevMonth.end, -5))),
    reason: 'Annual vacation',
    approved: true,
  });
  
  // Current month leave
  leave.push({
    id: 'l2',
    resourceId: '1',
    type: 'sick',
    startDate: formatDate(getRandomDateInRange(dateRanges.currentMonth.start, addDays(dateRanges.currentMonth.start, 10))),
    endDate: formatDate(getRandomDateInRange(addDays(dateRanges.currentMonth.start, 12), addDays(dateRanges.currentMonth.start, 15))),
    reason: 'Medical leave',
    approved: true,
  });
  
  // Next month leave
  leave.push({
    id: 'l3',
    resourceId: '5',
    type: 'personal',
    startDate: formatDate(getRandomDateInRange(addDays(dateRanges.nextMonth.start, 10), addDays(dateRanges.nextMonth.start, 15))),
    endDate: formatDate(getRandomDateInRange(addDays(dateRanges.nextMonth.start, 17), addDays(dateRanges.nextMonth.start, 22))),
    reason: 'Family event',
    approved: false,
  });
  
  return leave;
};

/**
 * Generate realistic project assignments with varying hours per day
 */
export const generateProjectAssignments = (projects: Project[]) => {
  const assignments = [];
  
  projects.forEach(project => {
    // Primary assignment - resource working on the project
    assignments.push({
      id: `a-${project.id}-1`,
      projectId: project.id,
      resourceId: project.resourceId,
      hoursPerDay: Math.floor(Math.random() * 4) + 4, // 4-8 hours
      startDate: project.startDate,
      endDate: project.endDate,
    });
    
    // Some projects have secondary assignments (reviews, collaboration)
    if (['p3', 'p4', 'p6', 'p8', 'p16'].includes(project.id)) {
      const collaboratorId = project.resourceId === '1' ? '2' : '1'; // Frontend/Backend collaboration
      assignments.push({
        id: `a-${project.id}-2`,
        projectId: project.id,
        resourceId: collaboratorId,
        hoursPerDay: Math.floor(Math.random() * 2) + 1, // 1-3 hours (support)
        startDate: project.startDate,
        endDate: project.endDate,
      });
    }
    
    // QA assignments for active projects
    if (['p3', 'p4', 'p6', 'p7'].includes(project.id)) {
      assignments.push({
        id: `a-${project.id}-qa`,
        projectId: project.id,
        resourceId: '4', // QA Engineer
        hoursPerDay: Math.floor(Math.random() * 3) + 2, // 2-4 hours
        startDate: formatDate(addDays(new Date(project.startDate), Math.floor(Math.random() * 5))),
        endDate: project.endDate,
      });
    }
  });
  
  return assignments;
};
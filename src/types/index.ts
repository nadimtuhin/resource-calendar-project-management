export interface Resource {
  id: string;
  name: string;
  role: string;
  color: string;
}

export type ProjectStatus = 
  | 'planning'     // Initial planning phase
  | 'active'       // Currently in progress
  | 'on-hold'      // Temporarily paused
  | 'completed'    // Successfully finished
  | 'cancelled'    // Cancelled/terminated
  | 'overdue'      // Past deadline
  | 'at-risk';     // Behind schedule/issues

export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  completedDate?: string;
  description?: string;
  progress: number; // 0-100
}

export interface ProjectBudget {
  estimated: number;
  actual: number;
  currency: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  deadline?: string; // Hard deadline for project completion
  resourceId: string;
  priority: 'high' | 'medium' | 'low';
  status: ProjectStatus;
  progress: number; // 0-100
  estimatedHours?: number;
  actualHours?: number;
  workDaysNeeded?: number; // Total work days needed to complete project
  milestones?: Milestone[];
  healthScore?: number; // 0-100
  completedDate?: string;
  budget?: ProjectBudget;
}

export interface DayStats {
  date: string;
  hasWork: boolean;
  projects: Project[];
}

export interface UtilizationData {
  totalDays: number;
  busyDays: number;
  utilization: number;
  projects: Project[];
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'religious' | 'custom';
  recurring: boolean;
  description?: string;
}

export interface HolidaySettings {
  weekendDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  holidays: Holiday[];
  workingHours: {
    start: string;
    end: string;
  };
}

export interface Leave {
  id: string;
  resourceId: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'holiday' | 'other';
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface WorkDayStats {
  totalWorkDays: number;
  assignedProjectDays: number;
  leaveDays: number;
  availableDays: number;
  utilization: number;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  atRiskProjects: number;
  averageProgress: number;
  onTimeDeliveryRate: number;
  averageProjectDuration: number;
  statusDistribution: Record<ProjectStatus, number>;
}
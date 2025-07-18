export interface Resource {
  id: string;
  name: string;
  role: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  resourceId: string;
  priority: 'high' | 'medium' | 'low';
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
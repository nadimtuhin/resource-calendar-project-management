import { useState, useEffect, useCallback } from 'react';
import { Resource, Project, Holiday, HolidaySettings, Leave, WorkDayStats } from '../types';
import { StorageFactory, StorageAdapter } from '../storage';
import { generateTestData, generateLeaveData } from '../utils/testData';

// Helper function to get default date range
const getDefaultDateRange = () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Last month
  const endDate = new Date(today.getFullYear(), today.getMonth() + 4, 0); // Next 3 months (end of 4th month)
  return { startDate, endDate };
};

export const useResourceCalendar = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageAdapter, setStorageAdapter] = useState<StorageAdapter | null>(null);
  const [holidaySettings, setHolidaySettings] = useState<HolidaySettings>({
    weekendDays: [5, 6], // Friday and Saturday (0 = Sunday, 1 = Monday, etc.)
    holidays: [],
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
  });
  
  // Date range state
  const [dateRange, setDateRange] = useState(() => {
    const stored = localStorage.getItem('resource-calendar-date-range');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          startDate: new Date(parsed.startDate),
          endDate: new Date(parsed.endDate),
        };
      } catch {
        return getDefaultDateRange();
      }
    }
    return getDefaultDateRange();
  });

  // Initialize storage adapter and load data on mount
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const config = StorageFactory.getConfigFromEnvironment();
        const adapter = await StorageFactory.create(config);
        setStorageAdapter(adapter);
        
        // Load data from adapter
        const [savedResources, savedProjects, savedHolidaySettings, savedLeaves] = await Promise.all([
          adapter.getResources(),
          adapter.getProjects(),
          adapter.getHolidaySettings(),
          adapter.getLeaves(),
        ]);
        
        setResources(savedResources);
        setProjects(savedProjects);
        setHolidaySettings(savedHolidaySettings);
        setLeaves(savedLeaves);
      } catch (error) {
        console.error('Failed to initialize storage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeStorage();
  }, []);

  // Save resources to storage adapter whenever they change
  useEffect(() => {
    if (!loading && storageAdapter) {
      storageAdapter.saveResources(resources).catch(error => {
        console.error('Failed to save resources:', error);
      });
    }
  }, [resources, loading, storageAdapter]);

  // Save projects to storage adapter whenever they change
  useEffect(() => {
    if (!loading && storageAdapter) {
      storageAdapter.saveProjects(projects).catch(error => {
        console.error('Failed to save projects:', error);
      });
    }
  }, [projects, loading, storageAdapter]);

  // Save holiday settings to storage adapter whenever they change
  useEffect(() => {
    if (!loading && storageAdapter) {
      storageAdapter.saveHolidaySettings(holidaySettings).catch(error => {
        console.error('Failed to save holiday settings:', error);
      });
    }
  }, [holidaySettings, loading, storageAdapter]);

  // Save date range to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('resource-calendar-date-range', JSON.stringify({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      }));
    }
  }, [dateRange, loading]);

  // Save leaves to storage adapter whenever they change
  useEffect(() => {
    if (!loading && storageAdapter) {
      storageAdapter.saveLeaves(leaves).catch(error => {
        console.error('Failed to save leaves:', error);
      });
    }
  }, [leaves, loading, storageAdapter]);

  const addResource = useCallback((resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
    };
    setResources(prev => [...prev, newResource]);
  }, []);

  const updateResource = useCallback((id: string, updates: Partial<Resource>) => {
    setResources(prev => prev.map(resource =>
      resource.id === id ? { ...resource, ...updates } : resource
    ));
  }, []);

  const deleteResource = useCallback((id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
    setProjects(prev => prev.filter(project => project.resourceId !== id));
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };
    setProjects(prev => [...prev, newProject]);
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === id ? { ...project, ...updates } : project
    ));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  }, []);

  const removeProjectFromDays = useCallback((projectId: string, datesToRemove: string[]) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    
    // Generate all project dates
    const allDates: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Filter out dates to remove
    const remainingDates = allDates.filter(date => {
      const dateStr = date.toISOString().split('T')[0];
      return !datesToRemove.includes(dateStr);
    });

    if (remainingDates.length === 0) {
      // Remove project completely if no dates remain
      deleteProject(projectId);
      return;
    }

    // Find continuous date ranges
    const ranges: { start: Date; end: Date }[] = [];
    let currentRange: { start: Date; end: Date } | null = null;

    remainingDates.forEach(date => {
      if (!currentRange) {
        currentRange = { start: date, end: date };
      } else {
        const prevDay = new Date(currentRange.end);
        prevDay.setDate(prevDay.getDate() + 1);
        
        if (date.getTime() === prevDay.getTime()) {
          currentRange.end = date;
        } else {
          ranges.push(currentRange);
          currentRange = { start: date, end: date };
        }
      }
    });

    if (currentRange) {
      ranges.push(currentRange);
    }

    // Update or create projects for each range
    if (ranges.length > 0) {
      // Update the first range with the existing project
      const firstRange = ranges[0];
      updateProject(projectId, {
        startDate: firstRange.start.toISOString().split('T')[0],
        endDate: firstRange.end.toISOString().split('T')[0],
      });

      // Create new projects for additional ranges
      ranges.slice(1).forEach((range, index) => {
        const newProject: Project = {
          ...project,
          id: `${projectId}_split_${index + 1}`,
          title: `${project.title} (${index + 2})`,
          startDate: range.start.toISOString().split('T')[0],
          endDate: range.end.toISOString().split('T')[0],
        };
        setProjects(prev => [...prev, newProject]);
      });
    }
  }, [projects, updateProject, deleteProject]);

  const clearDayWork = useCallback((resourceId: string, date: string) => {
    const projectsToRemove = projects.filter(project => 
      project.resourceId === resourceId &&
      project.startDate <= date &&
      project.endDate >= date
    );

    projectsToRemove.forEach(project => {
      removeProjectFromDays(project.id, [date]);
    });
  }, [projects, removeProjectFromDays]);

  const loadTestData = useCallback(() => {
    const testData = generateTestData();
    const leaveData = generateLeaveData();
    
    setResources(testData.resources);
    setProjects(testData.projects);
    setLeaves(leaveData);
    setHolidaySettings(prev => ({
      ...prev,
      holidays: testData.holidays,
    }));
  }, []);

  const clearAllData = useCallback(async () => {
    setResources([]);
    setProjects([]);
    setLeaves([]);
    setHolidaySettings({
      weekendDays: [5, 6],
      holidays: [],
      workingHours: {
        start: '09:00',
        end: '18:00',
      },
    });
    setDateRange(getDefaultDateRange());
    
    if (storageAdapter) {
      try {
        await storageAdapter.clearAll();
      } catch (error) {
        console.error('Failed to clear storage:', error);
      }
    }
    
    // Also clear localStorage items that aren't managed by the adapter
    localStorage.removeItem('resource-calendar-date-range');
    localStorage.removeItem('management-panel-state');
  }, [storageAdapter]);

  // Holiday management functions
  const addHoliday = useCallback((holiday: Omit<Holiday, 'id'>) => {
    const newHoliday: Holiday = {
      ...holiday,
      id: Date.now().toString(),
    };
    setHolidaySettings(prev => ({
      ...prev,
      holidays: [...prev.holidays, newHoliday],
    }));
  }, []);

  const updateHoliday = useCallback((id: string, updates: Partial<Holiday>) => {
    setHolidaySettings(prev => ({
      ...prev,
      holidays: prev.holidays.map(holiday =>
        holiday.id === id ? { ...holiday, ...updates } : holiday
      ),
    }));
  }, []);

  const deleteHoliday = useCallback((id: string) => {
    setHolidaySettings(prev => ({
      ...prev,
      holidays: prev.holidays.filter(holiday => holiday.id !== id),
    }));
  }, []);

  const updateWeekendDays = useCallback((weekendDays: number[]) => {
    setHolidaySettings(prev => ({
      ...prev,
      weekendDays,
    }));
  }, []);

  const updateWorkingHours = useCallback((workingHours: { start: string; end: string }) => {
    setHolidaySettings(prev => ({
      ...prev,
      workingHours,
    }));
  }, []);

  // Helper function to check if a date is a holiday
  const isHoliday = useCallback((date: Date): Holiday | null => {
    const dateStr = date.toISOString().split('T')[0];
    const holiday = holidaySettings.holidays.find(h => {
      if (h.recurring) {
        // For recurring holidays, check month and day
        const holidayDate = new Date(h.date);
        return holidayDate.getMonth() === date.getMonth() && 
               holidayDate.getDate() === date.getDate();
      } else {
        // For non-recurring holidays, check exact date
        return h.date === dateStr;
      }
    });
    return holiday || null;
  }, [holidaySettings.holidays]);

  // Helper function to check if a date is a weekend
  const isWeekend = useCallback((date: Date): boolean => {
    return holidaySettings.weekendDays.includes(date.getDay());
  }, [holidaySettings.weekendDays]);

  // Date range management
  const updateDateRange = useCallback((startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
  }, []);

  const resetDateRange = useCallback(() => {
    setDateRange(getDefaultDateRange());
  }, []);

  // Leave management functions
  const addLeave = useCallback((leave: Omit<Leave, 'id'>) => {
    const newLeave: Leave = {
      ...leave,
      id: Date.now().toString(),
    };
    setLeaves(prev => [...prev, newLeave]);
  }, []);

  const updateLeave = useCallback((id: string, updates: Partial<Leave>) => {
    setLeaves(prev => prev.map(leave =>
      leave.id === id ? { ...leave, ...updates } : leave
    ));
  }, []);

  const deleteLeave = useCallback((id: string) => {
    setLeaves(prev => prev.filter(leave => leave.id !== id));
  }, []);

  // Helper function to check if a date is a leave day
  const isLeaveDay = useCallback((date: Date, resourceId: string): Leave | null => {
    const dateStr = date.toISOString().split('T')[0];
    const leave = leaves.find(l => 
      l.resourceId === resourceId &&
      l.startDate <= dateStr &&
      l.endDate >= dateStr &&
      l.status === 'approved'
    );
    return leave || null;
  }, [leaves]);

  // Calculate work day statistics for a resource
  const getWorkDayStats = useCallback((resourceId: string): WorkDayStats => {
    const startDate = dateRange.startDate;
    const endDate = dateRange.endDate;
    
    // Calculate total work days (excluding weekends and holidays)
    let totalWorkDays = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
        totalWorkDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Calculate assigned project days
    const resourceProjects = projects.filter(p => p.resourceId === resourceId);
    let assignedProjectDays = 0;
    
    resourceProjects.forEach(project => {
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);
      const rangeStart = new Date(Math.max(startDate.getTime(), projectStart.getTime()));
      const rangeEnd = new Date(Math.min(endDate.getTime(), projectEnd.getTime()));
      
      const currentDate = new Date(rangeStart);
      while (currentDate <= rangeEnd) {
        if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
          assignedProjectDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    // Calculate leave days
    const resourceLeaves = leaves.filter(l => l.resourceId === resourceId && l.status === 'approved');
    let leaveDays = 0;
    
    resourceLeaves.forEach(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      const rangeStart = new Date(Math.max(startDate.getTime(), leaveStart.getTime()));
      const rangeEnd = new Date(Math.min(endDate.getTime(), leaveEnd.getTime()));
      
      const currentDate = new Date(rangeStart);
      while (currentDate <= rangeEnd) {
        if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
          leaveDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    const availableDays = totalWorkDays - assignedProjectDays - leaveDays;
    const utilization = totalWorkDays > 0 ? ((assignedProjectDays + leaveDays) / totalWorkDays) * 100 : 0;
    
    return {
      totalWorkDays,
      assignedProjectDays,
      leaveDays,
      availableDays,
      utilization,
    };
  }, [projects, leaves, dateRange, isWeekend, isHoliday]);

  return {
    resources,
    projects,
    leaves,
    loading,
    holidaySettings,
    dateRange,
    addResource,
    updateResource,
    deleteResource,
    addProject,
    updateProject,
    deleteProject,
    removeProjectFromDays,
    clearDayWork,
    loadTestData,
    clearAllData,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    updateWeekendDays,
    updateWorkingHours,
    isHoliday,
    isWeekend,
    updateDateRange,
    resetDateRange,
    addLeave,
    updateLeave,
    deleteLeave,
    isLeaveDay,
    getWorkDayStats,
  };
};
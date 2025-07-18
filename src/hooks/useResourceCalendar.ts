import { useState, useEffect, useCallback } from 'react';
import { Resource, Project } from '../types';
import { saveResources, loadResources, saveProjects, loadProjects } from '../utils/storageUtils';
import { generateTestData } from '../utils/testData';

export const useResourceCalendar = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedResources = loadResources();
    const savedProjects = loadProjects();
    
    setResources(savedResources);
    setProjects(savedProjects);
    setLoading(false);
  }, []);

  // Save resources to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveResources(resources);
    }
  }, [resources, loading]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveProjects(projects);
    }
  }, [projects, loading]);

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
    setResources(testData.resources);
    setProjects(testData.projects);
  }, []);

  const clearAllData = useCallback(() => {
    setResources([]);
    setProjects([]);
  }, []);

  return {
    resources,
    projects,
    loading,
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
  };
};
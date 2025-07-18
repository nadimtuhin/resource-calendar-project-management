import { Resource, Project } from '../types';

const STORAGE_KEYS = {
  RESOURCES: 'resource-calendar-resources',
  PROJECTS: 'resource-calendar-projects',
};

export const saveResources = (resources: Resource[]): void => {
  localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
};

export const loadResources = (): Resource[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
  return data ? JSON.parse(data) : [];
};

export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const loadProjects = (): Project[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return data ? JSON.parse(data) : [];
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.RESOURCES);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
};
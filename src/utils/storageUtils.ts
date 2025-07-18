import { Resource, Project, HolidaySettings, Leave } from '../types';

const STORAGE_KEYS = {
  RESOURCES: 'resource-calendar-resources',
  PROJECTS: 'resource-calendar-projects',
  HOLIDAY_SETTINGS: 'resource-calendar-holiday-settings',
  LEAVES: 'resource-calendar-leaves',
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

export const saveHolidaySettings = (settings: HolidaySettings): void => {
  localStorage.setItem(STORAGE_KEYS.HOLIDAY_SETTINGS, JSON.stringify(settings));
};

export const loadHolidaySettings = (): HolidaySettings => {
  const data = localStorage.getItem(STORAGE_KEYS.HOLIDAY_SETTINGS);
  return data ? JSON.parse(data) : {
    weekendDays: [5, 6], // Friday and Saturday
    holidays: [],
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
  };
};

export const saveLeaves = (leaves: Leave[]): void => {
  localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
};

export const loadLeaves = (): Leave[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LEAVES);
  return data ? JSON.parse(data) : [];
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.RESOURCES);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.HOLIDAY_SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.LEAVES);
};
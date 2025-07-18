import { Resource, Project, HolidaySettings } from '../types';

export interface ShareableState {
  resources: Resource[];
  projects: Project[];
  holidaySettings: HolidaySettings;
  exportedAt: string;
  version: string;
}

export interface ShareUrlOptions {
  includeResources?: boolean;
  includeProjects?: boolean;
  includeHolidays?: boolean;
}

// Encode state to base64 URL parameter
export const encodeStateToUrl = (
  resources: Resource[],
  projects: Project[],
  holidaySettings: HolidaySettings,
  options: ShareUrlOptions = {
    includeResources: true,
    includeProjects: true,
    includeHolidays: true,
  }
): string => {
  const state: ShareableState = {
    resources: options.includeResources ? resources : [],
    projects: options.includeProjects ? projects : [],
    holidaySettings: options.includeHolidays ? holidaySettings : {
      weekendDays: [5, 6],
      holidays: [],
      workingHours: { start: '09:00', end: '18:00' },
    },
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };

  try {
    const jsonString = JSON.stringify(state);
    const base64String = btoa(unescape(encodeURIComponent(jsonString)));
    return base64String;
  } catch (error) {
    console.error('Error encoding state:', error);
    throw new Error('Failed to encode state for sharing');
  }
};

// Decode base64 URL parameter to state
export const decodeStateFromUrl = (base64String: string): ShareableState => {
  try {
    const jsonString = decodeURIComponent(escape(atob(base64String)));
    const state = JSON.parse(jsonString) as ShareableState;
    
    // Validate the structure
    if (!validateShareableState(state)) {
      throw new Error('Invalid state structure');
    }
    
    return state;
  } catch (error) {
    console.error('Error decoding state:', error);
    throw new Error('Failed to decode shared state. The URL may be corrupted.');
  }
};

// Validate imported state structure
const validateShareableState = (state: unknown): state is ShareableState => {
  if (!state || typeof state !== 'object') return false;
  
  // Check required properties
  if (!Array.isArray(state.resources)) return false;
  if (!Array.isArray(state.projects)) return false;
  if (!state.holidaySettings || typeof state.holidaySettings !== 'object') return false;
  
  // Validate resources structure
  for (const resource of state.resources) {
    if (!resource.id || !resource.name || !resource.role || !resource.color) {
      return false;
    }
  }
  
  // Validate projects structure
  for (const project of state.projects) {
    if (!project.id || !project.title || !project.startDate || !project.endDate || 
        !project.resourceId || !project.priority) {
      return false;
    }
  }
  
  // Validate holiday settings structure
  const { holidaySettings } = state;
  if (!Array.isArray(holidaySettings.weekendDays) || 
      !Array.isArray(holidaySettings.holidays) ||
      !holidaySettings.workingHours ||
      !holidaySettings.workingHours.start ||
      !holidaySettings.workingHours.end) {
    return false;
  }
  
  return true;
};

// Generate shareable URL
export const generateShareUrl = (
  resources: Resource[],
  projects: Project[],
  holidaySettings: HolidaySettings,
  options?: ShareUrlOptions
): string => {
  const encodedState = encodeStateToUrl(resources, projects, holidaySettings, options);
  const currentUrl = window.location.origin + window.location.pathname;
  return `${currentUrl}?share=${encodedState}`;
};

// Extract share parameter from current URL
export const getShareParameterFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('share');
};

// Remove share parameter from URL without page reload
export const removeShareParameterFromUrl = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('share');
  window.history.replaceState({}, '', url.toString());
};

// Calculate approximate URL length for display
export const calculateUrlLength = (
  resources: Resource[],
  projects: Project[],
  holidaySettings: HolidaySettings
): number => {
  const baseUrl = window.location.origin + window.location.pathname;
  const encodedState = encodeStateToUrl(resources, projects, holidaySettings);
  return baseUrl.length + '?share='.length + encodedState.length;
};

// Compress state by removing optional fields for shorter URLs
export const compressStateForSharing = (state: ShareableState): ShareableState => {
  return {
    ...state,
    resources: state.resources.map(resource => ({
      id: resource.id,
      name: resource.name,
      role: resource.role,
      color: resource.color,
    })),
    projects: state.projects.map(project => ({
      id: project.id,
      title: project.title,
      startDate: project.startDate,
      endDate: project.endDate,
      resourceId: project.resourceId,
      priority: project.priority,
    })),
    holidaySettings: {
      weekendDays: state.holidaySettings.weekendDays,
      holidays: state.holidaySettings.holidays.map(holiday => ({
        id: holiday.id,
        name: holiday.name,
        date: holiday.date,
        type: holiday.type,
        recurring: holiday.recurring,
        ...(holiday.description && { description: holiday.description }),
      })),
      workingHours: state.holidaySettings.workingHours,
    },
  };
};
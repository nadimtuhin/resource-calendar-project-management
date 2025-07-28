import { BaseAdapter } from './BaseAdapter';
import { Resource, Project, HolidaySettings, Leave } from '../../types';

const STORAGE_KEYS = {
  RESOURCES: 'resource-calendar-resources',
  PROJECTS: 'resource-calendar-projects',
  HOLIDAY_SETTINGS: 'resource-calendar-holiday-settings',
  LEAVES: 'resource-calendar-leaves',
};

export class LocalStorageAdapter extends BaseAdapter {
  async getResources(): Promise<Resource[]> {
    const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    return data ? JSON.parse(data) : [];
  }

  async saveResources(resources: Resource[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }

  async getProjects(): Promise<Project[]> {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  }

  async saveProjects(projects: Project[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  async getHolidaySettings(): Promise<HolidaySettings> {
    const data = localStorage.getItem(STORAGE_KEYS.HOLIDAY_SETTINGS);
    return data ? JSON.parse(data) : this.defaultHolidaySettings;
  }

  async saveHolidaySettings(settings: HolidaySettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.HOLIDAY_SETTINGS, JSON.stringify(settings));
  }

  async getLeaves(): Promise<Leave[]> {
    const data = localStorage.getItem(STORAGE_KEYS.LEAVES);
    return data ? JSON.parse(data) : [];
  }

  async saveLeaves(leaves: Leave[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }

  async clearAll(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.HOLIDAY_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem('resource-calendar-date-range');
    localStorage.removeItem('management-panel-state');
  }

  async isConnected(): Promise<boolean> {
    try {
      const testKey = 'test-localStorage';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}
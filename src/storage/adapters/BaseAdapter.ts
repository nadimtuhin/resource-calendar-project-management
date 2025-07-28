import { StorageAdapter } from '../types';
import { Resource, Project, HolidaySettings, Leave } from '../../types';

export abstract class BaseAdapter implements StorageAdapter {
  protected defaultHolidaySettings: HolidaySettings = {
    weekendDays: [5, 6], // Friday and Saturday
    holidays: [],
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
  };

  abstract getResources(): Promise<Resource[]>;
  abstract saveResources(resources: Resource[]): Promise<void>;
  
  abstract getProjects(): Promise<Project[]>;
  abstract saveProjects(projects: Project[]): Promise<void>;
  
  abstract getHolidaySettings(): Promise<HolidaySettings>;
  abstract saveHolidaySettings(settings: HolidaySettings): Promise<void>;
  
  abstract getLeaves(): Promise<Leave[]>;
  abstract saveLeaves(leaves: Leave[]): Promise<void>;
  
  abstract clearAll(): Promise<void>;
  abstract isConnected(): Promise<boolean>;
  
  async initialize(): Promise<void> {
    // Override in subclasses if needed
  }
  
  async disconnect(): Promise<void> {
    // Override in subclasses if needed
  }
}
import { Resource, Project, HolidaySettings, Leave } from '../types';

export interface StorageAdapter {
  // Resource operations
  getResources(): Promise<Resource[]>;
  saveResources(resources: Resource[]): Promise<void>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  saveProjects(projects: Project[]): Promise<void>;
  
  // Holiday settings operations
  getHolidaySettings(): Promise<HolidaySettings>;
  saveHolidaySettings(settings: HolidaySettings): Promise<void>;
  
  // Leave operations
  getLeaves(): Promise<Leave[]>;
  saveLeaves(leaves: Leave[]): Promise<void>;
  
  // Utility operations
  clearAll(): Promise<void>;
  isConnected(): Promise<boolean>;
  initialize?(): Promise<void>;
  disconnect?(): Promise<void>;
}

export type StorageAdapterType = 'localStorage' | 'sqlite' | 'mysql' | 'postgres' | 'supabase';

export interface StorageConfig {
  type: StorageAdapterType;
  connectionString?: string;
  database?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  sqliteFile?: string;
}
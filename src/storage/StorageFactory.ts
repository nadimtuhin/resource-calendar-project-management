import { StorageAdapter, StorageConfig, StorageAdapterType } from './types';
import { LocalStorageAdapter } from './adapters/LocalStorageAdapter';
import { SQLiteAdapter } from './adapters/SQLiteAdapter';
import { MySQLAdapter } from './adapters/MySQLAdapter';
import { PostgreSQLAdapter } from './adapters/PostgreSQLAdapter';
import { SupabaseAdapter } from './adapters/SupabaseAdapter';

export class StorageFactory {
  private static instance: StorageAdapter | null = null;
  private static config: StorageConfig | null = null;

  static async create(config: StorageConfig): Promise<StorageAdapter> {
    // If we already have an instance with the same config, return it
    if (this.instance && JSON.stringify(this.config) === JSON.stringify(config)) {
      return this.instance;
    }

    // If config changed, disconnect the old instance
    if (this.instance && this.instance.disconnect) {
      await this.instance.disconnect();
    }

    // Create new adapter based on type
    let adapter: StorageAdapter;

    switch (config.type) {
      case 'localStorage':
        adapter = new LocalStorageAdapter();
        break;
      
      case 'sqlite':
        adapter = new SQLiteAdapter(config);
        break;
      
      case 'mysql':
        adapter = new MySQLAdapter(config);
        break;
      
      case 'postgres':
        adapter = new PostgreSQLAdapter(config);
        break;
      
      case 'supabase':
        adapter = new SupabaseAdapter(config);
        break;
      
      default:
        throw new Error(`Unsupported storage adapter type: ${config.type}`);
    }

    // Initialize the adapter
    if (adapter.initialize) {
      await adapter.initialize();
    }

    // Store the instance and config
    this.instance = adapter;
    this.config = config;

    return adapter;
  }

  static async getAdapter(): Promise<StorageAdapter> {
    if (!this.instance) {
      // Default to localStorage if no adapter is configured
      return this.create({ type: 'localStorage' });
    }
    return this.instance;
  }

  static async disconnect(): Promise<void> {
    if (this.instance && this.instance.disconnect) {
      await this.instance.disconnect();
      this.instance = null;
      this.config = null;
    }
  }

  static getConfigFromEnvironment(): StorageConfig {
    // Check environment variables for storage configuration
    const storageType = (import.meta.env.VITE_STORAGE_TYPE || 'localStorage') as StorageAdapterType;

    const config: StorageConfig = {
      type: storageType,
    };

    // Add specific configuration based on storage type
    switch (storageType) {
      case 'sqlite':
        config.sqliteFile = import.meta.env.VITE_SQLITE_FILE || './calendar.db';
        break;
      
      case 'mysql':
        config.host = import.meta.env.VITE_MYSQL_HOST || 'localhost';
        config.port = parseInt(import.meta.env.VITE_MYSQL_PORT || '3306');
        config.username = import.meta.env.VITE_MYSQL_USER;
        config.password = import.meta.env.VITE_MYSQL_PASSWORD;
        config.database = import.meta.env.VITE_MYSQL_DATABASE || 'resource_calendar';
        break;
      
      case 'postgres':
        config.connectionString = import.meta.env.VITE_POSTGRES_CONNECTION_STRING;
        if (!config.connectionString) {
          config.host = import.meta.env.VITE_POSTGRES_HOST || 'localhost';
          config.port = parseInt(import.meta.env.VITE_POSTGRES_PORT || '5432');
          config.username = import.meta.env.VITE_POSTGRES_USER;
          config.password = import.meta.env.VITE_POSTGRES_PASSWORD;
          config.database = import.meta.env.VITE_POSTGRES_DATABASE || 'resource_calendar';
        }
        break;
      
      case 'supabase':
        config.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        config.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        break;
    }

    return config;
  }
}
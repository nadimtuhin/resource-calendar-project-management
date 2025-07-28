import { StorageFactory } from '../src/storage';

// Example 1: Using LocalStorage (default)
async function useLocalStorage() {
  const adapter = await StorageFactory.create({ type: 'localStorage' });
  
  // Save resources
  await adapter.saveResources([
    { id: '1', name: 'John Doe', role: 'Developer', color: '#3B82F6' }
  ]);
  
  // Get resources
  const resources = await adapter.getResources();
  console.log('Resources:', resources);
}

// Example 2: Using SQLite
async function useSQLite() {
  const adapter = await StorageFactory.create({
    type: 'sqlite',
    sqliteFile: './myapp.db'
  });
  
  // Initialize database (create tables)
  await adapter.initialize?.();
  
  // Use the adapter...
  const projects = await adapter.getProjects();
  console.log('Projects:', projects);
}

// Example 3: Using MySQL
async function useMySQL() {
  const adapter = await StorageFactory.create({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'resource_calendar'
  });
  
  await adapter.initialize?.();
  
  // Check connection
  const isConnected = await adapter.isConnected();
  console.log('MySQL connected:', isConnected);
}

// Example 4: Using Supabase with real-time
async function useSupabase() {
  const adapter = await StorageFactory.create({
    type: 'supabase',
    supabaseUrl: 'https://your-project.supabase.co',
    supabaseAnonKey: 'your-anon-key'
  });
  
  // Subscribe to real-time changes (Supabase only)
  if ('subscribeToProjects' in adapter) {
    const unsubscribe = adapter.subscribeToProjects((projects) => {
      console.log('Projects updated:', projects);
    });
    
    // Later: unsubscribe()
  }
}

// Example 5: Using environment configuration
async function useEnvironmentConfig() {
  // This reads from VITE_STORAGE_TYPE and related env vars
  const config = StorageFactory.getConfigFromEnvironment();
  const adapter = await StorageFactory.create(config);
  
  // Use the adapter...
  await adapter.clearAll();
}

// Example 6: Migrating between adapters
async function migrateData() {
  // Export from old adapter
  const oldAdapter = await StorageFactory.create({ type: 'localStorage' });
  const resources = await oldAdapter.getResources();
  const projects = await oldAdapter.getProjects();
  const holidaySettings = await oldAdapter.getHolidaySettings();
  const leaves = await oldAdapter.getLeaves();
  
  // Import to new adapter
  const newAdapter = await StorageFactory.create({
    type: 'postgres',
    connectionString: 'postgresql://user:pass@localhost/db'
  });
  
  await newAdapter.saveResources(resources);
  await newAdapter.saveProjects(projects);
  await newAdapter.saveHolidaySettings(holidaySettings);
  await newAdapter.saveLeaves(leaves);
  
  console.log('Migration completed!');
}
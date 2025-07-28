# Storage Adapters Documentation

This project implements a flexible storage adapter pattern that allows you to easily switch between different data storage backends without changing your application code.

## Supported Storage Adapters

### 1. LocalStorage (Default)
- **Use Case**: Single-user, browser-based storage
- **Pros**: No setup required, works offline
- **Cons**: Limited to browser, data lost if cache cleared
- **Configuration**: No configuration needed

### 2. SQLite
- **Use Case**: Desktop applications, local development
- **Pros**: File-based, no server required, ACID compliant
- **Cons**: Not suitable for multi-user scenarios
- **Required Package**: `better-sqlite3`
- **Configuration**:
  ```env
  VITE_STORAGE_TYPE=sqlite
  VITE_SQLITE_FILE=./calendar.db
  ```

### 3. MySQL
- **Use Case**: Multi-user applications, traditional web apps
- **Pros**: Mature, widely supported, good performance
- **Cons**: Requires server setup
- **Required Package**: `mysql2`
- **Configuration**:
  ```env
  VITE_STORAGE_TYPE=mysql
  VITE_MYSQL_HOST=localhost
  VITE_MYSQL_PORT=3306
  VITE_MYSQL_USER=your_user
  VITE_MYSQL_PASSWORD=your_password
  VITE_MYSQL_DATABASE=resource_calendar
  ```

### 4. PostgreSQL
- **Use Case**: Enterprise applications, complex queries
- **Pros**: Advanced features, excellent performance, JSONB support
- **Cons**: More complex setup
- **Required Package**: `pg`
- **Configuration**:
  ```env
  VITE_STORAGE_TYPE=postgres
  # Option 1: Connection string
  VITE_POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/resource_calendar
  
  # Option 2: Individual parameters
  VITE_POSTGRES_HOST=localhost
  VITE_POSTGRES_PORT=5432
  VITE_POSTGRES_USER=your_user
  VITE_POSTGRES_PASSWORD=your_password
  VITE_POSTGRES_DATABASE=resource_calendar
  ```

### 5. Supabase
- **Use Case**: Real-time collaboration, cloud-based storage
- **Pros**: Real-time sync, built-in auth, managed hosting
- **Cons**: Requires internet, vendor lock-in
- **Required Package**: `@supabase/supabase-js`
- **Configuration**:
  ```env
  VITE_STORAGE_TYPE=supabase
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

## Installation

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your preferred storage adapter in `.env`

3. Install required dependencies based on your choice:
   ```bash
   # For SQLite
   npm install better-sqlite3
   
   # For MySQL
   npm install mysql2
   
   # For PostgreSQL
   npm install pg
   
   # For Supabase
   npm install @supabase/supabase-js
   ```

## Database Schema

For database adapters (SQLite, MySQL, PostgreSQL, Supabase), you'll need to create the following tables:

### Resources Table
```sql
CREATE TABLE resources (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  color VARCHAR(50) NOT NULL
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  startDate VARCHAR(50) NOT NULL,
  endDate VARCHAR(50) NOT NULL,
  deadline VARCHAR(50),
  resourceId VARCHAR(255) NOT NULL,
  priority VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  progress DECIMAL(5,2) NOT NULL,
  estimatedHours DECIMAL(10,2),
  actualHours DECIMAL(10,2),
  workDaysNeeded INT,
  healthScore DECIMAL(5,2),
  completedDate VARCHAR(50),
  budget JSON,  -- JSONB for PostgreSQL
  milestones JSON,  -- JSONB for PostgreSQL
  FOREIGN KEY (resourceId) REFERENCES resources(id) ON DELETE CASCADE
);
```

### Holiday Settings Table
```sql
CREATE TABLE holiday_settings (
  id INT PRIMARY KEY DEFAULT 1,
  weekendDays JSON NOT NULL,  -- JSONB for PostgreSQL
  workingHoursStart VARCHAR(10) NOT NULL,
  workingHoursEnd VARCHAR(10) NOT NULL
);
```

### Holidays Table
```sql
CREATE TABLE holidays (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  recurring BOOLEAN NOT NULL,
  description TEXT
);
```

### Leaves Table
```sql
CREATE TABLE leaves (
  id VARCHAR(255) PRIMARY KEY,
  resourceId VARCHAR(255) NOT NULL,
  startDate VARCHAR(50) NOT NULL,
  endDate VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  reason TEXT,
  status VARCHAR(50) NOT NULL,
  FOREIGN KEY (resourceId) REFERENCES resources(id) ON DELETE CASCADE
);
```

## Creating a Custom Adapter

To create a custom storage adapter:

1. Extend the `BaseAdapter` class:
   ```typescript
   import { BaseAdapter } from './storage/adapters/BaseAdapter';
   
   export class CustomAdapter extends BaseAdapter {
     async getResources(): Promise<Resource[]> {
       // Your implementation
     }
     
     // Implement all required methods...
   }
   ```

2. Add your adapter type to `StorageAdapterType` in `src/storage/types.ts`

3. Update the `StorageFactory` to handle your new adapter type

## Switching Between Adapters

Simply change the `VITE_STORAGE_TYPE` in your `.env` file and restart the application. The app will automatically use the new storage backend.

## Migration Between Adapters

To migrate data from one adapter to another:

1. Export your data using the current adapter
2. Switch to the new adapter in `.env`
3. Import the data using the new adapter

Note: A migration tool is planned for future releases.

## Performance Considerations

- **LocalStorage**: Fastest for small datasets, synchronous operations
- **SQLite**: Good for medium datasets, efficient queries
- **MySQL/PostgreSQL**: Best for large datasets, concurrent users
- **Supabase**: Adds network latency but provides real-time sync

## Security Notes

- Never commit `.env` files with real credentials
- Use environment variables for production deployments
- For Supabase, use Row Level Security (RLS) policies
- For database adapters, use prepared statements (already implemented)

## Troubleshooting

### Adapter not connecting
- Check your environment variables are set correctly
- Verify database server is running (for MySQL/PostgreSQL)
- Check network connectivity (for Supabase)
- Review console errors for specific issues

### Data not persisting
- Ensure the adapter is initialized properly
- Check browser console for errors
- Verify database permissions
- Check table schemas match expected structure

### Performance issues
- Consider indexing frequently queried columns
- Use connection pooling for database adapters
- Implement caching for read-heavy operations
- Monitor query performance
# Claude Development Notes

## Pre-Completion Checklist

**ALWAYS run these commands before finishing any feature request:**

1. **Lint Check**
   ```bash
   npm run lint
   ```
   Fix any linting errors before proceeding.

2. **Type Check**
   ```bash
   npx tsc --noEmit
   ```
   Ensure no TypeScript compilation errors.

3. **Run Tests**
   ```bash
   npm test
   ```
   Verify all tests pass.

4. **Build Check**
   ```bash
   npm run build
   ```
   Confirm the application builds successfully.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm test` - Run Playwright tests
- `npm run test:headed` - Run tests with browser UI
- `npm run test:ui` - Run tests with Playwright UI
- `npm run docker:build` - Build Docker containers
- `npm run docker:dev` - Run app in Docker
- `npm run docker:test` - Run tests in Docker

## Project Structure

- `src/storage/` - Storage adapter system
- `src/hooks/` - React hooks including useResourceCalendar
- `src/components/` - React components
- `src/utils/` - Utility functions
- `docs/` - Project documentation
- `examples/` - Usage examples

## Development Notes

- Storage adapters support: localStorage, SQLite, MySQL, PostgreSQL, Supabase
- Configuration via `.env` file using `VITE_STORAGE_TYPE`
- Default adapter is localStorage for backward compatibility
- All adapters implement async interface for consistency
- Tests may timeout due to async storage initialization - this is expected behavior

## Storage Adapter Implementation Status

✅ **Core Features Complete:**
- Storage adapter interface and base classes
- LocalStorage, SQLite, MySQL, PostgreSQL, Supabase adapters
- Factory pattern for adapter creation
- Environment-based configuration
- Updated useResourceCalendar hook
- Comprehensive documentation

⏳ **Future Enhancements:**
- Migration system for data transfer between adapters
- Adapter-specific test suites
- Performance optimizations
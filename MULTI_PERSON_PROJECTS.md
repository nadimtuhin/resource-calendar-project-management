# Multi-Person Project Assignment & Daily Work Hours - Implementation Plan

## Current State Analysis

### Current Project Structure
- Projects are assigned to a single resource (`resourceId: string`)
- Each project has fixed dates (start/end)
- No concept of daily work hours or effort allocation
- Timeline shows projects as solid blocks across date ranges

### Current Limitations
- One project = one person only
- No work hour tracking or allocation
- No partial assignment capabilities
- No team collaboration on projects

## Proposed Changes

### 1. Data Model Changes

#### Updated Project Interface
```typescript
interface Project {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  priority: 'high' | 'medium' | 'low';
  // NEW: Replace single resourceId with assignments array
  assignments: ProjectAssignment[];
  // NEW: Project-level metadata
  totalEstimatedHours?: number;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface ProjectAssignment {
  id: string;
  resourceId: string;
  dailyHours: number; // Hours per day for this person
  startDate: string;   // Can be different from project start
  endDate: string;     // Can be different from project end
  role?: string;       // Optional role in project (e.g., "Lead", "Developer")
  notes?: string;
}
```

#### Updated Resource Interface
```typescript
interface Resource {
  id: string;
  name: string;
  role: string;
  color: string;
  // NEW: Work capacity settings
  dailyWorkHours: number; // Default 6 hours
  workingDays: number[]; // Days of week they work (0=Sun, 1=Mon, etc.)
  hourlyRate?: number;   // Optional for cost calculations
}
```

### 2. UI/UX Changes

#### Timeline View Updates
- **Split project blocks**: Show individual assignments within projects
- **Work hour indicators**: Visual representation of daily hours (1-8 hours)
- **Overlap detection**: Show when person is over-allocated
- **Team project grouping**: Visual connection between team members on same project

#### Project Management
- **Assignment matrix**: Table showing who's assigned to what with hours
- **Drag-and-drop**: Move assignments between people
- **Bulk assignment**: Assign multiple people to project at once
- **Capacity warnings**: Alert when person is over-allocated

#### New Modal Components
- **ProjectAssignmentModal**: Assign people to projects with hours
- **ResourceWorkHoursModal**: Configure person's daily capacity
- **TeamProjectModal**: Enhanced project creation with team assignments

### 3. Implementation Plan

#### Phase 1: Core Data Structure (High Priority)
- [ ] Update Project and Resource types
- [ ] Create ProjectAssignment interface
- [ ] Update storage utilities for new data structure
- [ ] Create migration logic for existing data
- [ ] Update useResourceCalendar hook

#### Phase 2: Basic Multi-Assignment (High Priority)
- [ ] Create ProjectAssignmentModal component
- [ ] Update project creation/editing to support assignments
- [ ] Modify Timeline to show multiple assignments per project
- [ ] Update project filtering and display logic

#### Phase 3: Work Hours & Capacity (Medium Priority)
- [ ] Add daily work hours configuration to resources
- [ ] Create ResourceWorkHoursModal component
- [ ] Implement capacity calculation logic
- [ ] Add over-allocation warnings and indicators

#### Phase 4: Enhanced Timeline (Medium Priority)
- [ ] Update DayCell to show work hour allocation
- [ ] Add visual indicators for capacity utilization
- [ ] Implement project assignment drag-and-drop
- [ ] Add team project grouping visuals

#### Phase 5: Advanced Features (Low Priority)
- [ ] Assignment role management
- [ ] Time tracking integration
- [ ] Cost calculation based on hourly rates
- [ ] Project progress tracking
- [ ] Team collaboration features

### 4. Technical Considerations

#### Data Migration
- Convert existing projects to new assignment format
- Preserve existing project-resource relationships
- Handle backward compatibility during transition

#### Performance
- Optimize filtering for multi-assignment projects
- Efficient capacity calculations
- Minimize re-renders with proper memoization

#### Validation
- Ensure assignment dates are within project dates
- Validate work hour allocations don't exceed capacity
- Prevent duplicate assignments for same person/project

### 5. User Experience Flow

#### Creating Multi-Person Project
1. User creates new project with basic details
2. User adds team members with individual:
   - Start/end dates (can be subset of project dates)
   - Daily hours allocation
   - Optional role in project
3. System validates capacity and shows warnings
4. Timeline updates to show all assignments

#### Managing Daily Capacity
1. User configures resource daily work hours (default 6)
2. System calculates available capacity per day
3. Timeline shows utilization percentage
4. Warnings appear when over-allocated

#### Timeline Visualization
- **Project bars**: Split into segments for each person
- **Work hour indicators**: Height/color intensity shows hours
- **Capacity meters**: Progress bars showing daily utilization
- **Team connectors**: Visual lines connecting team members

### 6. Default Settings
- **Daily work hours**: 6 hours per person
- **Working days**: Monday-Thursday (Bangladesh standard)
- **Weekend**: Friday-Saturday (already implemented)
- **Assignment role**: Optional, defaults to resource role

### 7. Backward Compatibility
- Existing single-person projects auto-convert to assignments
- Legacy project data remains functional
- Gradual migration path for users

This implementation will transform the calendar from a simple project-to-person mapping into a comprehensive team resource management system with proper work hour tracking and capacity planning.
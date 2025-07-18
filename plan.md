# Resource Calendar - Product Requirements Document v2.0

## 1. Executive Summary

### 1.1 Product Vision
Resource Calendar is a visual project management tool that enables teams to efficiently allocate resources across projects using an intuitive calendar interface. The tool provides a comprehensive 3-month continuous timeline view where project managers can visualize team availability, identify resource conflicts, and optimize capacity planning with granular control over project assignments.

### 1.2 Problem Statement
- Project managers struggle to visualize resource allocation across multiple projects and time periods
- Traditional calendar tools don't provide adequate resource utilization insights
- Teams lack visibility into workload distribution and capacity planning
- Identifying scheduling conflicts and resource bottlenecks is time-consuming
- Need for granular control over project timelines and work removal from specific days

### 1.3 Target Users
- **Primary**: Project Managers, Team Leads, Resource Managers
- **Secondary**: Development Teams, Operations Teams, Executive Leadership
- **Team Size**: 5-50 team members per workspace

## 2. Product Overview

### 2.1 Core Value Proposition
- **Visual Resource Management**: See 3 months of resource allocation in one continuous horizontal timeline
- **Conflict Detection**: Instantly identify overbooked resources and scheduling conflicts
- **Capacity Planning**: Track utilization rates and optimize team workload distribution
- **Project Visibility**: Monitor project timelines and dependencies across teams
- **Granular Control**: Remove work from specific days, split projects, and manage timelines precisely

### 2.2 Key Features
1. **3-Month Continuous Timeline**: Horizontal view spanning 90+ days in a single row per resource
2. **Resource-Project Matrix**: Visual intersection of team members and daily assignments
3. **Utilization Analytics**: Real-time capacity tracking and availability insights
4. **Interactive Project Management**: Quick project creation, editing, and assignment
5. **Priority Management**: Visual priority indicators and workload balancing
6. **Advanced Work Management**: Day-specific work removal and project splitting capabilities

## 3. Functional Requirements

### 3.1 Core Functionality

#### 3.1.1 Resource Management
- **Add Resources**: Create team member profiles with name, role, and color assignment
- **Edit Resources**: Modify team member details and visual identifiers
- **Delete Resources**: Remove team members and reassign their projects
- **Resource Utilization**: Calculate and display utilization percentages across 3-month timeline
- **Color-coded Organization**: Unique color assignment per resource for visual identification

#### 3.1.2 Project Management
- **Create Projects**: Define project title, timeline, assigned resource, and priority
- **Edit Projects**: Modify any project attributes including reassignment
- **Delete Projects**: Remove projects from timeline with multiple deletion methods
- **Project Overlap**: Handle multiple projects per resource per day
- **Priority System**: High/Medium/Low priority classification with visual indicators

#### 3.1.3 Advanced Work Management
- **Day-specific Work Removal**: Remove work from individual days within a project
- **Project Splitting**: Automatically split projects when removing middle days
- **Timeline Adjustment**: Shorten projects by removing start/end days
- **Smart Project Logic**: Handle edge cases like removing the only day in a project
- **Multiple Deletion Methods**: Timeline hover actions, overflow indicators, and modal controls

#### 3.1.4 Calendar Visualization
- **3-Month Continuous Timeline**: Display previous, current, and next month horizontally
- **Resource Rows**: Each team member gets dedicated horizontal timeline
- **Project Blocks**: Visual representation of project assignments with rotated text
- **Today Indicator**: Clear highlighting of current date across entire timeline
- **Weekend Highlighting**: Visual distinction for non-working days
- **Month Separators**: Clear visual boundaries between months

#### 3.1.5 Analytics & Insights
- **Utilization Rates**: Percentage calculation of busy vs. available days across 3 months
- **Team Statistics**: Aggregate metrics for resources, projects, and priorities
- **Availability Tracking**: Visual indicators for over/under-utilized resources
- **Real-time Updates**: Dynamic recalculation as projects are modified

### 3.2 User Interactions

#### 3.2.1 Navigation & Controls
- **Horizontal Scrolling**: Smooth navigation across 3-month timeline
- **Quick Actions**: Prominent buttons for adding resources and projects
- **Test Data Loading**: One-click sample data for demonstration
- **Keyboard Shortcuts**: ESC key to close modals, standard form navigation

#### 3.2.2 Project Interaction Methods
- **Click to Edit**: Direct project editing via timeline interaction
- **Hover Delete**: Red X buttons appear on project hover for quick deletion
- **Overflow Management**: Click +N indicators to delete multiple projects from a day
- **Day-level Actions**: Small red dots for clearing all work from specific days
- **Modal Actions**: Comprehensive editing, deletion, and work removal controls

#### 3.2.3 Deletion & Modification Workflows
1. **Individual Project Deletion**:
   - Hover timeline block → Click red X
   - Edit modal → Delete Project button
   
2. **Day-level Work Removal**:
   - Click overflow indicators (+N)
   - Click red dots on day hover
   - Edit modal → Remove Work interface
   
3. **Batch Operations**:
   - Select multiple days in Remove Work interface
   - Confirm bulk deletions with project lists

## 4. UI/UX Requirements

### 4.1 Design Principles

#### 4.1.1 Visual Hierarchy
- **Primary**: 3-month continuous timeline takes 70% of screen space
- **Secondary**: Resource utilization cards with progress bars and statistics
- **Tertiary**: Action buttons, navigation elements, and summary metrics

#### 4.1.2 Information Density
- **Optimal Viewing**: Balance between detail and overview across 90+ days
- **Progressive Disclosure**: Show essential info first, details on interaction
- **Contextual Information**: Relevant data appears based on user actions
- **Compact Design**: Efficient use of horizontal space for timeline view

#### 4.1.3 Interaction Patterns
- **Hover States**: Progressive revelation of action buttons and options
- **Modal Workflows**: Focused editing environments with keyboard support
- **Confirmation Patterns**: Clear dialogs for destructive actions
- **Visual Feedback**: Immediate updates and state changes

### 4.2 Color System

#### 4.2.1 Resource Colors
```
Primary Palette:
- Blue: #3B82F6 (Frontend/UI roles)
- Green: #10B981 (Backend/API roles)
- Orange: #F59E0B (Design/Creative roles)
- Red: #EF4444 (QA/Testing roles)
- Purple: #8B5CF6 (DevOps/Infrastructure roles)
- Dark Orange: #F97316 (Management/Strategy roles)
- Cyan: #06B6D4 (Additional roles)
- Lime: #84CC16 (Additional roles)
```

#### 4.2.2 System Colors
```
Status Colors:
- Today Highlight: #DBEAFE (Light Blue)
- Weekend Background: #F9FAFB (Light Gray)
- High Priority: #EF4444 (Red)
- Medium Priority: #F59E0B (Orange)
- Low Priority: #10B981 (Green)

Action Colors:
- Delete Actions: #EF4444 (Red)
- Remove Work: #EA580C (Orange)
- Edit Actions: #3B82F6 (Blue)
- Cancel Actions: #6B7280 (Gray)

Utilization Colors:
- Healthy (0-60%): #10B981 (Green)
- Busy (61-80%): #F59E0B (Orange)
- Overloaded (81-100%): #EF4444 (Red)
```

### 4.3 Typography

#### 4.3.1 Font Hierarchy
```
Primary Font: System UI Font Stack
- Headers: 24px, 18px, 16px (font-bold)
- Body Text: 14px (font-medium)
- Small Text: 12px, 10px (font-medium)
- Labels: 12px (font-semibold)
- Timeline Text: 10px (font-bold, rotated -90deg)
```

#### 4.3.2 Text Treatment
- **Resource Names**: Bold, truncated with ellipsis in 128px column
- **Project Titles**: Rotated 90 degrees, truncated to 8 characters
- **Dates**: Bold for day numbers, regular for day abbreviations
- **Statistics**: Bold for numbers, regular for labels
- **Button Text**: 14px for main buttons, 12px for compact day buttons

### 4.4 Layout Specifications

#### 4.4.1 Timeline Grid
```
Structure:
- Resource Column: Fixed 128px width
- Day Columns: 32px width each (~96 columns for 3 months)
- Row Height: 64px per resource
- Header Height: Auto (2-line day display)
- Month Separators: 2px vertical lines
```

#### 4.4.2 Spacing System
```
Padding/Margins:
- Container: 24px
- Card Padding: 16px
- Element Spacing: 8px, 12px, 16px
- Button Padding: 12px 16px (standard), 8px 12px (compact)
- Modal Padding: 24px
- Timeline Cell Padding: 2px
```

#### 4.4.3 Responsive Behavior
- **Desktop (1200px+)**: Full 3-month timeline visible with horizontal scroll
- **Tablet (768-1199px)**: Horizontal scroll for timeline navigation
- **Mobile (320-767px)**: Stacked month view with vertical scroll (future enhancement)

### 4.5 Interactive Elements

#### 4.5.1 Button Specifications
```
Standard Buttons:
- Padding: 12px 16px
- Font: 14px, font-medium
- Border Radius: 6px
- Icon + Text layout

Compact Modal Buttons:
- Padding: 6px 12px  
- Font: 14px, font-medium
- Border Radius: 4px

Day Selection Buttons:
- Padding: 4px
- Font: 10px, font-medium
- Grid: 10 columns
- Size: Minimal with hover states

Color Variants:
- Primary: #3B82F6 (Blue)
- Destructive: #EF4444 (Red) 
- Warning: #EA580C (Orange)
- Secondary: #6B7280 (Gray)
```

#### 4.5.2 Project Blocks
```
Visual Treatment:
- Background: Resource color
- Text: White, 10px, font-bold, rotated -90deg
- Border Radius: 4px
- Height: Fills cell (60px)
- Width: 30px (within 32px column)
- Hover: Reveals delete button overlay
```

#### 4.5.3 Interactive Overlays
```
Delete Buttons:
- Size: 16px x 16px (project), 12px x 12px (overflow)
- Position: Absolute top-right
- Background: #EF4444 (Red)
- Icon: X symbol, white
- Transition: 200ms opacity
- Z-index: 10 (above other elements)

Day Clear Buttons:
- Size: 8px x 8px
- Position: Top-right corner of day cell
- Background: #EF4444 with opacity
- Hover: Solid red background
```

#### 4.5.4 Form Elements
```
Input Fields:
- Border: 1px solid #D1D5DB
- Border Radius: 6px
- Padding: 8px 12px
- Focus: Blue border (#3B82F6)
- Font: 14px, system font

Select Dropdowns:
- Same styling as input fields
- Consistent height and padding
- Proper option formatting

Color Picker:
- Grid layout: 4x2
- Button size: 32px x 32px
- Border: 2px (selected: gray-800, unselected: gray-300)
- Border radius: 50% (circular)
```

### 4.6 Component Specifications

#### 4.6.1 Resource Utilization Cards
```
Layout:
- 2-column grid on desktop (1-column on tablet)
- Border: 1px solid #E5E7EB
- Border Radius: 8px
- Padding: 16px
- Hover: #F9FAFB background

Content:
- Resource name + role (truncated)
- Utilization percentage (large, colored)
- Progress bar (height: 8px, colored by utilization)
- Busy/free day counts (small text)
- Edit/delete action buttons (12px icons)
```

#### 4.6.2 Summary Statistics
```
Layout:
- 5-column grid (responsive to 3 then 2 then 1)
- Background: White
- Shadow: Subtle drop shadow
- Border Radius: 8px
- Padding: 16px

Content:
- Metric label (12px, gray)
- Large number (24px, bold, colored)
- Icon accent (18px, colored)

Metrics:
- Total Resources
- Active Projects  
- High Priority Projects
- Today's Work
- Average Utilization
```

#### 4.6.3 Modal Forms
```
Overlay:
- Background: rgba(0,0,0,0.5)
- Z-index: 50
- Full viewport coverage

Modal Container:
- Width: 384px (24rem)
- Max-width: 90vw
- Background: White
- Border Radius: 8px
- Padding: 24px
- Shadow: Large drop shadow
- Position: Centered in viewport

Form Structure:
- Label-input pairs with consistent spacing
- Grid layouts for date inputs (2-column)
- Button row at bottom (right-aligned)
- Optional expandable sections (Remove Work)
```

#### 4.6.4 Timeline Components
```
Month Headers:
- Background: #F3F4F6 (Light gray)
- Padding: 12px
- Font: 16px, font-semibold
- Border: Bottom 1px
- Sticky positioning consideration

Day Headers:
- 2-line layout: Day letter + Date number
- Font: 10px day, 12px date
- Padding: 4px
- Weekend highlighting
- Today highlighting (#DBEAFE)

Resource Rows:
- Alternating hover states
- Fixed left column (128px)
- Scrollable content area
- Border separation between resources
```

### 4.7 Animation & Transitions

#### 4.7.1 Micro-interactions
```
Hover States:
- Duration: 150ms
- Easing: ease-out
- Properties: background-color, box-shadow, opacity

Button Interactions:
- Hover: Background color change
- Active: Slight scale (0.98)
- Focus: Outline ring

Delete Button Reveals:
- Entry: Opacity 0 to 1
- Duration: 200ms
- Easing: ease-out
- Trigger: Parent hover
```

#### 4.7.2 Modal Transitions
```
Modal Entry:
- Background: Fade in opacity
- Container: Scale from 0.95 to 1.0
- Duration: 200ms
- Easing: ease-out

Modal Exit:
- Background: Fade out opacity
- Container: Scale to 0.95
- Duration: 150ms
- Easing: ease-in
```

#### 4.7.3 Loading States
- **Initial Load**: Skeleton screens for calendar grid
- **Data Updates**: Subtle loading indicators
- **Form Submission**: Button loading states with spinner
- **Project Updates**: Immediate visual feedback

## 5. Technical Requirements

### 5.1 Performance
- **Initial Load**: < 2 seconds for 3-month data (90+ days, 6 resources, 25+ projects)
- **Interaction Response**: < 100ms for UI updates
- **Memory Usage**: Efficient rendering for 100+ projects across timeline
- **Scroll Performance**: Smooth horizontal timeline navigation (60fps)
- **State Updates**: Optimized re-renders for project modifications

### 5.2 Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Responsive**: 320px - 3840px viewport widths
- **JavaScript**: ES6+ features, React Hooks, modern event handling

### 5.3 Data Management
- **Local Storage**: Project and resource data persistence
- **State Management**: React state for real-time updates
- **Data Validation**: Form validation and error handling
- **Export Capability**: Future enhancement for data export
- **Import Capability**: Test data loading functionality

### 5.4 Accessibility Requirements
- **Keyboard Navigation**: Full functionality via keyboard
- **Screen Reader**: Proper ARIA labels and descriptions
- **Color Contrast**: 4.5:1 ratio for normal text
- **Focus Management**: Clear focus indicators and modal focus trapping
- **Alternative Text**: Meaningful descriptions for visual elements

## 6. Success Metrics

### 6.1 User Engagement
- **Daily Active Users**: Target 80% team adoption
- **Feature Usage**: 90% of users create projects within first week
- **Session Duration**: Average 10+ minutes per planning session
- **Advanced Feature Adoption**: 60% use Remove Work functionality within first month

### 6.2 Business Impact
- **Planning Efficiency**: 50% reduction in resource planning time
- **Conflict Detection**: 90% of scheduling conflicts identified visually
- **Resource Utilization**: 20% improvement in team capacity optimization
- **Timeline Accuracy**: 30% reduction in project timeline adjustments

### 6.3 User Satisfaction
- **Usability Score**: Target SUS score of 80+
- **Task Completion**: 95% success rate for core user tasks
- **User Feedback**: Net Promoter Score of 8+
- **Error Rate**: <5% for project creation and editing tasks

## 7. Implementation Phases

### 7.1 Phase 1 (MVP) - Core Features ✅ COMPLETED
- ✅ 3-month continuous timeline visualization
- ✅ Resource and project management
- ✅ Basic utilization tracking
- ✅ Interactive project editing
- ✅ Priority system implementation
- ✅ Test data loading functionality

### 7.2 Phase 2 (Advanced Management) ✅ COMPLETED  
- ✅ Advanced deletion workflows (hover, overflow, day-level)
- ✅ Remove Work functionality with project splitting
- ✅ Enhanced modal interactions with ESC key support
- ✅ Compact UI design and improved button sizing
- ✅ Comprehensive confirmation dialogs
- ✅ Smart project timeline management

### 7.3 Phase 3 - Enhanced Analytics (PLANNED)
- Advanced filtering and search capabilities
- Team performance analytics dashboard
- Resource capacity forecasting
- Detailed utilization reports
- Export and reporting features

### 7.4 Phase 4 - Collaboration (PLANNED)
- Multi-user support and real-time updates
- Team collaboration features
- Notification system for conflicts
- Integration with external project management tools
- API development for third-party integrations

## 8. Risk Assessment

### 8.1 Technical Risks
- **Performance**: Large dataset rendering with 3-month continuous view
- **Browser Compatibility**: Cross-browser timeline rendering consistency
- **Data Loss**: Local storage limitations and backup strategies
- **Complex Interactions**: Managing multiple deletion and editing workflows

### 8.2 User Experience Risks
- **Learning Curve**: Complex interface with multiple interaction methods
- **Information Overload**: Dense timeline with 90+ days of data
- **Mobile Usability**: Limited screen real estate for continuous timeline
- **Accidental Deletions**: Multiple deletion methods may cause confusion

### 8.3 Mitigation Strategies
- Progressive enhancement for complex features
- Comprehensive onboarding and test data
- Mobile-first responsive design approach (Phase 4)
- Confirmation dialogs for all destructive actions
- Clear visual hierarchy and interaction patterns
- User testing and feedback collection at each phase

### 8.4 Data Integrity Risks
- **Concurrent Edits**: Potential conflicts in single-user environment
- **State Consistency**: Managing complex project splitting logic
- **Validation**: Ensuring date ranges and resource assignments remain valid

## 9. Quality Assurance

### 9.1 Testing Strategy
- **Unit Testing**: Component-level functionality testing
- **Integration Testing**: Modal workflows and state management
- **User Acceptance Testing**: Real project manager scenarios
- **Performance Testing**: Timeline rendering with large datasets
- **Accessibility Testing**: Screen reader and keyboard navigation

### 9.2 Edge Cases
- **Empty States**: No resources, no projects, loading states
- **Boundary Conditions**: Single-day projects, month transitions
- **Complex Scenarios**: Overlapping projects, resource conflicts
- **Data Validation**: Invalid dates, missing required fields

---

**Document Version**: 2.0  
**Last Updated**: December 2024  
**Status**: Implementation Complete (Phases 1-2)  
**Next Review**: Q1 2025 for Phase 3 Planning  
**Stakeholders**: Product Team, Engineering Team, Design Team, QA Team
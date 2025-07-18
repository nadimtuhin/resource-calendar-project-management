import React from 'react';
import { Resource, Project, Holiday, Leave } from '../../types';
import { TimelineHeader } from './TimelineHeader';
import { ResourceRow } from './ResourceRow';

interface TimelineProps {
  resources: Resource[];
  projects: Project[];
  dateRange: { startDate: Date; endDate: Date };
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resourceId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onClearDay: (resourceId: string, date: string) => void;
  onShowOverflow: (projects: Project[], date: Date) => void;
  isHoliday?: (date: Date) => Holiday | null;
  isWeekend?: (date: Date) => boolean;
  isLeaveDay?: (date: Date, resourceId: string) => Leave | null;
}

// Generate date range from start to end date
const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

export const Timeline: React.FC<TimelineProps> = ({
  resources,
  projects,
  dateRange,
  onEditResource,
  onDeleteResource,
  onEditProject,
  onDeleteProject,
  onClearDay,
  onShowOverflow,
  isHoliday,
  isWeekend,
  isLeaveDay,
}) => {
  const dates = generateDateRange(dateRange.startDate, dateRange.endDate);

  if (resources.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No resources added yet. Add your first team member to get started.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${32 * dates.length + 128}px` }}>
          <TimelineHeader 
            dates={dates} 
            isHoliday={isHoliday ? (date) => !!isHoliday(date) : undefined}
            isCustomWeekend={isWeekend}
          />
          <div className="divide-y divide-gray-200">
            {resources.map((resource) => (
              <ResourceRow
                key={resource.id}
                resource={resource}
                dates={dates}
                projects={projects}
                onEditResource={onEditResource}
                onDeleteResource={onDeleteResource}
                onEditProject={onEditProject}
                onDeleteProject={onDeleteProject}
                onClearDay={onClearDay}
                onShowOverflow={onShowOverflow}
                isHoliday={isHoliday}
                isWeekend={isWeekend}
                isLeaveDay={isLeaveDay}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
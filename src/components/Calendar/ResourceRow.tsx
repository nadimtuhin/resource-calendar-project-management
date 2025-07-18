import React from 'react';
import { Resource, Project } from '../../types';
import { DayCell } from './DayCell';
import { Edit2, Trash2 } from 'lucide-react';

interface ResourceRowProps {
  resource: Resource;
  dates: Date[];
  projects: Project[];
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resourceId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onClearDay: (resourceId: string, date: string) => void;
  onShowOverflow: (projects: Project[], date: Date) => void;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({
  resource,
  dates,
  projects,
  onEditResource,
  onDeleteResource,
  onEditProject,
  onDeleteProject,
  onClearDay,
  onShowOverflow,
}) => {
  const getProjectsForDate = (date: Date): Project[] => {
    const dateStr = date.toISOString().split('T')[0];
    return projects.filter(project => 
      project.resourceId === resource.id &&
      project.startDate <= dateStr &&
      project.endDate >= dateStr
    );
  };

  const truncateName = (name: string, maxLength: number = 16) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50">
      {/* Resource info column */}
      <div className="w-32 p-3 border-r border-gray-200 bg-white sticky left-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: resource.color }}
            />
            <div>
              <div className="font-medium text-sm text-gray-900" title={resource.name}>
                {truncateName(resource.name)}
              </div>
              <div className="text-xs text-gray-500">
                {resource.role}
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onEditResource(resource)}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={() => onDeleteResource(resource.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline cells */}
      <div className="flex">
        {dates.map((date, index) => (
          <DayCell
            key={index}
            date={date}
            projects={getProjectsForDate(date)}
            resource={resource}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
            onClearDay={onClearDay}
            onShowOverflow={onShowOverflow}
          />
        ))}
      </div>
    </div>
  );
};
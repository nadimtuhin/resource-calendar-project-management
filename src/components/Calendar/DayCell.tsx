import React, { useState } from 'react';
import { Project, Resource } from '../../types';
import { isToday, isWeekend } from '../../utils/dateUtils';
import { ProjectBlock } from './ProjectBlock';
import { X } from 'lucide-react';

interface DayCellProps {
  date: Date;
  projects: Project[];
  resource: Resource;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onClearDay: (resourceId: string, date: string) => void;
  onShowOverflow: (projects: Project[], date: Date) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  projects,
  resource,
  onEditProject,
  onDeleteProject,
  onClearDay,
  onShowOverflow,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const dateStr = date.toISOString().split('T')[0];
  const isCurrentDay = isToday(date);
  const isWeekendDay = isWeekend(date);
  const hasProjects = projects.length > 0;

  const displayedProjects = projects.slice(0, 1); // Show only first project
  const overflowCount = projects.length - 1;

  const handleClearDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearDay(resource.id, dateStr);
  };

  return (
    <div
      className={`relative w-8 h-16 border-r border-gray-200 flex flex-col p-1 ${
        isCurrentDay 
          ? 'bg-blue-50' 
          : isWeekendDay 
            ? 'bg-gray-50' 
            : 'bg-white'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main project block */}
      {displayedProjects.map((project) => (
        <div key={project.id} className="flex-1 mb-1">
          <ProjectBlock
            project={project}
            resourceColor={resource.color}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
          />
        </div>
      ))}

      {/* Overflow indicator */}
      {overflowCount > 0 && (
        <button
          className="text-xs font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded px-1 py-0.5 transition-colors"
          onClick={() => onShowOverflow(projects, date)}
        >
          +{overflowCount}
        </button>
      )}

      {/* Clear day button - appears on hover when there are projects */}
      {isHovered && hasProjects && (
        <button
          className="absolute top-1 right-1 w-2 h-2 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors z-10"
          onClick={handleClearDay}
        >
          <X size={6} className="text-white" />
        </button>
      )}
    </div>
  );
};
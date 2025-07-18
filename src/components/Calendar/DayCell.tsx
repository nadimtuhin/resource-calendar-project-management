import React, { useState } from 'react';
import { Project, Resource } from '../../types';
import { isToday, isWeekend } from '../../utils/dateUtils';
import { X } from 'lucide-react';

interface DayCellProps {
  date: Date;
  projects: Project[];
  resource: Resource;
  onClearDay: (resourceId: string, date: string) => void;
  onShowOverflow: (projects: Project[], date: Date) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  projects,
  resource,
  onClearDay,
  onShowOverflow,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const dateStr = date.toISOString().split('T')[0];
  const isCurrentDay = isToday(date);
  const isWeekendDay = isWeekend(date);
  const hasProjects = projects.length > 0;

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
      {/* Show project count indicator when there are multiple projects */}
      {projects.length > 1 && (
        <button
          className="text-xs font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded px-1 py-0.5 transition-colors absolute bottom-1 left-1 right-1"
          onClick={() => onShowOverflow(projects, date)}
        >
          {projects.length}
        </button>
      )}

      {/* Clear day button - appears on hover when there are projects */}
      {isHovered && hasProjects && (
        <button
          className="absolute top-1 right-1 w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors z-30"
          onClick={handleClearDay}
        >
          <X size={8} className="text-white" />
        </button>
      )}
    </div>
  );
};
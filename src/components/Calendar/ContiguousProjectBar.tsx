import React, { useState } from 'react';
import { Project, Holiday } from '../../types';
import { PRIORITY_COLORS } from '../../constants/colors';
import { Edit2, Trash2, Calendar } from 'lucide-react';

interface ContiguousProjectBarProps {
  project: Project;
  resourceColor: string;
  startIndex: number;
  span: number;
  dates: Date[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  isHoliday?: (date: Date) => Holiday | null;
  isWeekend?: (date: Date) => boolean;
}

export const ContiguousProjectBar: React.FC<ContiguousProjectBarProps> = ({
  project,
  resourceColor,
  startIndex,
  span,
  dates,
  onEdit,
  onDelete,
  isHoliday,
  isWeekend,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate position and width based on cell dimensions (32px width per cell)
  const left = startIndex * 32;
  const width = span * 32;
  
  // Calculate holiday segments within the project bar
  const getHolidaySegments = () => {
    const segments: { index: number; holiday: Holiday; isWeekend: boolean }[] = [];
    
    for (let i = 0; i < span; i++) {
      const dateIndex = startIndex + i;
      if (dateIndex < dates.length) {
        const date = dates[dateIndex];
        const holiday = isHoliday?.(date);
        const weekend = isWeekend?.(date) || false;
        
        if (holiday || weekend) {
          segments.push({
            index: i,
            holiday: holiday!,
            isWeekend: weekend
          });
        }
      }
    }
    
    return segments;
  };
  
  const holidaySegments = getHolidaySegments();
  
  // Calculate work days vs non-work days for tooltip
  const workDays = span - holidaySegments.length;
  const nonWorkDays = holidaySegments.length;
  
  return (
    <div
      className="absolute top-1 h-14 rounded shadow-sm cursor-pointer transition-all hover:shadow-md overflow-hidden"
      style={{
        left: `${left}px`,
        width: `${width}px`,
        backgroundColor: resourceColor,
        zIndex: 20,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(project)}
      title={`${project.title} | ${workDays} work days, ${nonWorkDays} non-work days`}
    >
      {/* Priority indicator bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t"
        style={{ backgroundColor: PRIORITY_COLORS[project.priority] }}
      />
      
      {/* Holiday segments overlay */}
      {holidaySegments.map((segment, idx) => (
        <div
          key={idx}
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: `${segment.index * 32}px`,
            width: '32px',
            background: segment.holiday 
              ? 'repeating-linear-gradient(45deg, rgba(220, 38, 38, 0.4), rgba(220, 38, 38, 0.4) 4px, transparent 4px, transparent 8px)'
              : 'repeating-linear-gradient(45deg, rgba(156, 163, 175, 0.4), rgba(156, 163, 175, 0.4) 4px, transparent 4px, transparent 8px)',
          }}
        >
          {/* Holiday icon */}
          {segment.holiday && (
            <div className="absolute top-1 right-1">
              <Calendar size={10} className="text-red-600" />
            </div>
          )}
        </div>
      ))}
      
      {/* Project name - displayed horizontally */}
      <div className="px-2 py-1 flex items-center justify-between h-full">
        <div className="flex-1 overflow-hidden">
          <div className="text-white text-sm font-semibold truncate drop-shadow-sm">
            {project.title}
          </div>
          <div className="text-white text-xs opacity-90 truncate drop-shadow-sm">
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </div>
          {nonWorkDays > 0 && (
            <div className="text-white text-xs opacity-75 truncate drop-shadow-sm">
              {workDays} work days ({nonWorkDays} non-work)
            </div>
          )}
        </div>
        
        {/* Action buttons - appear on hover */}
        {isHovered && (
          <div className="flex items-center space-x-1 ml-2">
            <button
              className="p-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
            >
              <Edit2 size={12} className="text-white" />
            </button>
            <button
              className="p-1 bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
            >
              <Trash2 size={12} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
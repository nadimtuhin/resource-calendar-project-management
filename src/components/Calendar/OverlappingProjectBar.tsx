import React, { useState } from 'react';
import { Project, Holiday } from '../../types';
import { PRIORITY_COLORS } from '../../constants/colors';
import { Edit2, Trash2, Calendar } from 'lucide-react';

interface OverlappingProjectBarProps {
  project: Project;
  resourceColor: string;
  startIndex: number;
  span: number;
  layer: number;
  dates: Date[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  isHoliday?: (date: Date) => Holiday | null;
  isWeekend?: (date: Date) => boolean;
  hasDividerAfter?: boolean;
}

export const OverlappingProjectBar: React.FC<OverlappingProjectBarProps> = ({
  project,
  resourceColor,
  startIndex,
  span,
  layer,
  dates,
  onEdit,
  onDelete,
  isHoliday,
  isWeekend,
  hasDividerAfter,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate position and width based on cell dimensions (32px width per cell)
  const left = startIndex * 32;
  const width = span * 32;
  
  // Calculate vertical position based on layer (stack overlapping projects)
  const layerHeight = 16; // Height per layer
  const top = 1 + (layer * layerHeight);
  const barHeight = 14; // Slightly smaller for stacked projects
  
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
    <>
      {/* Project Bar */}
      <div
        className="absolute rounded shadow-sm cursor-pointer transition-all hover:shadow-md overflow-hidden border border-white/30"
        style={{
          left: `${left}px`,
          width: `${width}px`,
          top: `${top}px`,
          height: `${barHeight}px`,
          backgroundColor: resourceColor,
          zIndex: 20 + layer,
          opacity: layer > 0 ? 0.85 : 1, // Slightly transparent for stacked projects
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onEdit(project)}
        title={`${project.title} (Layer ${layer + 1}) | ${workDays} work days, ${nonWorkDays} non-work days`}
      >
        {/* Priority indicator bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t"
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
                ? 'repeating-linear-gradient(45deg, rgba(220, 38, 38, 0.4), rgba(220, 38, 38, 0.4) 2px, transparent 2px, transparent 4px)'
                : 'repeating-linear-gradient(45deg, rgba(156, 163, 175, 0.4), rgba(156, 163, 175, 0.4) 2px, transparent 2px, transparent 4px)',
            }}
          >
            {/* Holiday icon */}
            {segment.holiday && (
              <div className="absolute top-0.5 right-0.5">
                <Calendar size={8} className="text-red-600" />
              </div>
            )}
          </div>
        ))}
        
        {/* Project name - displayed horizontally */}
        <div className="px-1 py-0.5 flex items-center justify-between h-full">
          <div className="flex-1 overflow-hidden">
            <div className="text-white text-xs font-semibold truncate drop-shadow-sm">
              {project.title}
            </div>
          </div>
          
          {/* Action buttons - appear on hover */}
          {isHovered && (
            <div className="flex items-center space-x-0.5 ml-1">
              <button
                className="p-0.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
              >
                <Edit2 size={8} className="text-white" />
              </button>
              <button
                className="p-0.5 bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
              >
                <Trash2 size={8} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Project Divider */}
      {hasDividerAfter && (
        <div
          className="absolute border-r-2 border-gray-300 pointer-events-none"
          style={{
            left: `${left + width}px`,
            top: '1px',
            height: '58px', // Full height of the row
            zIndex: 25,
          }}
        >
          {/* Divider line with dot */}
          <div className="absolute top-1/2 -right-1 w-2 h-2 bg-gray-300 rounded-full transform -translate-y-1/2"></div>
        </div>
      )}
    </>
  );
};
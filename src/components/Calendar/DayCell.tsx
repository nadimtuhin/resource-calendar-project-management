import React, { useState } from 'react';
import { Project, Resource, Holiday, Leave } from '../../types';
import { isToday } from '../../utils/dateUtils';
import { X, Calendar } from 'lucide-react';

interface DayCellProps {
  date: Date;
  projects: Project[];
  resource: Resource;
  onClearDay: (resourceId: string, date: string) => void;
  onShowOverflow: (projects: Project[], date: Date) => void;
  holiday?: Holiday | null;
  isWeekend?: boolean;
  leave?: Leave | null;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  projects,
  resource,
  onClearDay,
  onShowOverflow,
  holiday,
  isWeekend: isWeekendDay,
  leave,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const dateStr = date.toISOString().split('T')[0];
  const isCurrentDay = isToday(date);
  const hasProjects = projects.length > 0;

  const handleClearDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearDay(resource.id, dateStr);
  };

  const getLeaveTypeColor = (leaveType: Leave['type']) => {
    switch (leaveType) {
      case 'vacation': return 'bg-blue-100 border-blue-300';
      case 'sick': return 'bg-red-100 border-red-300';
      case 'personal': return 'bg-green-100 border-green-300';
      case 'holiday': return 'bg-purple-100 border-purple-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getCellBackground = () => {
    if (leave) return getLeaveTypeColor(leave.type);
    if (isCurrentDay) return 'bg-blue-50';
    if (holiday) return 'bg-red-50 border-red-200';
    if (isWeekendDay) return 'bg-gray-50';
    return 'bg-white';
  };

  const getTooltipText = () => {
    let tooltip = '';
    if (leave) {
      tooltip += `Leave: ${leave.type} (${leave.status})`;
      if (leave.reason) tooltip += ` - ${leave.reason}`;
    }
    if (holiday) {
      if (tooltip) tooltip += ' | ';
      tooltip += `Holiday: ${holiday.name}${holiday.description ? ` - ${holiday.description}` : ''}`;
    }
    if (holiday && leave) {
      tooltip += ' | Holiday falls within leave period';
    }
    return tooltip || undefined;
  };

  return (
    <div
      className={`relative w-8 h-16 border-r border-gray-200 flex flex-col p-1 ${getCellBackground()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={getTooltipText()}
    >
      {/* Holiday indicator */}
      {holiday && (
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" title={holiday.name} />
      )}
      
      {/* Holiday overlay for better visibility */}
      {holiday && !leave && (
        <div className="absolute inset-0 bg-red-100 bg-opacity-30 pointer-events-none" />
      )}
      
      {/* Holiday pattern within leave periods */}
      {holiday && leave && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(45deg, rgba(220, 38, 38, 0.3), rgba(220, 38, 38, 0.3) 2px, transparent 2px, transparent 4px)',
          }}
        />
      )}

      {/* Leave indicator */}
      {leave && leave.status === 'approved' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Calendar size={12} className="text-gray-600 opacity-50" />
          {/* Holiday marker within leave */}
          {holiday && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" title={holiday.name} />
          )}
        </div>
      )}

      {/* Pending leave indicator */}
      {leave && leave.status === 'pending' && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full" title="Pending leave" />
      )}

      {/* Show project count indicator when there are multiple projects */}
      {projects.length > 1 && !leave && (
        <button
          className="text-xs font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded px-1 py-0.5 transition-colors absolute bottom-1 left-1 right-1"
          onClick={() => onShowOverflow(projects, date)}
        >
          {projects.length}
        </button>
      )}

      {/* Clear day button - appears on hover when there are projects */}
      {isHovered && hasProjects && !leave && (
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
import React, { useState } from 'react';
import { Project } from '../../types';
import { PRIORITY_COLORS } from '../../constants/colors';
import { Edit2, Trash2 } from 'lucide-react';

interface ContiguousProjectBarProps {
  project: Project;
  resourceColor: string;
  startIndex: number;
  span: number;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export const ContiguousProjectBar: React.FC<ContiguousProjectBarProps> = ({
  project,
  resourceColor,
  startIndex,
  span,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate position and width based on cell dimensions (32px width per cell)
  const left = startIndex * 32;
  const width = span * 32;
  
  return (
    <div
      className="absolute top-1 h-14 rounded shadow-sm cursor-pointer transition-all hover:shadow-md"
      style={{
        left: `${left}px`,
        width: `${width}px`,
        backgroundColor: resourceColor,
        zIndex: 20,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(project)}
    >
      {/* Priority indicator bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t"
        style={{ backgroundColor: PRIORITY_COLORS[project.priority] }}
      />
      
      {/* Project name - displayed horizontally */}
      <div className="px-2 py-1 flex items-center justify-between h-full">
        <div className="flex-1 overflow-hidden">
          <div className="text-white text-sm font-semibold truncate">
            {project.title}
          </div>
          <div className="text-white text-xs opacity-80 truncate">
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </div>
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
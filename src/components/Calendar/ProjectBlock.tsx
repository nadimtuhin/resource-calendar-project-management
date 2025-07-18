import React, { useState } from 'react';
import { Project } from '../../types';
import { PRIORITY_COLORS } from '../../constants/colors';
import { X } from 'lucide-react';

interface ProjectBlockProps {
  project: Project;
  resourceColor: string;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectBlock: React.FC<ProjectBlockProps> = ({
  project,
  resourceColor,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const truncateTitle = (title: string, maxLength: number = 8) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div
      className="relative h-full w-full cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(project)}
    >
      <div
        className="h-full w-full rounded flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: resourceColor }}
      >
        {/* Priority indicator */}
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: PRIORITY_COLORS[project.priority] }}
        />
        
        {/* Project title - rotated */}
        <div className="text-white text-xs font-bold transform -rotate-90 whitespace-nowrap">
          {truncateTitle(project.title)}
        </div>
        
        {/* Delete button - appears on hover */}
        {isHovered && (
          <button
            className="absolute top-1 right-1 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
          >
            <X size={10} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
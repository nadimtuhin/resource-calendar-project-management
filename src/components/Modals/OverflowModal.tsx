import React, { useEffect } from 'react';
import { Project, Resource } from '../../types';
import { X, Calendar, Trash2 } from 'lucide-react';
import { PRIORITY_COLORS } from '../../constants/colors';

interface OverflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  date: Date;
  resources: Resource[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onClearDay: (resourceId: string, date: string) => void;
}

export const OverflowModal: React.FC<OverflowModalProps> = ({
  isOpen,
  onClose,
  projects,
  date,
  resources,
  onEditProject,
  onDeleteProject,
  onClearDay,
}) => {
  const dateStr = date.toISOString().split('T')[0];
  const resource = resources.find(r => r.id === projects[0]?.resourceId);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleClearDay = () => {
    if (resource) {
      onClearDay(resource.id, dateStr);
      onClose();
    }
  };

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Projects for {date.toLocaleDateString()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: resource.color }}
            />
            <span>{resource.name}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PRIORITY_COLORS[project.priority] }}
                />
                <div>
                  <div className="font-medium text-sm">{project.title}</div>
                  <div className="text-xs text-gray-500">
                    {project.startDate} to {project.endDate}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    onEditProject(project);
                    onClose();
                  }}
                  className="p-1 text-blue-500 hover:text-blue-600"
                >
                  <Calendar size={14} />
                </button>
                <button
                  onClick={() => {
                    onDeleteProject(project.id);
                    onClose();
                  }}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button
            onClick={handleClearDay}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700"
          >
            <X size={16} />
            <span>Clear All Work</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
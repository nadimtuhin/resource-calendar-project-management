import React, { useState, useEffect } from 'react';
import { Project, Resource, ProjectStatus } from '../../types';
import { X, Calendar, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { MODAL_LEVELS } from '../../constants/zIndex';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onRemoveWork: (projectId: string, dates: string[]) => void;
  project?: Project;
  resources: Resource[];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  onRemoveWork,
  project,
  resources,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [workDaysNeeded, setWorkDaysNeeded] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [status, setStatus] = useState<ProjectStatus>('planning');
  const [showRemoveWork, setShowRemoveWork] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setStartDate(project.startDate);
      setEndDate(project.endDate);
      setDeadline(project.deadline || '');
      setWorkDaysNeeded(project.workDaysNeeded?.toString() || '');
      setResourceId(project.resourceId);
      setPriority(project.priority);
      setStatus(project.status);
    } else {
      setTitle('');
      setStartDate(formatDate(new Date()));
      setEndDate(formatDate(new Date()));
      setDeadline('');
      setWorkDaysNeeded('');
      setResourceId(resources[0]?.id || '');
      setPriority('medium');
      setStatus('planning');
    }
    setShowRemoveWork(false);
    setSelectedDates([]);
  }, [project, resources]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && startDate && endDate && resourceId) {
      const workDays = workDaysNeeded ? parseInt(workDaysNeeded) : undefined;
      const projectData = {
        title: title.trim(),
        startDate,
        endDate,
        deadline: deadline || undefined,
        workDaysNeeded: workDays,
        resourceId,
        priority,
        status,
        progress: 0,
      };
      
      if (project) {
        onUpdate(project.id, projectData);
      } else {
        onSave(projectData);
      }
      onClose();
    }
  };

  const handleDelete = () => {
    if (project && confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
      onClose();
    }
  };

  const getProjectDates = (): string[] => {
    if (!project) return [];
    
    const dates: string[] = [];
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const current = new Date(start);
    
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleRemoveWork = () => {
    if (project && selectedDates.length > 0) {
      onRemoveWork(project.id, selectedDates);
      onClose();
    }
  };

  if (!isOpen) return null;

  const projectDates = getProjectDates();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: MODAL_LEVELS.PROJECT }}
    >
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hard deadline"
              />
              <p className="text-xs text-gray-500 mt-1">Hard deadline for project completion</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Days Needed <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="number"
                value={workDaysNeeded}
                onChange={(e) => setWorkDaysNeeded(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5"
                min="1"
                max="365"
              />
              <p className="text-xs text-gray-500 mt-1">Total work days needed to complete</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource
            </label>
            <select
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a resource</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} - {resource.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="overdue">Overdue</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>

          {project && (
            <div className="border-t pt-4">
              <button
                type="button"
                onClick={() => setShowRemoveWork(!showRemoveWork)}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm"
              >
                <Calendar size={16} />
                <span>Remove Work from Days</span>
              </button>

              {showRemoveWork && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700 mb-2">
                    Select days to remove work from this project:
                  </p>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {projectDates.map((date) => {
                      const dateObj = new Date(date);
                      const isSelected = selectedDates.includes(date);
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => handleDateToggle(date)}
                          className={`p-1 rounded text-center ${
                            isSelected 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-white border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {dateObj.getDate()}
                        </button>
                      );
                    })}
                  </div>
                  {selectedDates.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRemoveWork}
                      className="mt-2 px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm"
                    >
                      Remove Work ({selectedDates.length} days)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div>
              {project && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                  <span>Delete Project</span>
                </button>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {project ? 'Update' : 'Add'} Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
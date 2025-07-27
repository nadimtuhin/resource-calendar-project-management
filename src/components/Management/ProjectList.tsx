import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Calendar, User, AlertCircle, Filter, Activity, Pause, CheckCircle, XCircle } from 'lucide-react';
import { Project, Resource, ProjectStatus } from '../../types';
import { PRIORITY_COLORS } from '../../constants/colors';

interface ProjectListProps {
  projects: Project[];
  resources: Resource[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

type PriorityFilter = 'all' | 'high' | 'medium' | 'low';
type StatusFilter = 'all' | ProjectStatus;

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  resources,
  onEditProject,
  onDeleteProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'title' | 'startDate' | 'priority' | 'resource'>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Get resource map for quick lookup
  const resourceMap = useMemo(() => {
    const map = new Map<string, Resource>();
    resources.forEach(resource => {
      map.set(resource.id, resource);
    });
    return map;
  }, [resources]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      const resource = resourceMap.get(project.resourceId);
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (resource?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'title': {
          aValue = a.title;
          bValue = b.title;
          break;
        }
        case 'startDate': {
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        }
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        }
        case 'resource': {
          const resourceA = resourceMap.get(a.resourceId);
          const resourceB = resourceMap.get(b.resourceId);
          aValue = resourceA?.name || '';
          bValue = resourceB?.name || '';
          break;
        }
        default: {
          aValue = a.title;
          bValue = b.title;
        }
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [projects, searchTerm, sortBy, sortOrder, priorityFilter, statusFilter, resourceMap]);

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    setSelectedProjects(prev => 
      prev.size === filteredAndSortedProjects.length 
        ? new Set() 
        : new Set(filteredAndSortedProjects.map(p => p.id))
    );
  };

  const handleBulkDelete = () => {
    if (selectedProjects.size > 0 && confirm(`Delete ${selectedProjects.size} project(s)?`)) {
      selectedProjects.forEach(projectId => {
        onDeleteProject(projectId);
      });
      setSelectedProjects(new Set());
    }
  };

  const handleSort = (column: 'title' | 'startDate' | 'priority' | 'resource') => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    const statusConfig = {
      planning: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Calendar },
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: Activity },
      'on-hold': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Pause },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      overdue: { bg: 'bg-red-200', text: 'text-red-900', icon: AlertCircle },
      'at-risk': { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle },
    };
    
    const config = statusConfig[status] || statusConfig.planning; // Fallback to planning if status not found
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={12} className="mr-1" />
        {status?.replace('-', ' ') || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {selectedProjects.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete ({selectedProjects.size})</span>
            </button>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="overdue">Overdue</option>
            <option value="at-risk">At Risk</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="w-12 p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProjects.size === filteredAndSortedProjects.length && filteredAndSortedProjects.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                Project {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('resource')}
              >
                Assignee {sortBy === 'resource' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('priority')}
              >
                Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('startDate')}
              >
                Timeline {sortBy === 'startDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-3 text-left font-medium text-gray-700">Status</th>
              <th className="p-3 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProjects.map((project) => {
              const resource = resourceMap.get(project.resourceId);
              
              return (
                <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProjects.has(project.id)}
                      onChange={() => toggleProjectSelection(project.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-gray-900">{project.title}</div>
                    {project.description && (
                      <div className="text-sm text-gray-500 mt-1">{project.description}</div>
                    )}
                  </td>
                  <td className="p-3">
                    {resource && (
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: resource.color }}
                        >
                          <User size={12} className="text-white" />
                        </div>
                        <span className="text-sm text-gray-700">{resource.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PRIORITY_COLORS[project.priority] }}
                      />
                      <span className="text-sm capitalize">{project.priority}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-gray-600">
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </div>
                    {project.deadline && (
                      <div className={`text-xs mt-1 ${
                        new Date(project.deadline) < new Date() 
                          ? 'text-red-600 font-medium' 
                          : 'text-orange-600'
                      }`}>
                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                        {new Date(project.deadline) < new Date() && ' (OVERDUE)'}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Progress: {project.progress}%
                      {project.workDaysNeeded && (
                        <span className="ml-2">• {project.workDaysNeeded} days needed</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    {getStatusBadge(project.status)}
                    {project.healthScore && (
                      <div className="text-xs text-gray-500 mt-1">
                        Health: {project.healthScore}%
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditProject(project)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredAndSortedProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || priorityFilter !== 'all' || statusFilter !== 'all' 
              ? 'No projects found matching your filters.' 
              : 'No projects available.'}
          </div>
        )}
      </div>
    </div>
  );
};
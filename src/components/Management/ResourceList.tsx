import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, User } from 'lucide-react';
import { Resource, Project } from '../../types';

interface ResourceListProps {
  resources: Resource[];
  projects: Project[];
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resourceId: string) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  projects,
  onEditResource,
  onDeleteResource,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'workload'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Calculate resource workload
  const resourceWorkload = useMemo(() => {
    const workload = new Map<string, number>();
    resources.forEach(resource => {
      const resourceProjects = projects.filter(p => p.resourceId === resource.id);
      workload.set(resource.id, resourceProjects.length);
    });
    return workload;
  }, [resources, projects]);

  // Filter and sort resources
  const filteredAndSortedResources = useMemo(() => {
    const filtered = resources.filter(resource =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'workload':
          aValue = resourceWorkload.get(a.id) || 0;
          bValue = resourceWorkload.get(b.id) || 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [resources, searchTerm, sortBy, sortOrder, resourceWorkload]);

  const toggleResourceSelection = (resourceId: string) => {
    setSelectedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    setSelectedResources(prev => 
      prev.size === filteredAndSortedResources.length 
        ? new Set() 
        : new Set(filteredAndSortedResources.map(r => r.id))
    );
  };

  const handleBulkDelete = () => {
    if (selectedResources.size > 0 && confirm(`Delete ${selectedResources.size} resource(s)?`)) {
      selectedResources.forEach(resourceId => {
        onDeleteResource(resourceId);
      });
      setSelectedResources(new Set());
    }
  };

  const handleSort = (column: 'name' | 'role' | 'workload') => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search and Actions */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {selectedResources.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete ({selectedResources.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="w-12 p-2 sm:p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedResources.size === filteredAndSortedResources.length && filteredAndSortedResources.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="p-2 sm:p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <span className="hidden sm:inline">Name</span>
                <span className="sm:hidden">Name</span>
                {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="p-2 sm:p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                onClick={() => handleSort('role')}
              >
                Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="p-2 sm:p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('workload')}
              >
                <span className="hidden sm:inline">Projects</span>
                <span className="sm:hidden">Proj</span>
                {sortBy === 'workload' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-2 sm:p-3 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedResources.map((resource) => (
              <tr key={resource.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-2 sm:p-3">
                  <input
                    type="checkbox"
                    checked={selectedResources.has(resource.id)}
                    onChange={() => toggleResourceSelection(resource.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2 sm:p-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: resource.color }}
                    >
                      <User size={12} className="sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{resource.name}</div>
                      <div className="text-xs text-gray-500 sm:hidden truncate">{resource.role}</div>
                    </div>
                  </div>
                </td>
                <td className="p-2 sm:p-3 text-gray-700 hidden sm:table-cell">{resource.role}</td>
                <td className="p-2 sm:p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {resourceWorkload.get(resource.id) || 0}
                    <span className="hidden sm:inline ml-1">projects</span>
                  </span>
                </td>
                <td className="p-2 sm:p-3">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditResource(resource)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteResource(resource.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedResources.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No resources found matching your search.' : 'No resources available.'}
          </div>
        )}
      </div>
    </div>
  );
};
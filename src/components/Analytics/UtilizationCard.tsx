import React from 'react';
import { Resource, Project } from '../../types';
import { getUtilizationColor } from '../../constants/colors';
import { getDateRange } from '../../utils/dateUtils';
import { Edit2, Trash2 } from 'lucide-react';

interface UtilizationCardProps {
  resource: Resource;
  projects: Project[];
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resourceId: string) => void;
}

export const UtilizationCard: React.FC<UtilizationCardProps> = ({
  resource,
  projects,
  onEditResource,
  onDeleteResource,
}) => {
  const calculateUtilization = () => {
    const dates = getDateRange(3);
    const totalDays = dates.length;
    const busyDays = new Set<string>();

    // Get all days where this resource has work
    projects
      .filter(project => project.resourceId === resource.id)
      .forEach(project => {
        const start = new Date(project.startDate);
        const end = new Date(project.endDate);
        const current = new Date(start);
        
        while (current <= end) {
          busyDays.add(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
      });

    const utilizationPercentage = Math.round((busyDays.size / totalDays) * 100);
    const utilizationColor = getUtilizationColor(utilizationPercentage);

    return {
      totalDays,
      busyDays: busyDays.size,
      freeDays: totalDays - busyDays.size,
      utilizationPercentage,
      utilizationColor,
    };
  };

  const stats = calculateUtilization();

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: resource.color }}
          />
          <div>
            <div className="font-medium text-sm text-gray-900">
              {resource.name}
            </div>
            <div className="text-xs text-gray-500">
              {resource.role}
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEditResource(resource)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDeleteResource(resource.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Utilization</span>
          <span 
            className="text-sm font-bold"
            style={{ color: stats.utilizationColor }}
          >
            {stats.utilizationPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${stats.utilizationPercentage}%`,
              backgroundColor: stats.utilizationColor
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-center">
          <div className="font-medium text-gray-900">{stats.busyDays}</div>
          <div className="text-gray-500">Busy Days</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900">{stats.freeDays}</div>
          <div className="text-gray-500">Free Days</div>
        </div>
      </div>
    </div>
  );
};
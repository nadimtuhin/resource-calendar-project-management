import React from 'react';
import { Resource, Project } from '../../types';
import { Users, Calendar, AlertCircle, Clock, BarChart3 } from 'lucide-react';
import { getDateRange } from '../../utils/dateUtils';
import { getUtilizationColor } from '../../constants/colors';

interface SummaryStatsProps {
  resources: Resource[];
  projects: Project[];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  resources,
  projects,
}) => {
  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const dates = getDateRange(3);
    
    // Calculate today's work
    const todayProjects = projects.filter(project => 
      project.startDate <= today && project.endDate >= today
    );

    // Calculate high priority projects
    const highPriorityProjects = projects.filter(project => 
      project.priority === 'high'
    );

    // Calculate average utilization
    const totalUtilization = resources.reduce((sum, resource) => {
      const busyDays = new Set<string>();
      
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

      return sum + Math.round((busyDays.size / dates.length) * 100);
    }, 0);

    const averageUtilization = resources.length > 0 
      ? Math.round(totalUtilization / resources.length)
      : 0;

    return {
      totalResources: resources.length,
      activeProjects: projects.length,
      highPriorityProjects: highPriorityProjects.length,
      todayWork: todayProjects.length,
      averageUtilization,
    };
  };

  const stats = calculateStats();

  const statItems = [
    {
      label: 'Total Resources',
      value: stats.totalResources,
      icon: Users,
      color: '#3B82F6',
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      icon: Calendar,
      color: '#10B981',
    },
    {
      label: 'High Priority',
      value: stats.highPriorityProjects,
      icon: AlertCircle,
      color: '#EF4444',
    },
    {
      label: "Today's Work",
      value: stats.todayWork,
      icon: Clock,
      color: '#F59E0B',
    },
    {
      label: 'Avg Utilization',
      value: `${stats.averageUtilization}%`,
      icon: BarChart3,
      color: getUtilizationColor(stats.averageUtilization),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <item.icon
                size={18}
                style={{ color: item.color }}
              />
            </div>
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: item.color }}
            >
              {item.value}
            </div>
            <div className="text-xs text-gray-500">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
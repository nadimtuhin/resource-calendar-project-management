import React from 'react';
import { Resource, Project, WorkDayStats } from '../../types';
import { Users, Calendar, AlertCircle, Clock, BarChart3, CalendarDays } from 'lucide-react';
import { getUtilizationColor } from '../../constants/colors';

interface SummaryStatsProps {
  resources: Resource[];
  projects: Project[];
  getWorkDayStats: (resourceId: string) => WorkDayStats;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  resources,
  projects,
  getWorkDayStats,
}) => {
  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate today's work
    const todayProjects = projects.filter(project => 
      project.startDate <= today && project.endDate >= today
    );

    // Calculate high priority projects
    const highPriorityProjects = projects.filter(project => 
      project.priority === 'high'
    );

    // Calculate aggregate work day statistics
    const aggregateStats = resources.reduce((acc, resource) => {
      const stats = getWorkDayStats(resource.id);
      return {
        totalWorkDays: acc.totalWorkDays + stats.totalWorkDays,
        assignedProjectDays: acc.assignedProjectDays + stats.assignedProjectDays,
        leaveDays: acc.leaveDays + stats.leaveDays,
        availableDays: acc.availableDays + stats.availableDays,
      };
    }, {
      totalWorkDays: 0,
      assignedProjectDays: 0,
      leaveDays: 0,
      availableDays: 0,
    });

    // Calculate average utilization
    const averageUtilization = resources.length > 0 && aggregateStats.totalWorkDays > 0
      ? Math.round(((aggregateStats.assignedProjectDays + aggregateStats.leaveDays) / aggregateStats.totalWorkDays) * 100)
      : 0;

    return {
      totalResources: resources.length,
      activeProjects: projects.length,
      highPriorityProjects: highPriorityProjects.length,
      todayWork: todayProjects.length,
      averageUtilization,
      totalWorkDays: aggregateStats.totalWorkDays,
      availableDays: aggregateStats.availableDays,
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
      label: 'Available Days',
      value: stats.availableDays,
      icon: CalendarDays,
      color: '#8B5CF6',
    },
    {
      label: 'Total Work Days',
      value: stats.totalWorkDays,
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Pause, 
  Calendar,
  DollarSign,
  Target,
  Activity
} from 'lucide-react';
import { Project, ProjectStats as ProjectStatsType, ProjectStatus } from '../../types';

interface ProjectStatsProps {
  projects: Project[];
  className?: string;
}

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-50';
    case 'completed': return 'text-blue-600 bg-blue-50';
    case 'planning': return 'text-gray-600 bg-gray-50';
    case 'on-hold': return 'text-yellow-600 bg-yellow-50';
    case 'cancelled': return 'text-red-600 bg-red-50';
    case 'overdue': return 'text-red-700 bg-red-100';
    case 'at-risk': return 'text-orange-600 bg-orange-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status: ProjectStatus) => {
  switch (status) {
    case 'active': return <Activity size={16} />;
    case 'completed': return <CheckCircle size={16} />;
    case 'planning': return <Calendar size={16} />;
    case 'on-hold': return <Pause size={16} />;
    case 'cancelled': return <XCircle size={16} />;
    case 'overdue': return <AlertTriangle size={16} />;
    case 'at-risk': return <AlertTriangle size={16} />;
    default: return <Calendar size={16} />;
  }
};

export const ProjectStats: React.FC<ProjectStatsProps> = ({ projects, className = '' }) => {
  const calculateStats = (): ProjectStatsType => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const overdueProjects = projects.filter(p => p.status === 'overdue').length;
    const atRiskProjects = projects.filter(p => p.status === 'at-risk').length;
    
    const totalProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0);
    const averageProgress = totalProjects > 0 ? totalProgress / totalProjects : 0;
    
    const completedOnTime = projects.filter(p => 
      p.status === 'completed' && 
      p.completedDate && 
      new Date(p.completedDate) <= new Date(p.endDate)
    ).length;
    const onTimeDeliveryRate = completedProjects > 0 ? (completedOnTime / completedProjects) * 100 : 0;
    
    const totalDuration = projects.reduce((sum, p) => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return sum + (isNaN(duration) ? 0 : duration);
    }, 0);
    const averageProjectDuration = totalProjects > 0 ? totalDuration / totalProjects : 0;
    
    const statusDistribution: Record<ProjectStatus, number> = {
      planning: 0,
      active: 0,
      'on-hold': 0,
      completed: 0,
      cancelled: 0,
      overdue: 0,
      'at-risk': 0,
    };
    
    projects.forEach(p => {
      statusDistribution[p.status]++;
    });
    
    return {
      totalProjects,
      activeProjects,
      completedProjects,
      overdueProjects,
      atRiskProjects,
      averageProgress,
      onTimeDeliveryRate,
      averageProjectDuration,
      statusDistribution,
    };
  };

  const stats = calculateStats();

  const getHealthStats = () => {
    const healthScores = projects.filter(p => p.healthScore !== undefined && !isNaN(p.healthScore!)).map(p => p.healthScore!);
    const averageHealth = healthScores.length > 0 ? healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length : 0;
    
    const healthyProjects = healthScores.filter(score => score >= 80).length;
    const warningProjects = healthScores.filter(score => score >= 60 && score < 80).length;
    const criticalProjects = healthScores.filter(score => score < 60).length;
    
    return { averageHealth: isNaN(averageHealth) ? 0 : averageHealth, healthyProjects, warningProjects, criticalProjects };
  };

  const getBudgetStats = () => {
    const budgetProjects = projects.filter(p => p.budget);
    const totalEstimated = budgetProjects.reduce((sum, p) => sum + (p.budget?.estimated || 0), 0);
    const totalActual = budgetProjects.reduce((sum, p) => sum + (p.budget?.actual || 0), 0);
    const budgetVariance = totalEstimated > 0 ? ((totalActual - totalEstimated) / totalEstimated) * 100 : 0;
    
    return { 
      totalEstimated, 
      totalActual, 
      budgetVariance: isNaN(budgetVariance) ? 0 : budgetVariance, 
      budgetProjects: budgetProjects.length 
    };
  };

  const getTimeStats = () => {
    const timeProjects = projects.filter(p => p.estimatedHours && p.actualHours);
    const totalEstimatedHours = timeProjects.reduce((sum, p) => sum + (p.estimatedHours || 0), 0);
    const totalActualHours = timeProjects.reduce((sum, p) => sum + (p.actualHours || 0), 0);
    const timeVariance = totalEstimatedHours > 0 ? ((totalActualHours - totalEstimatedHours) / totalEstimatedHours) * 100 : 0;
    
    return { 
      totalEstimatedHours, 
      totalActualHours, 
      timeVariance: isNaN(timeVariance) ? 0 : timeVariance, 
      timeProjects: timeProjects.length 
    };
  };

  const getDeadlineStats = () => {
    const today = new Date();
    const projectsWithDeadlines = projects.filter(p => p.deadline);
    const overdueProjects = projectsWithDeadlines.filter(p => new Date(p.deadline!) < today).length;
    const dueSoonProjects = projectsWithDeadlines.filter(p => {
      const deadline = new Date(p.deadline!);
      const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDeadline > 0 && daysUntilDeadline <= 7;
    }).length;
    
    return {
      projectsWithDeadlines: projectsWithDeadlines.length,
      overdueProjects,
      dueSoonProjects,
    };
  };

  const getWorkDaysStats = () => {
    const projectsWithWorkDays = projects.filter(p => p.workDaysNeeded);
    const totalWorkDaysNeeded = projectsWithWorkDays.reduce((sum, p) => sum + (p.workDaysNeeded || 0), 0);
    const averageWorkDaysNeeded = projectsWithWorkDays.length > 0 ? totalWorkDaysNeeded / projectsWithWorkDays.length : 0;
    
    return {
      projectsWithWorkDays: projectsWithWorkDays.length,
      totalWorkDaysNeeded,
      averageWorkDaysNeeded: isNaN(averageWorkDaysNeeded) ? 0 : averageWorkDaysNeeded,
    };
  };

  const healthStats = getHealthStats();
  const budgetStats = getBudgetStats();
  const timeStats = getTimeStats();
  const deadlineStats = getDeadlineStats();
  const workDaysStats = getWorkDaysStats();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects || 0}</p>
            </div>
            <Target className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeProjects || 0}</p>
            </div>
            <Activity className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-blue-600">{(stats.averageProgress || 0).toFixed(1)}%</p>
            </div>
            <TrendingUp className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
              <p className="text-2xl font-bold text-purple-600">{(stats.onTimeDeliveryRate || 0).toFixed(1)}%</p>
            </div>
            <Clock className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(stats.statusDistribution).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${getStatusColor(status as ProjectStatus)}`}>
                {getStatusIcon(status as ProjectStatus)}
              </div>
              <p className="text-sm font-medium text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 capitalize">{status?.replace('-', ' ') || 'Unknown'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health, Budget, and Time Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Health</span>
              <span className="text-lg font-bold text-green-600">{(healthStats.averageHealth || 0).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Healthy (80%+)</span>
              <span className="text-sm font-medium text-green-600">{healthStats.healthyProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Warning (60-79%)</span>
              <span className="text-sm font-medium text-yellow-600">{healthStats.warningProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Critical (&lt;60%)</span>
              <span className="text-sm font-medium text-red-600">{healthStats.criticalProjects}</span>
            </div>
          </div>
        </div>

        {/* Budget Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projects with Budget</span>
              <span className="text-lg font-bold text-blue-600">{budgetStats.budgetProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Budget Variance</span>
              <span className={`text-sm font-medium ${(budgetStats.budgetVariance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {(budgetStats.budgetVariance || 0) > 0 ? '+' : ''}{(budgetStats.budgetVariance || 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Estimated</span>
              <span className="text-sm font-medium text-gray-900">${budgetStats.totalEstimated.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Actual</span>
              <span className="text-sm font-medium text-gray-900">${budgetStats.totalActual.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Time Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projects with Hours</span>
              <span className="text-lg font-bold text-purple-600">{timeStats.timeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Time Variance</span>
              <span className={`text-sm font-medium ${(timeStats.timeVariance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {(timeStats.timeVariance || 0) > 0 ? '+' : ''}{(timeStats.timeVariance || 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estimated Hours</span>
              <span className="text-sm font-medium text-gray-900">{timeStats.totalEstimatedHours.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Actual Hours</span>
              <span className="text-sm font-medium text-gray-900">{timeStats.totalActualHours.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.completedProjects}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdueProjects}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.atRiskProjects}</div>
            <div className="text-sm text-gray-600">At Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{(stats.averageProjectDuration || 0).toFixed(0)}</div>
            <div className="text-sm text-gray-600">Avg Duration (days)</div>
          </div>
        </div>
      </div>

      {/* Deadline and Work Days Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadline Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deadline Tracking</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projects with Deadlines</span>
              <span className="text-lg font-bold text-blue-600">{deadlineStats.projectsWithDeadlines}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overdue Projects</span>
              <span className="text-lg font-bold text-red-600">{deadlineStats.overdueProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Due Soon (7 days)</span>
              <span className="text-lg font-bold text-orange-600">{deadlineStats.dueSoonProjects}</span>
            </div>
          </div>
        </div>

        {/* Work Days Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Days Planning</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projects with Work Days</span>
              <span className="text-lg font-bold text-blue-600">{workDaysStats.projectsWithWorkDays}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Work Days Needed</span>
              <span className="text-lg font-bold text-purple-600">{workDaysStats.totalWorkDaysNeeded}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Work Days</span>
              <span className="text-lg font-bold text-green-600">{workDaysStats.averageWorkDaysNeeded.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
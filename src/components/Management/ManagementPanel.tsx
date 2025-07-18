import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Users, Briefcase, Calendar, CalendarCheck } from 'lucide-react';
import { Resource, Project, Holiday, HolidaySettings, Leave } from '../../types';
import { ResourceList } from './ResourceList';
import { ProjectList } from './ProjectList';
import { HolidayList } from './HolidayList';
import { LeaveList } from './LeaveList';

interface ManagementPanelProps {
  resources: Resource[];
  projects: Project[];
  holidaySettings: HolidaySettings;
  leaves: Leave[];
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resourceId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onAddResource: () => void;
  onAddProject: () => void;
  onEditHoliday: (holiday: Holiday) => void;
  onDeleteHoliday: (holidayId: string) => void;
  onAddHoliday: () => void;
  onEditHolidaySettings: () => void;
  onEditLeave: (leave: Leave) => void;
  onDeleteLeave: (leaveId: string) => void;
  onAddLeave: () => void;
}

type ActiveTab = 'resources' | 'projects' | 'holidays' | 'leaves';

const STORAGE_KEY = 'management-panel-state';

interface PanelState {
  isExpanded: boolean;
  activeTab: ActiveTab;
}

export const ManagementPanel: React.FC<ManagementPanelProps> = ({
  resources,
  projects,
  holidaySettings,
  leaves,
  onEditResource,
  onDeleteResource,
  onEditProject,
  onDeleteProject,
  onAddResource,
  onAddProject,
  onEditHoliday,
  onDeleteHoliday,
  onAddHoliday,
  onEditHolidaySettings,
  onEditLeave,
  onDeleteLeave,
  onAddLeave,
}) => {
  const [panelState, setPanelState] = useState<PanelState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { isExpanded: false, activeTab: 'resources' };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(panelState));
  }, [panelState]);

  const toggleExpanded = () => {
    setPanelState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
  };

  const setActiveTab = (tab: ActiveTab) => {
    setPanelState(prev => ({ ...prev, activeTab: tab }));
  };

  const { isExpanded, activeTab } = panelState;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          <button
            onClick={toggleExpanded}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            <span className="font-medium hidden sm:inline">Management Panel</span>
            <span className="font-medium sm:hidden">Manage</span>
          </button>
          
          {isExpanded && (
            <div className="flex space-x-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'resources'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users size={16} />
                <span className="hidden sm:inline">Resources ({resources.length})</span>
                <span className="sm:hidden">({resources.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Briefcase size={16} />
                <span className="hidden sm:inline">Projects ({projects.length})</span>
                <span className="sm:hidden">({projects.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('holidays')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'holidays'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Calendar size={16} />
                <span className="hidden sm:inline">Holidays ({holidaySettings.holidays.length})</span>
                <span className="sm:hidden">({holidaySettings.holidays.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('leaves')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'leaves'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <CalendarCheck size={16} />
                <span className="hidden sm:inline">Leaves ({leaves.length})</span>
                <span className="sm:hidden">({leaves.length})</span>
              </button>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <button
            onClick={
              activeTab === 'resources' ? onAddResource : 
              activeTab === 'projects' ? onAddProject : 
              activeTab === 'leaves' ? onAddLeave : 
              onAddHoliday
            }
            className="px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <span className="hidden sm:inline">
              Add {
                activeTab === 'resources' ? 'Resource' : 
                activeTab === 'projects' ? 'Project' : 
                activeTab === 'leaves' ? 'Leave' : 
                'Holiday'
              }
            </span>
            <span className="sm:hidden">+</span>
          </button>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="h-80 sm:h-96 overflow-hidden">
          {activeTab === 'resources' ? (
            <ResourceList
              resources={resources}
              projects={projects}
              onEditResource={onEditResource}
              onDeleteResource={onDeleteResource}
            />
          ) : activeTab === 'projects' ? (
            <ProjectList
              projects={projects}
              resources={resources}
              onEditProject={onEditProject}
              onDeleteProject={onDeleteProject}
            />
          ) : activeTab === 'leaves' ? (
            <LeaveList
              leaves={leaves}
              resources={resources}
              onEditLeave={onEditLeave}
              onDeleteLeave={onDeleteLeave}
              onAddLeave={onAddLeave}
            />
          ) : (
            <HolidayList
              holidaySettings={holidaySettings}
              onEditHoliday={onEditHoliday}
              onDeleteHoliday={onDeleteHoliday}
              onAddHoliday={onAddHoliday}
              onEditSettings={onEditHolidaySettings}
            />
          )}
        </div>
      )}
    </div>
  );
};
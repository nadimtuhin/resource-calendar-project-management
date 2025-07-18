import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Briefcase, 
  Calendar, 
  CalendarCheck, 
  Search,
  Filter,
  Plus,
  Settings,
  BarChart3,
  CheckSquare,
  Square,
  Trash2,
  Edit2,
  Download,
  Upload
} from 'lucide-react';
import { Resource, Project, Holiday, HolidaySettings, Leave } from '../../types';
import { ResourceList } from './ResourceList';
import { ProjectList } from './ProjectList';
import { HolidayList } from './HolidayList';
import { LeaveList } from './LeaveList';
import { ProjectStats } from '../Analytics/ProjectStats';
import { MODAL_LEVELS } from '../../constants/zIndex';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
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

type ActiveTab = 'overview' | 'resources' | 'projects' | 'leaves' | 'holidays';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'resources', label: 'Resources', icon: Users },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'leaves', label: 'Leaves', icon: CalendarCheck },
  { id: 'holidays', label: 'Holidays', icon: Calendar },
];

export const ManagementModal: React.FC<ManagementModalProps> = ({
  isOpen,
  onClose,
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
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setActiveTab('overview');
    setSearchTerm('');
    setSelectedItems([]);
    setBulkMode(false);
    onClose();
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${selectedItems.length} item(s)?`;
    if (confirm(confirmMessage)) {
      selectedItems.forEach(id => {
        if (activeTab === 'resources') {
          onDeleteResource(id);
        } else if (activeTab === 'projects') {
          onDeleteProject(id);
        } else if (activeTab === 'leaves') {
          onDeleteLeave(id);
        } else if (activeTab === 'holidays') {
          onDeleteHoliday(id);
        }
      });
      setSelectedItems([]);
      setBulkMode(false);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAllItems = () => {
    const allItems = getCurrentTabItems();
    setSelectedItems(allItems.map(item => item.id));
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const getCurrentTabItems = () => {
    switch (activeTab) {
      case 'resources': return resources;
      case 'projects': return projects;
      case 'leaves': return leaves;
      case 'holidays': return holidaySettings.holidays;
      default: return [];
    }
  };

  const getTabCount = (tabId: ActiveTab) => {
    switch (tabId) {
      case 'resources': return resources.length;
      case 'projects': return projects.length;
      case 'leaves': return leaves.length;
      case 'holidays': return holidaySettings.holidays.length;
      default: return 0;
    }
  };

  const getQuickStats = () => {
    const totalResources = resources.length;
    const activeProjects = projects.length;
    const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
    const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
    const upcomingHolidays = holidaySettings.holidays.filter(h => {
      const holidayDate = new Date(h.date);
      const today = new Date();
      return holidayDate > today;
    }).length;

    return {
      totalResources,
      activeProjects,
      pendingLeaves,
      approvedLeaves,
      upcomingHolidays,
    };
  };

  const stats = getQuickStats();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: MODAL_LEVELS.MANAGEMENT }}
    >
      <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] m-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">Management Center</h2>
            {bulkMode && selectedItems.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{selectedItems.length} item(s) selected</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Bulk Actions */}
            {activeTab !== 'overview' && (
              <button
                onClick={() => setBulkMode(!bulkMode)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  bulkMode 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <CheckSquare size={16} />
                <span>Bulk</span>
              </button>
            )}
            
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = getTabCount(tab.id as ActiveTab);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.id !== 'overview' && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Actions */}
          <div className="flex items-center space-x-2">
            {activeTab !== 'overview' && (
              <>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                  />
                </div>

                {/* Bulk Actions */}
                {bulkMode && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={selectAllItems}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <CheckSquare size={16} />
                      <span>All</span>
                    </button>
                    <button
                      onClick={deselectAllItems}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Square size={16} />
                      <span>None</span>
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      disabled={selectedItems.length === 0}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                {/* Add Button */}
                <button
                  onClick={
                    activeTab === 'resources' ? onAddResource :
                    activeTab === 'projects' ? onAddProject :
                    activeTab === 'leaves' ? onAddLeave :
                    onAddHoliday
                  }
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Add {activeTab.slice(0, -1)}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'overview' ? (
            <div className="p-6 h-full overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Quick Stats Cards */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Resources</p>
                      <p className="text-3xl font-bold text-blue-900">{stats.totalResources}</p>
                    </div>
                    <Users className="text-blue-600" size={32} />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Active Projects</p>
                      <p className="text-3xl font-bold text-green-900">{stats.activeProjects}</p>
                    </div>
                    <Briefcase className="text-green-600" size={32} />
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Pending Leaves</p>
                      <p className="text-3xl font-bold text-yellow-900">{stats.pendingLeaves}</p>
                    </div>
                    <CalendarCheck className="text-yellow-600" size={32} />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Approved Leaves</p>
                      <p className="text-3xl font-bold text-purple-900">{stats.approvedLeaves}</p>
                    </div>
                    <CalendarCheck className="text-purple-600" size={32} />
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Upcoming Holidays</p>
                      <p className="text-3xl font-bold text-red-900">{stats.upcomingHolidays}</p>
                    </div>
                    <Calendar className="text-red-600" size={32} />
                  </div>
                </div>
              </div>

              {/* Project Analytics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Analytics</h3>
                <ProjectStats projects={projects} />
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => { setActiveTab('resources'); onAddResource(); }}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Users className="text-blue-600" size={20} />
                    <span className="font-medium">Add Resource</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('projects'); onAddProject(); }}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Briefcase className="text-green-600" size={20} />
                    <span className="font-medium">Add Project</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('leaves'); onAddLeave(); }}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <CalendarCheck className="text-yellow-600" size={20} />
                    <span className="font-medium">Add Leave</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('holidays'); onAddHoliday(); }}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="text-red-600" size={20} />
                    <span className="font-medium">Add Holiday</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full">
              {activeTab === 'resources' && (
                <ResourceList
                  resources={resources}
                  projects={projects}
                  onEditResource={onEditResource}
                  onDeleteResource={onDeleteResource}
                />
              )}
              {activeTab === 'projects' && (
                <ProjectList
                  projects={projects}
                  resources={resources}
                  onEditProject={onEditProject}
                  onDeleteProject={onDeleteProject}
                />
              )}
              {activeTab === 'leaves' && (
                <LeaveList
                  leaves={leaves}
                  resources={resources}
                  onEditLeave={onEditLeave}
                  onDeleteLeave={onDeleteLeave}
                  onAddLeave={onAddLeave}
                />
              )}
              {activeTab === 'holidays' && (
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
      </div>
    </div>
  );
};
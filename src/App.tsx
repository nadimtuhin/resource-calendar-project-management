import React, { useState } from 'react';
import { useResourceCalendar } from './hooks/useResourceCalendar';
import { Header } from './components/Layout/Header';
import { Timeline } from './components/Calendar/Timeline';
import { SummaryStats } from './components/Analytics/SummaryStats';
import { UtilizationCard } from './components/Analytics/UtilizationCard';
import { ResourceModal } from './components/Modals/ResourceModal';
import { ProjectModal } from './components/Modals/ProjectModal';
import { OverflowModal } from './components/Modals/OverflowModal';
import { HolidayModal } from './components/Modals/HolidayModal';
import { WeekendSettingsModal } from './components/Modals/WeekendSettingsModal';
import { ShareModal } from './components/Modals/ShareModal';
import { ImportStateModal } from './components/Modals/ImportStateModal';
import { LeaveModal } from './components/Modals/LeaveModal';
import { ManagementModal } from './components/Management/ManagementModal';
import { Resource, Project, Holiday, HolidaySettings, Leave } from './types';
import { getShareParameterFromUrl, removeShareParameterFromUrl, decodeStateFromUrl } from './utils/shareUtils';

function App() {
  const {
    resources,
    projects,
    leaves,
    loading,
    holidaySettings,
    dateRange,
    addResource,
    updateResource,
    deleteResource,
    addProject,
    updateProject,
    deleteProject,
    removeProjectFromDays,
    clearDayWork,
    loadTestData,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    updateWeekendDays,
    updateWorkingHours,
    isHoliday,
    isWeekend,
    updateDateRange,
    addLeave,
    updateLeave,
    deleteLeave,
    isLeaveDay,
    getWorkDayStats,
  } = useResourceCalendar();

  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [overflowModalOpen, setOverflowModalOpen] = useState(false);
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);
  const [weekendSettingsModalOpen, setWeekendSettingsModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [managementModalOpen, setManagementModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>();
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [editingHoliday, setEditingHoliday] = useState<Holiday | undefined>();
  const [editingLeave, setEditingLeave] = useState<Leave | undefined>();
  const [overflowProjects, setOverflowProjects] = useState<Project[]>([]);
  const [overflowDate, setOverflowDate] = useState<Date>(new Date());

  const handleAddResource = () => {
    setEditingResource(undefined);
    setResourceModalOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setResourceModalOpen(true);
  };

  const handleAddProject = () => {
    setEditingProject(undefined);
    setProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  const handleShowOverflow = (projects: Project[], date: Date) => {
    setOverflowProjects(projects);
    setOverflowDate(date);
    setOverflowModalOpen(true);
  };

  const handleDeleteResource = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && confirm(`Are you sure you want to delete ${resource.name}? This will also remove all their projects.`)) {
      deleteResource(resourceId);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project && confirm(`Are you sure you want to delete "${project.title}"?`)) {
      deleteProject(projectId);
    }
  };

  const handleAddHoliday = () => {
    setEditingHoliday(undefined);
    setHolidayModalOpen(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setHolidayModalOpen(true);
  };

  const handleDeleteHoliday = (holidayId: string) => {
    const holiday = holidaySettings.holidays.find(h => h.id === holidayId);
    if (holiday && confirm(`Are you sure you want to delete "${holiday.name}"?`)) {
      deleteHoliday(holidayId);
    }
  };

  const handleEditHolidaySettings = () => {
    setWeekendSettingsModalOpen(true);
  };

  const handleUpdateHolidaySettings = (settings: Partial<HolidaySettings>) => {
    if (settings.weekendDays) {
      updateWeekendDays(settings.weekendDays);
    }
    if (settings.workingHours) {
      updateWorkingHours(settings.workingHours);
    }
  };

  const handleAddLeave = () => {
    setEditingLeave(undefined);
    setLeaveModalOpen(true);
  };

  const handleEditLeave = (leave: Leave) => {
    setEditingLeave(leave);
    setLeaveModalOpen(true);
  };

  const handleDeleteLeave = (leaveId: string) => {
    const leave = leaves.find(l => l.id === leaveId);
    if (leave && confirm(`Are you sure you want to delete this leave request?`)) {
      deleteLeave(leaveId);
    }
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleImport = () => {
    setImportModalOpen(true);
  };

  const handleOpenManagement = () => {
    setManagementModalOpen(true);
  };

  const handleImportState = React.useCallback((newResources: Resource[], newProjects: Project[], newHolidaySettings: HolidaySettings) => {
    // Clear existing data and import new data
    resources.forEach(resource => deleteResource(resource.id));
    projects.forEach(project => deleteProject(project.id));
    
    // Add new resources
    newResources.forEach(resource => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...resourceData } = resource;
      addResource(resourceData);
    });
    
    // Add new projects
    newProjects.forEach(project => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...projectData } = project;
      addProject(projectData);
    });
    
    // Update holiday settings
    updateWeekendDays(newHolidaySettings.weekendDays);
    updateWorkingHours(newHolidaySettings.workingHours);
    newHolidaySettings.holidays.forEach(holiday => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...holidayData } = holiday;
      addHoliday(holidayData);
    });
  }, [resources, projects, deleteResource, deleteProject, addResource, addProject, updateWeekendDays, updateWorkingHours, addHoliday]);

  // Check for shared state in URL on app load
  React.useEffect(() => {
    const shareParam = getShareParameterFromUrl();
    if (shareParam && !loading) {
      try {
        const sharedState = decodeStateFromUrl(shareParam);
        const shouldImport = window.confirm(
          `Import shared calendar data?\n\nThis will import:\n• ${sharedState.resources.length} resources\n• ${sharedState.projects.length} projects\n• ${sharedState.holidaySettings.holidays.length} holidays\n\nYour current data will be replaced.`
        );
        
        if (shouldImport) {
          handleImportState(sharedState.resources, sharedState.projects, sharedState.holidaySettings);
        }
        
        // Clean up URL
        removeShareParameterFromUrl();
      } catch (error) {
        console.error('Error importing shared state:', error);
        alert('Failed to import shared calendar data. The URL may be corrupted.');
        removeShareParameterFromUrl();
      }
    }
  }, [loading, handleImportState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Resource Calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddResource={handleAddResource}
        onAddProject={handleAddProject}
        onLoadTestData={loadTestData}
        onShare={handleShare}
        onImport={handleImport}
        dateRange={dateRange}
        onDateRangeChange={updateDateRange}
        onOpenManagement={handleOpenManagement}
      />

      <main className="p-6 space-y-6">
        {/* Summary Statistics */}
        <SummaryStats 
          resources={resources} 
          projects={projects} 
          getWorkDayStats={getWorkDayStats}
        />

        {/* Resource Utilization Cards */}
        {resources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <UtilizationCard
                key={resource.id}
                resource={resource}
                projects={projects}
                onEditResource={handleEditResource}
                onDeleteResource={handleDeleteResource}
              />
            ))}
          </div>
        )}

        {/* Timeline */}
        <Timeline
          resources={resources}
          projects={projects}
          dateRange={dateRange}
          onEditResource={handleEditResource}
          onDeleteResource={handleDeleteResource}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onClearDay={clearDayWork}
          onShowOverflow={handleShowOverflow}
          isHoliday={isHoliday}
          isWeekend={isWeekend}
          isLeaveDay={isLeaveDay}
        />

        {/* Empty State */}
        {resources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Welcome to Resource Calendar! Get started by adding your first team member.
            </p>
            <button
              onClick={handleAddResource}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Resource
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <ResourceModal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        onSave={addResource}
        onUpdate={updateResource}
        resource={editingResource}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={addProject}
        onUpdate={updateProject}
        onDelete={deleteProject}
        onRemoveWork={removeProjectFromDays}
        project={editingProject}
        resources={resources}
      />

      <OverflowModal
        isOpen={overflowModalOpen}
        onClose={() => setOverflowModalOpen(false)}
        projects={overflowProjects}
        date={overflowDate}
        resources={resources}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onClearDay={clearDayWork}
      />

      {/* Management Modal */}
      <ManagementModal
        isOpen={managementModalOpen}
        onClose={() => setManagementModalOpen(false)}
        resources={resources}
        projects={projects}
        holidaySettings={holidaySettings}
        leaves={leaves}
        onEditResource={handleEditResource}
        onDeleteResource={handleDeleteResource}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onAddResource={handleAddResource}
        onAddProject={handleAddProject}
        onEditHoliday={handleEditHoliday}
        onDeleteHoliday={handleDeleteHoliday}
        onAddHoliday={handleAddHoliday}
        onEditHolidaySettings={handleEditHolidaySettings}
        onEditLeave={handleEditLeave}
        onDeleteLeave={handleDeleteLeave}
        onAddLeave={handleAddLeave}
      />

      {/* Holiday Modal */}
      <HolidayModal
        isOpen={holidayModalOpen}
        onClose={() => setHolidayModalOpen(false)}
        onSave={addHoliday}
        onUpdate={updateHoliday}
        holiday={editingHoliday}
      />

      {/* Weekend Settings Modal */}
      <WeekendSettingsModal
        isOpen={weekendSettingsModalOpen}
        onClose={() => setWeekendSettingsModalOpen(false)}
        onSave={handleUpdateHolidaySettings}
        currentSettings={holidaySettings}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        resources={resources}
        projects={projects}
        holidaySettings={holidaySettings}
      />

      {/* Import State Modal */}
      <ImportStateModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportState}
        currentResources={resources}
        currentProjects={projects}
        currentHolidaySettings={holidaySettings}
      />

      {/* Leave Modal */}
      <LeaveModal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onSave={addLeave}
        onUpdate={updateLeave}
        onDelete={deleteLeave}
        leave={editingLeave}
        resources={resources}
      />
    </div>
  );
}

export default App;
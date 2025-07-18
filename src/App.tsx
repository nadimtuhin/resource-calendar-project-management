import React, { useState } from 'react';
import { useResourceCalendar } from './hooks/useResourceCalendar';
import { Header } from './components/Layout/Header';
import { Timeline } from './components/Calendar/Timeline';
import { SummaryStats } from './components/Analytics/SummaryStats';
import { UtilizationCard } from './components/Analytics/UtilizationCard';
import { ResourceModal } from './components/Modals/ResourceModal';
import { ProjectModal } from './components/Modals/ProjectModal';
import { OverflowModal } from './components/Modals/OverflowModal';
import { Resource, Project } from './types';

function App() {
  const {
    resources,
    projects,
    loading,
    addResource,
    updateResource,
    deleteResource,
    addProject,
    updateProject,
    deleteProject,
    removeProjectFromDays,
    clearDayWork,
    loadTestData,
  } = useResourceCalendar();

  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [overflowModalOpen, setOverflowModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>();
  const [editingProject, setEditingProject] = useState<Project | undefined>();
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
      />

      <main className="p-6 space-y-6">
        {/* Summary Statistics */}
        <SummaryStats resources={resources} projects={projects} />

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
          onEditResource={handleEditResource}
          onDeleteResource={handleDeleteResource}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onClearDay={clearDayWork}
          onShowOverflow={handleShowOverflow}
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
    </div>
  );
}

export default App;
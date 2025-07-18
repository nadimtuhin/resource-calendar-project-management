import React from 'react';
import { Resource, Project } from '../../types';
import { TimelineHeader } from './TimelineHeader';
import { ResourceRow } from './ResourceRow';
import { getDateRange } from '../../utils/dateUtils';

interface TimelineProps {
  resources: Resource[];
  projects: Project[];
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resourceId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onClearDay: (resourceId: string, date: string) => void;
  onShowOverflow: (projects: Project[], date: Date) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  resources,
  projects,
  onEditResource,
  onDeleteResource,
  onEditProject,
  onDeleteProject,
  onClearDay,
  onShowOverflow,
}) => {
  const dates = getDateRange(3); // 3 months

  if (resources.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No resources added yet. Add your first team member to get started.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${32 * dates.length + 128}px` }}>
          <TimelineHeader dates={dates} />
          <div className="divide-y divide-gray-200">
            {resources.map((resource) => (
              <ResourceRow
                key={resource.id}
                resource={resource}
                dates={dates}
                projects={projects}
                onEditResource={onEditResource}
                onDeleteResource={onDeleteResource}
                onEditProject={onEditProject}
                onDeleteProject={onDeleteProject}
                onClearDay={onClearDay}
                onShowOverflow={onShowOverflow}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
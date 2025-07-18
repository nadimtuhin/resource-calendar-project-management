import React from 'react';
import { Calendar, Users, Plus, Upload } from 'lucide-react';

interface HeaderProps {
  onAddResource: () => void;
  onAddProject: () => void;
  onLoadTestData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAddResource,
  onAddProject,
  onLoadTestData,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar size={28} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Resource Calendar
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            Advanced Project Management Tool
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadTestData}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Upload size={16} />
            <span>Load Test Data</span>
          </button>
          
          <button
            onClick={onAddResource}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
          >
            <Users size={16} />
            <span>Add Resource</span>
          </button>
          
          <button
            onClick={onAddProject}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add Project</span>
          </button>
        </div>
      </div>
    </header>
  );
};
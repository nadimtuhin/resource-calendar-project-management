import React from 'react';
import { Users, Plus, Database, FileText } from 'lucide-react';

interface EmptyStatePromptProps {
  onAddResource: () => void;
  onLoadTestData: () => void;
}

export const EmptyStatePrompt: React.FC<EmptyStatePromptProps> = ({
  onAddResource,
  onLoadTestData,
}) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome to Resource Calendar
          </h2>
          <p className="text-gray-600 mb-8">
            Manage your team's projects, track progress, and optimize resource allocation with our comprehensive calendar system.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center justify-center">
              <Plus className="w-5 h-5 mr-2" />
              Start Fresh
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Create your own team members and projects from scratch.
            </p>
            <button
              onClick={onAddResource}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Resource
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-medium text-green-900 mb-2 flex items-center justify-center">
              <Database className="w-5 h-5 mr-2" />
              Try with Sample Data
            </h3>
            <p className="text-sm text-green-700 mb-4">
              Load sample Bengali team members and Pathao projects to explore all features.
            </p>
            <button
              onClick={onLoadTestData}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Load Sample Data
            </button>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              <span>Project Tracking</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>Team Management</span>
            </div>
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-1" />
              <span>Data Export</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
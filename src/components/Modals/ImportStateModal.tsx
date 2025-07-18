import React, { useState } from 'react';
import { X, Upload, AlertTriangle, CheckCircle, Users, Briefcase, Calendar } from 'lucide-react';
import { Resource, Project, HolidaySettings } from '../../types';
import { decodeStateFromUrl, ShareableState } from '../../utils/shareUtils';
import { MODAL_LEVELS } from '../../constants/zIndex';

interface ImportStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (resources: Resource[], projects: Project[], holidaySettings: HolidaySettings) => void;
  currentResources: Resource[];
  currentProjects: Project[];
  currentHolidaySettings: HolidaySettings;
}

export const ImportStateModal: React.FC<ImportStateModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentResources,
  currentProjects,
  currentHolidaySettings,
}) => {
  const [importUrl, setImportUrl] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [previewState, setPreviewState] = useState<ShareableState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlChange = (url: string) => {
    setImportUrl(url);
    setError(null);
    setPreviewState(null);

    if (!url.trim()) return;

    try {
      // Extract share parameter from URL
      let shareParam = '';
      if (url.includes('?share=')) {
        shareParam = url.split('?share=')[1].split('&')[0];
      } else if (url.includes('&share=')) {
        shareParam = url.split('&share=')[1].split('&')[0];
      } else {
        // Assume the entire string is the base64 data
        shareParam = url;
      }

      const decodedState = decodeStateFromUrl(shareParam);
      setPreviewState(decodedState);
    } catch {
      setError('Invalid URL or corrupted data. Please check the URL and try again.');
    }
  };

  const handleImport = async () => {
    if (!previewState) return;

    setIsLoading(true);
    try {
      if (importMode === 'replace') {
        // Replace all data
        onImport(previewState.resources, previewState.projects, previewState.holidaySettings);
      } else {
        // Merge with existing data
        const mergedResources = [...currentResources];
        const mergedProjects = [...currentProjects];
        
        // Add new resources (avoid duplicates by name)
        previewState.resources.forEach(newResource => {
          if (!mergedResources.find(r => r.name === newResource.name)) {
            mergedResources.push({
              ...newResource,
              id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            });
          }
        });

        // Add new projects (avoid duplicates by title)
        previewState.projects.forEach(newProject => {
          if (!mergedProjects.find(p => p.title === newProject.title)) {
            mergedProjects.push({
              ...newProject,
              id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            });
          }
        });

        // Merge holiday settings (combine holidays, keep current weekend/working hours)
        const mergedHolidaySettings: HolidaySettings = {
          ...currentHolidaySettings,
          holidays: [
            ...currentHolidaySettings.holidays,
            ...previewState.holidaySettings.holidays.filter(newHoliday => 
              !currentHolidaySettings.holidays.find(h => h.name === newHoliday.name)
            ).map(holiday => ({
              ...holiday,
              id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            }))
          ],
        };

        onImport(mergedResources, mergedProjects, mergedHolidaySettings);
      }

      handleClose();
    } catch {
      setError('Failed to import data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImportUrl('');
    setPreviewState(null);
    setError(null);
    setImportMode('replace');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: MODAL_LEVELS.IMPORT }}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Upload className="mr-2" size={24} />
            Import Resource Calendar
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste shared URL or base64 data
            </label>
            <textarea
              value={importUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com?share=eyJyZXNvdXJjZXMiOi... or just the base64 data"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertTriangle className="text-red-600 mr-2" size={16} />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {previewState && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="text-green-600 mr-2" size={16} />
                <h3 className="font-medium text-green-900">Preview Import Data</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-blue-600" />
                  <span className="text-sm">
                    {previewState.resources.length} Resources
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase size={16} className="text-purple-600" />
                  <span className="text-sm">
                    {previewState.projects.length} Projects
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-orange-600" />
                  <span className="text-sm">
                    {previewState.holidaySettings.holidays.length} Holidays
                  </span>
                </div>
              </div>

              <div className="text-xs text-green-700">
                <p>Exported: {new Date(previewState.exportedAt).toLocaleString()}</p>
                <p>Version: {previewState.version}</p>
              </div>
            </div>
          )}

          {/* Import Mode Selection */}
          {previewState && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Import Mode</h3>
              <div className="space-y-2">
                <label className="flex items-start space-x-3">
                  <input
                    type="radio"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={(e) => setImportMode(e.target.value as 'replace' | 'merge')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-sm">Replace all data</div>
                    <div className="text-xs text-gray-500">
                      Remove existing resources, projects, and holidays, then import new data
                    </div>
                  </div>
                </label>
                <label className="flex items-start space-x-3">
                  <input
                    type="radio"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={(e) => setImportMode(e.target.value as 'replace' | 'merge')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-sm">Merge with existing data</div>
                    <div className="text-xs text-gray-500">
                      Keep existing data and add new items (duplicates will be skipped)
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Current Data Summary */}
          {previewState && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Current Data</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>Resources: {currentResources.length}</div>
                <div>Projects: {currentProjects.length}</div>
                <div>Holidays: {currentHolidaySettings.holidays.length}</div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Paste the shared URL or base64 data in the text area above</li>
              <li>• Review the preview to see what will be imported</li>
              <li>• Choose whether to replace all data or merge with existing data</li>
              <li>• Click Import to apply the changes</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!previewState || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Import</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
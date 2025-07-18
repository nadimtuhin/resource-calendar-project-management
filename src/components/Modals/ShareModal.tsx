import React, { useState, useEffect, useCallback } from 'react';
import { X, Copy, Share2, Check, Download, Settings } from 'lucide-react';
import { Resource, Project, HolidaySettings } from '../../types';
import { generateShareUrl, calculateUrlLength, ShareUrlOptions } from '../../utils/shareUtils';
import { MODAL_LEVELS } from '../../constants/zIndex';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  projects: Project[];
  holidaySettings: HolidaySettings;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  resources,
  projects,
  holidaySettings,
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [shareOptions, setShareOptions] = useState<ShareUrlOptions>({
    includeResources: true,
    includeProjects: true,
    includeHolidays: true,
  });

  const generateUrl = useCallback(() => {
    try {
      const url = generateShareUrl(resources, projects, holidaySettings, shareOptions);
      setShareUrl(url);
    } catch (error) {
      console.error('Error generating share URL:', error);
      setShareUrl('Error generating URL');
    }
  }, [resources, projects, holidaySettings, shareOptions]);

  useEffect(() => {
    if (isOpen) {
      generateUrl();
    }
  }, [isOpen, generateUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsFile = () => {
    const dataStr = shareUrl;
    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `resource-calendar-share-${new Date().toISOString().split('T')[0]}.txt`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleClose = () => {
    setCopied(false);
    setShowOptions(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const urlLength = calculateUrlLength(resources, projects, holidaySettings);
  const isLongUrl = urlLength > 2000; // URLs over 2000 chars might have issues

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: MODAL_LEVELS.SHARE }}
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
            <Share2 className="mr-2" size={24} />
            Share Resource Calendar
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Share Options */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Share Options</h3>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Settings size={16} className="mr-1" />
                {showOptions ? 'Hide' : 'Customize'}
              </button>
            </div>

            {showOptions && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={shareOptions.includeResources}
                    onChange={(e) => setShareOptions(prev => ({ ...prev, includeResources: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Resources ({resources.length})</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={shareOptions.includeProjects}
                    onChange={(e) => setShareOptions(prev => ({ ...prev, includeProjects: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Projects ({projects.length})</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={shareOptions.includeHolidays}
                    onChange={(e) => setShareOptions(prev => ({ ...prev, includeHolidays: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Holidays ({holidaySettings.holidays.length})</span>
                </label>
              </div>
            )}
          </div>

          {/* URL Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shareable URL
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* URL Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>URL Length: {urlLength.toLocaleString()} characters</span>
              <span>Exported: {new Date().toLocaleString()}</span>
            </div>
            {isLongUrl && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This URL is quite long ({urlLength.toLocaleString()} chars). 
                  Some messaging platforms may truncate it. Consider using the download option instead.
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Share the URL with others to give them access to your calendar data</li>
              <li>• Recipients can import the data by opening the URL</li>
              <li>• Data is embedded in the URL - no server storage required</li>
              <li>• URLs are safe to share publicly (no private data transmission)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <button
              onClick={downloadAsFile}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Download size={16} />
              <span>Download as File</span>
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
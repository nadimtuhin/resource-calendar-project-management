import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Users, Plus, Upload, Share2, Download, CalendarDays, Settings, ChevronDown, MoreHorizontal, BarChart3, RotateCcw } from 'lucide-react';
import { DateRangeSelector } from '../DatePicker/DateRangeSelector';

interface HeaderProps {
  onAddResource: () => void;
  onAddProject: () => void;
  onLoadTestData: () => void;
  onResetData: () => void;
  onShare: () => void;
  onImport: () => void;
  dateRange: { startDate: Date; endDate: Date };
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onOpenManagement: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAddResource,
  onAddProject,
  onLoadTestData,
  onResetData,
  onShare,
  onImport,
  dateRange,
  onDateRangeChange,
  onOpenManagement,
}) => {
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showManagementDropdown, setShowManagementDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatDateRange = (start: Date, end: Date) => {
    const startMonth = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${startMonth} - ${endMonth}`;
  };

  const handleManagementAction = (action: () => void) => {
    action();
    setShowManagementDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowManagementDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
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

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Date Range Selector */}
            <button
              onClick={() => setShowDateRangePicker(true)}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <CalendarDays size={16} />
              <span className="hidden sm:inline">{formatDateRange(dateRange.startDate, dateRange.endDate)}</span>
              <span className="sm:hidden">Range</span>
            </button>

            {/* Management Actions Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowManagementDropdown(!showManagementDropdown)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <MoreHorizontal size={16} />
                <span className="hidden sm:inline">Actions</span>
                <ChevronDown size={14} className={`transition-transform ${showManagementDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showManagementDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleManagementAction(onLoadTestData)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Upload size={16} />
                      <span>Load Test Data</span>
                    </button>
                    <button
                      onClick={() => handleManagementAction(onImport)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Download size={16} />
                      <span>Import Data</span>
                    </button>
                    <button
                      onClick={() => handleManagementAction(onShare)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Share2 size={16} />
                      <span>Share Calendar</span>
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => handleManagementAction(onResetData)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <RotateCcw size={16} />
                      <span>Reset All Data</span>
                    </button>
                    <button
                      onClick={() => handleManagementAction(onOpenManagement)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Management Center */}
            <button
              onClick={onOpenManagement}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-indigo-600 hover:text-indigo-800 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors"
            >
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Management Center</span>
              <span className="sm:hidden">Manage</span>
            </button>

            {/* Primary Actions */}
            <button
              onClick={onAddResource}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Users size={16} />
              <span className="hidden sm:inline">Add Resource</span>
            </button>
            
            <button
              onClick={onAddProject}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Project</span>
            </button>
          </div>
      </div>
    </header>
    
    {/* Date Range Picker Modal */}
    <DateRangeSelector
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      onDateRangeChange={onDateRangeChange}
      isOpen={showDateRangePicker}
      onClose={() => setShowDateRangePicker(false)}
    />
  </>
  );
};
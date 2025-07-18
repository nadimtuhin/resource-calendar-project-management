import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { MODAL_LEVELS } from '../../constants/zIndex';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
  isOpen,
  onClose,
}) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Generate months to display (current year and next year)
  const generateMonths = () => {
    const months = [];
    const startYear = currentYear - 1;
    const endYear = currentYear + 2;
    
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        months.push(new Date(year, month, 1));
      }
    }
    return months;
  };

  const months = generateMonths();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const isMonthSelected = (monthDate: Date) => {
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    
    if (isSelectingStart) {
      return tempStartDate.getMonth() === month && tempStartDate.getFullYear() === year;
    } else {
      return tempEndDate.getMonth() === month && tempEndDate.getFullYear() === year;
    }
  };

  const isMonthInRange = (monthDate: Date) => {
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    const checkDate = new Date(year, month, 1);
    
    const startCheck = new Date(tempStartDate.getFullYear(), tempStartDate.getMonth(), 1);
    const endCheck = new Date(tempEndDate.getFullYear(), tempEndDate.getMonth(), 1);
    
    return checkDate >= startCheck && checkDate <= endCheck;
  };

  const isCurrentMonth = (monthDate: Date) => {
    return monthDate.getMonth() === currentMonth && monthDate.getFullYear() === currentYear;
  };

  const handleMonthClick = (monthDate: Date) => {
    if (isSelectingStart) {
      setTempStartDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1));
      setIsSelectingStart(false);
    } else {
      const newEndDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0); // Last day of month
      setTempEndDate(newEndDate);
      setIsSelectingStart(true);
    }
  };

  const handleApply = () => {
    if (tempStartDate <= tempEndDate) {
      onDateRangeChange(tempStartDate, tempEndDate);
      onClose();
    }
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsSelectingStart(true);
    onClose();
  };

  const applyPreset = (preset: string) => {
    const today = new Date();
    let newStart: Date;
    let newEnd: Date;

    switch (preset) {
      case 'last3months':
        newStart = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        newEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'current':
        newStart = new Date(today.getFullYear(), today.getMonth(), 1);
        newEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'next3months':
        newStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        newEnd = new Date(today.getFullYear(), today.getMonth() + 4, 0);
        break;
      case 'next6months':
        newStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        newEnd = new Date(today.getFullYear(), today.getMonth() + 7, 0);
        break;
      default:
        // Default: last month + current + next 3 months
        newStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        newEnd = new Date(today.getFullYear(), today.getMonth() + 4, 0);
    }

    setTempStartDate(newStart);
    setTempEndDate(newEnd);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: MODAL_LEVELS.DATE_RANGE }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="mr-2" size={24} />
            Select Date Range
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Presets */}
          <div className="lg:col-span-1">
            <h3 className="font-medium text-gray-900 mb-3">Quick Presets</h3>
            <div className="space-y-2">
              {[
                { key: 'default', label: 'Default (Last + Next 3 months)' },
                { key: 'last3months', label: 'Last 3 months' },
                { key: 'current', label: 'Current month only' },
                { key: 'next3months', label: 'Next 3 months' },
                { key: 'next6months', label: 'Next 6 months' },
              ].map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => applyPreset(preset.key)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                {isSelectingStart ? 'Select start month' : 'Select end month'}
              </p>
              <div className="text-xs text-blue-600">
                <div>Start: {monthNames[tempStartDate.getMonth()]} {tempStartDate.getFullYear()}</div>
                <div>End: {monthNames[tempEndDate.getMonth()]} {tempEndDate.getFullYear()}</div>
              </div>
            </div>
          </div>

          {/* Month Grid */}
          <div className="lg:col-span-2">
            <h3 className="font-medium text-gray-900 mb-3">Select Months</h3>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {months.map((monthDate, index) => {
                const isSelected = isMonthSelected(monthDate);
                const isInRange = isMonthInRange(monthDate);
                const isCurrent = isCurrentMonth(monthDate);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleMonthClick(monthDate)}
                    className={`p-2 text-sm rounded-md transition-colors relative ${
                      isSelected
                        ? 'bg-blue-600 text-white font-medium'
                        : isInRange
                        ? 'bg-blue-100 text-blue-800'
                        : isCurrent
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-xs">
                      {monthNames[monthDate.getMonth()]}
                    </div>
                    <div className="text-xs opacity-75">
                      {monthDate.getFullYear()}
                    </div>
                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Range: {monthNames[tempStartDate.getMonth()]} {tempStartDate.getFullYear()} - {monthNames[tempEndDate.getMonth()]} {tempEndDate.getFullYear()}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
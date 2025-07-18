import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { HolidaySettings } from '../../types';
import { MODAL_LEVELS } from '../../constants/zIndex';

interface WeekendSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Partial<HolidaySettings>) => void;
  currentSettings: HolidaySettings;
}

export const WeekendSettingsModal: React.FC<WeekendSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}) => {
  const [weekendDays, setWeekendDays] = useState<number[]>([]);
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '18:00',
  });

  const weekDayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  useEffect(() => {
    if (isOpen) {
      setWeekendDays([...currentSettings.weekendDays]);
      setWorkingHours({ ...currentSettings.workingHours });
    }
  }, [isOpen, currentSettings]);

  const handleWeekendDayToggle = (dayIndex: number) => {
    setWeekendDays(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(day => day !== dayIndex);
      } else {
        return [...prev, dayIndex].sort();
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (weekendDays.length === 0) {
      alert('Please select at least one weekend day');
      return;
    }

    onSave({
      weekendDays,
      workingHours,
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const getPresetWeekends = () => {
    return [
      { name: 'Bangladesh/Middle East', days: [5, 6], description: 'Friday & Saturday' },
      { name: 'Western', days: [0, 6], description: 'Saturday & Sunday' },
      { name: 'Israel', days: [5, 6], description: 'Friday & Saturday' },
      { name: 'Custom', days: weekendDays, description: 'Select your own' },
    ];
  };

  const setPresetWeekend = (days: number[]) => {
    setWeekendDays(days);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: MODAL_LEVELS.WEEKEND_SETTINGS }}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Weekend & Working Hours</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Weekend Days Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="inline mr-2" size={16} />
              Weekend Configuration
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {getPresetWeekends().slice(0, 3).map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setPresetWeekend(preset.days)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    JSON.stringify(weekendDays.sort()) === JSON.stringify(preset.days.sort())
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{preset.name}</div>
                  <div className="text-xs text-gray-500">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Weekend Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Custom Weekend Days
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {weekDayNames.map((day, index) => (
                <label
                  key={index}
                  className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${
                    weekendDays.includes(index)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={weekendDays.includes(index)}
                    onChange={() => handleWeekendDayToggle(index)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{day.slice(0, 3)}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {weekendDays.map(day => weekDayNames[day]).join(', ')}
            </p>
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Clock className="inline mr-2" size={16} />
              Working Hours
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-time" className="block text-xs font-medium text-gray-600 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start-time"
                  value={workingHours.start}
                  onChange={(e) => setWorkingHours(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="end-time" className="block text-xs font-medium text-gray-600 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="end-time"
                  value={workingHours.end}
                  onChange={(e) => setWorkingHours(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
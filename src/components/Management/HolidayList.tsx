import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Calendar, MapPin, RefreshCw, Plus, Settings } from 'lucide-react';
import { Holiday, HolidaySettings } from '../../types';

interface HolidayListProps {
  holidaySettings: HolidaySettings;
  onEditHoliday: (holiday: Holiday) => void;
  onDeleteHoliday: (holidayId: string) => void;
  onAddHoliday: () => void;
  onEditSettings: () => void;
}

export const HolidayList: React.FC<HolidayListProps> = ({
  holidaySettings,
  onEditHoliday,
  onDeleteHoliday,
  onAddHoliday,
  onEditSettings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHolidays, setSelectedHolidays] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<'all' | 'national' | 'religious' | 'custom'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type'>('date');

  const weekendDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Filter and sort holidays
  const filteredAndSortedHolidays = useMemo(() => {
    const filtered = holidaySettings.holidays.filter(holiday => {
      const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (holiday.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesType = typeFilter === 'all' || holiday.type === typeFilter;
      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [holidaySettings.holidays, searchTerm, typeFilter, sortBy]);

  const toggleHolidaySelection = (holidayId: string) => {
    setSelectedHolidays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(holidayId)) {
        newSet.delete(holidayId);
      } else {
        newSet.add(holidayId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    setSelectedHolidays(prev => 
      prev.size === filteredAndSortedHolidays.length 
        ? new Set() 
        : new Set(filteredAndSortedHolidays.map(h => h.id))
    );
  };

  const handleBulkDelete = () => {
    if (selectedHolidays.size > 0 && confirm(`Delete ${selectedHolidays.size} holiday(s)?`)) {
      selectedHolidays.forEach(holidayId => {
        onDeleteHoliday(holidayId);
      });
      setSelectedHolidays(new Set());
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'national':
        return <MapPin size={14} className="text-blue-600" />;
      case 'religious':
        return <Calendar size={14} className="text-purple-600" />;
      default:
        return <Settings size={14} className="text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const config = {
      national: { bg: 'bg-blue-100', text: 'text-blue-800' },
      religious: { bg: 'bg-purple-100', text: 'text-purple-800' },
      custom: { bg: 'bg-gray-100', text: 'text-gray-800' },
    };
    
    const { bg, text } = config[type as keyof typeof config];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Settings Summary */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Holiday Configuration</h3>
          <button
            onClick={onEditSettings}
            className="flex items-center space-x-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <span>Weekend Days:</span>
            <span className="font-medium">
              {holidaySettings.weekendDays.map(day => weekendDayNames[day]).join(', ')}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Working Hours:</span>
            <span className="font-medium">
              {holidaySettings.workingHours.start} - {holidaySettings.workingHours.end}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search holidays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'national' | 'religious' | 'custom')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="national">National</option>
            <option value="religious">Religious</option>
            <option value="custom">Custom</option>
          </select>
          
          {selectedHolidays.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete ({selectedHolidays.size})</span>
            </button>
          )}
        </div>
        
        <button
          onClick={onAddHoliday}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>Add Holiday</span>
        </button>
      </div>

      {/* Holiday Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="w-12 p-2 sm:p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedHolidays.size === filteredAndSortedHolidays.length && filteredAndSortedHolidays.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="p-2 sm:p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => setSortBy('name')}
              >
                Name {sortBy === 'name' && '↑'}
              </th>
              <th 
                className="p-2 sm:p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => setSortBy('date')}
              >
                Date {sortBy === 'date' && '↑'}
              </th>
              <th 
                className="p-2 sm:p-3 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => setSortBy('type')}
              >
                Type {sortBy === 'type' && '↑'}
              </th>
              <th className="p-2 sm:p-3 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedHolidays.map((holiday) => (
              <tr key={holiday.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-2 sm:p-3">
                  <input
                    type="checkbox"
                    checked={selectedHolidays.has(holiday.id)}
                    onChange={() => toggleHolidaySelection(holiday.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2 sm:p-3">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium text-gray-900">{holiday.name}</div>
                    {holiday.recurring && (
                      <RefreshCw size={14} className="text-green-600" title="Recurring annually" />
                    )}
                  </div>
                  {holiday.description && (
                    <div className="text-sm text-gray-500 mt-1">{holiday.description}</div>
                  )}
                </td>
                <td className="p-2 sm:p-3 text-sm text-gray-600">
                  {new Date(holiday.date).toLocaleDateString()}
                </td>
                <td className="p-2 sm:p-3">
                  {getTypeBadge(holiday.type)}
                </td>
                <td className="p-2 sm:p-3">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditHoliday(holiday)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteHoliday(holiday.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedHolidays.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || typeFilter !== 'all' 
              ? 'No holidays found matching your filters.' 
              : 'No holidays configured. Add your first holiday to get started.'}
          </div>
        )}
      </div>
    </div>
  );
};
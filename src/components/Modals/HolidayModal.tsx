import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { Holiday } from '../../types';
import { MODAL_LEVELS } from '../../constants/zIndex';

interface HolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (holiday: Omit<Holiday, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Holiday>) => void;
  holiday?: Holiday;
}

export const HolidayModal: React.FC<HolidayModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  holiday,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'custom' as 'national' | 'religious' | 'custom',
    recurring: false,
    description: '',
  });

  useEffect(() => {
    if (holiday) {
      setFormData({
        name: holiday.name,
        date: holiday.date,
        type: holiday.type,
        recurring: holiday.recurring,
        description: holiday.description || '',
      });
    } else {
      setFormData({
        name: '',
        date: '',
        type: 'custom',
        recurring: false,
        description: '',
      });
    }
  }, [holiday, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const holidayData = {
      name: formData.name,
      date: formData.date,
      type: formData.type,
      recurring: formData.recurring,
      description: formData.description || undefined,
    };

    if (holiday) {
      onUpdate(holiday.id, holidayData);
    } else {
      onSave(holidayData);
    }

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: MODAL_LEVELS.HOLIDAY }}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {holiday ? 'Edit Holiday' : 'Add Holiday'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Holiday Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Eid ul-Fitr"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'national' | 'religious' | 'custom' }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="national">National Holiday</option>
                <option value="religious">Religious Holiday</option>
                <option value="custom">Custom Holiday</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.recurring}
              onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="recurring" className="flex items-center text-sm text-gray-700">
              <RefreshCw size={16} className="mr-2" />
              Recurring annually
            </label>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional details about this holiday..."
            />
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
              {holiday ? 'Update' : 'Add'} Holiday
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
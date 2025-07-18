import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { Leave, Resource } from '../../types';
import { MODAL_LEVELS } from '../../constants/zIndex';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leave: Omit<Leave, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Leave>) => void;
  onDelete?: (id: string) => void;
  leave?: Leave;
  resources: Resource[];
}

const leaveTypes = [
  { value: 'vacation', label: 'Vacation', color: 'bg-blue-100 text-blue-800' },
  { value: 'sick', label: 'Sick Leave', color: 'bg-red-100 text-red-800' },
  { value: 'personal', label: 'Personal', color: 'bg-green-100 text-green-800' },
  { value: 'holiday', label: 'Holiday', color: 'bg-purple-100 text-purple-800' },
  { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' },
];

const leaveStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
];

export const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  leave,
  resources,
}) => {
  const [formData, setFormData] = useState({
    resourceId: '',
    startDate: '',
    endDate: '',
    type: 'vacation' as Leave['type'],
    reason: '',
    status: 'pending' as Leave['status'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (leave) {
      setFormData({
        resourceId: leave.resourceId,
        startDate: leave.startDate,
        endDate: leave.endDate,
        type: leave.type,
        reason: leave.reason || '',
        status: leave.status,
      });
    } else {
      setFormData({
        resourceId: '',
        startDate: '',
        endDate: '',
        type: 'vacation',
        reason: '',
        status: 'pending',
      });
    }
    setErrors({});
  }, [leave, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.resourceId) {
      newErrors.resourceId = 'Resource is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate > endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const leaveData = {
      resourceId: formData.resourceId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type,
      reason: formData.reason || undefined,
      status: formData.status,
    };

    if (leave) {
      onUpdate(leave.id, leaveData);
    } else {
      onSave(leaveData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (leave && onDelete) {
      if (confirm('Are you sure you want to delete this leave request?')) {
        onDelete(leave.id);
        onClose();
      }
    }
  };

  const calculateLeaveDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    return daysDiff;
  };

  const selectedResource = resources.find(r => r.id === formData.resourceId);
  const selectedType = leaveTypes.find(t => t.value === formData.type);
  const selectedStatus = leaveStatuses.find(s => s.value === formData.status);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: MODAL_LEVELS.LEAVE }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="mr-2" size={20} />
            {leave ? 'Edit Leave' : 'Add Leave'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resource Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource
            </label>
            <select
              value={formData.resourceId}
              onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.resourceId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a resource</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} - {resource.role}
                </option>
              ))}
            </select>
            {errors.resourceId && (
              <p className="text-sm text-red-600 mt-1">{errors.resourceId}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Leave['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Leave['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {leaveStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reason for leave..."
            />
          </div>

          {/* Leave Summary */}
          {formData.startDate && formData.endDate && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">Leave Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                {selectedResource && (
                  <p><User className="inline mr-1" size={14} />{selectedResource.name}</p>
                )}
                <p><Clock className="inline mr-1" size={14} />{calculateLeaveDays()} days</p>
                {selectedType && (
                  <p><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedType.color}`}>
                    {selectedType.label}
                  </span></p>
                )}
                {selectedStatus && (
                  <p><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedStatus.color}`}>
                    {selectedStatus.label}
                  </span></p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            {leave && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                <AlertTriangle size={16} />
                <span>Delete</span>
              </button>
            )}
            
            <div className="flex space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {leave ? 'Update' : 'Add'} Leave
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
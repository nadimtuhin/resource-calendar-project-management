import React, { useState } from 'react';
import { Leave, Resource } from '../../types';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  User, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface LeaveListProps {
  leaves: Leave[];
  resources: Resource[];
  onEditLeave: (leave: Leave) => void;
  onDeleteLeave: (leaveId: string) => void;
  onAddLeave: () => void;
}

const leaveTypes = [
  { value: 'vacation', label: 'Vacation', color: 'bg-blue-100 text-blue-800' },
  { value: 'sick', label: 'Sick Leave', color: 'bg-red-100 text-red-800' },
  { value: 'personal', label: 'Personal', color: 'bg-green-100 text-green-800' },
  { value: 'holiday', label: 'Holiday', color: 'bg-purple-100 text-purple-800' },
  { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' },
];

const leaveStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
];

export const LeaveList: React.FC<LeaveListProps> = ({
  leaves,
  resources,
  onEditLeave,
  onDeleteLeave,
  onAddLeave,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Leave['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Leave['type'] | 'all'>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');

  const getResourceName = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : 'Unknown Resource';
  };

  const getLeaveTypeInfo = (type: Leave['type']) => {
    return leaveTypes.find(t => t.value === type) || leaveTypes[0];
  };

  const getLeaveStatusInfo = (status: Leave['status']) => {
    return leaveStatuses.find(s => s.value === status) || leaveStatuses[0];
  };

  const calculateLeaveDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return daysDiff;
  };

  const filteredLeaves = leaves.filter(leave => {
    const resource = resources.find(r => r.id === leave.resourceId);
    const resourceName = resource ? resource.name.toLowerCase() : '';
    
    const matchesSearch = resourceName.includes(searchTerm.toLowerCase()) ||
                         leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (leave.reason && leave.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.type === typeFilter;
    const matchesResource = resourceFilter === 'all' || leave.resourceId === resourceFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesResource;
  });

  const sortedLeaves = [...filteredLeaves].sort((a, b) => {
    // Sort by start date (newest first)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Leave Management</h3>
        <button
          onClick={onAddLeave}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus size={16} />
          <span>Add Leave</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search leaves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Leave['status'] | 'all')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            {leaveStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as Leave['type'] | 'all')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {leaveTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Resource Filter */}
          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Resources</option>
            {resources.map(resource => (
              <option key={resource.id} value={resource.id}>{resource.name}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || resourceFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
                setResourceFilter('all');
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Leave List */}
      <div className="flex-1 overflow-y-auto">
        {sortedLeaves.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No leaves found</p>
            <p className="text-sm">
              {leaves.length === 0
                ? 'No leaves have been added yet. Click "Add Leave" to get started.'
                : 'Try adjusting your filters or search terms.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedLeaves.map((leave) => {
              const typeInfo = getLeaveTypeInfo(leave.type);
              const statusInfo = getLeaveStatusInfo(leave.status);
              const StatusIcon = statusInfo.icon;
              const leaveDays = calculateLeaveDays(leave.startDate, leave.endDate);
              
              return (
                <div key={leave.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Resource Name */}
                      <div className="flex items-center space-x-2 mb-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {getResourceName(leave.resourceId)}
                        </span>
                      </div>

                      {/* Leave Details */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{leaveDays} days</span>
                        </div>
                      </div>

                      {/* Type and Status */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon size={12} className="mr-1" />
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Reason */}
                      {leave.reason && (
                        <p className="text-sm text-gray-600 italic">
                          "{leave.reason}"
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => onEditLeave(leave)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Edit leave"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteLeave(leave.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete leave"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {sortedLeaves.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-medium text-gray-900">
                {sortedLeaves.filter(l => l.status === 'approved').length}
              </div>
              <div className="text-gray-500">Approved</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {sortedLeaves.filter(l => l.status === 'pending').length}
              </div>
              <div className="text-gray-500">Pending</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {sortedLeaves.reduce((sum, l) => sum + calculateLeaveDays(l.startDate, l.endDate), 0)}
              </div>
              <div className="text-gray-500">Total Days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
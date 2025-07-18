import React, { useState, useEffect } from 'react';
import { Resource } from '../../types';
import { RESOURCE_COLORS } from '../../constants/colors';
import { X } from 'lucide-react';
import { MODAL_LEVELS } from '../../constants/zIndex';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resource: Omit<Resource, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Resource>) => void;
  resource?: Resource;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  resource,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [color, setColor] = useState(RESOURCE_COLORS[0]);

  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setRole(resource.role);
      setColor(resource.color);
    } else {
      setName('');
      setRole('');
      setColor(RESOURCE_COLORS[0]);
    }
  }, [resource]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && role.trim()) {
      if (resource) {
        onUpdate(resource.id, { name: name.trim(), role: role.trim(), color });
      } else {
        onSave({ name: name.trim(), role: role.trim(), color });
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: MODAL_LEVELS.RESOURCE }}
    >
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {resource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter resource name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter resource role"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {RESOURCE_COLORS.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === colorOption 
                      ? 'border-gray-800' 
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {resource ? 'Update' : 'Add'} Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
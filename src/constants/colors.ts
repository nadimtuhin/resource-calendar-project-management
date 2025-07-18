export const RESOURCE_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Dark Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export const PRIORITY_COLORS = {
  high: '#EF4444',    // Red
  medium: '#F59E0B',  // Orange
  low: '#10B981',     // Green
};

export const UTILIZATION_COLORS = {
  healthy: '#10B981',   // Green (0-60%)
  busy: '#F59E0B',      // Orange (61-80%)
  overloaded: '#EF4444', // Red (81-100%)
};

export const getUtilizationColor = (percentage: number): string => {
  if (percentage <= 60) return UTILIZATION_COLORS.healthy;
  if (percentage <= 80) return UTILIZATION_COLORS.busy;
  return UTILIZATION_COLORS.overloaded;
};
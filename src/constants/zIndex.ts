// Z-index constants for proper layering
export const Z_INDEX = {
  // Base layers
  BASE: 1,
  STICKY_HEADER: 10,
  STICKY_COLUMN: 10,
  
  // Calendar layers
  CALENDAR_OVERLAY: 20,
  PROJECT_BAR: 20,
  DAY_CELL_ACTIONS: 30,
  
  // UI layers
  DROPDOWN: 40,
  MANAGEMENT_PANEL: 40,
  TOOLTIP: 50,
  
  // Modal layers (progressive stacking)
  MODAL_BACKDROP: 1000,
  MODAL_BASE: 1000,
  MODAL_SECONDARY: 1100,  // For modals opened from other modals
  MODAL_TERTIARY: 1200,   // For nested modals
  MODAL_QUATERNARY: 1300, // For deeply nested modals
  
  // Alert/notification layers
  ALERT: 2000,
  TOAST: 2100,
} as const;

// Modal z-index levels for different modal types
export const MODAL_LEVELS = {
  // Primary modals (opened from main UI)
  MANAGEMENT: Z_INDEX.MODAL_BASE,
  RESOURCE: Z_INDEX.MODAL_SECONDARY,
  PROJECT: Z_INDEX.MODAL_SECONDARY,
  HOLIDAY: Z_INDEX.MODAL_SECONDARY,
  LEAVE: Z_INDEX.MODAL_SECONDARY,
  
  // Secondary modals (opened from other modals)
  OVERFLOW: Z_INDEX.MODAL_TERTIARY,
  SHARE: Z_INDEX.MODAL_TERTIARY,
  IMPORT: Z_INDEX.MODAL_TERTIARY,
  DATE_RANGE: Z_INDEX.MODAL_TERTIARY,
  WEEKEND_SETTINGS: Z_INDEX.MODAL_TERTIARY,
} as const;
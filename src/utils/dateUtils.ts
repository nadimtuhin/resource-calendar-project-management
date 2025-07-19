export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDateRange = (months: number = 3): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  
  // Start from previous month
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  
  // Generate dates for the specified number of months
  for (let i = 0; i < months; i++) {
    const month = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(month.getFullYear(), month.getMonth(), day));
    }
  }
  
  return dates;
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDaysBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Enhanced utilities for dynamic test data generation

/**
 * Get start of month for a given date
 */
export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get end of month for a given date
 */
export const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Add months to a date
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Get random date within a range
 */
export const getRandomDateInRange = (startDate: Date, endDate: Date): Date => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const random = Math.random() * (end - start) + start;
  return new Date(random);
};

/**
 * Get work days count between two dates (excluding weekends)
 */
export const getWorkDaysCount = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (!isWeekend(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

/**
 * Add work days to a date (skipping weekends)
 */
export const addWorkDays = (date: Date, workDays: number): Date => {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < workDays) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) {
      addedDays++;
    }
  }
  
  return result;
};

/**
 * Get date ranges for test data generation
 */
export const getTestDateRanges = () => {
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    // Previous month
    prevMonth: {
      start: addMonths(currentMonth, -1),
      end: getEndOfMonth(addMonths(currentMonth, -1))
    },
    // Current month
    currentMonth: {
      start: currentMonth,
      end: getEndOfMonth(currentMonth)
    },
    // Next month
    nextMonth: {
      start: addMonths(currentMonth, 1),
      end: getEndOfMonth(addMonths(currentMonth, 1))
    }
  };
};

/**
 * Generate dynamic holiday dates for current year
 */
export const generateDynamicHolidayDates = (year?: number) => {
  const currentYear = year || new Date().getFullYear();
  
  return {
    // Fixed annual holidays
    languageDay: `${currentYear}-02-21`,
    independenceDay: `${currentYear}-03-26`,
    bengaliNewYear: `${currentYear}-04-14`,
    labourDay: `${currentYear}-05-01`,
    victoryDay: `${currentYear}-12-16`,
    
    // Example dynamic religious holidays (approximate)
    eidFitr: formatDate(addDays(new Date(currentYear, 3, 15), Math.floor(Math.random() * 30))),
    eidAdha: formatDate(addDays(new Date(currentYear, 6, 15), Math.floor(Math.random() * 30))),
  };
};

/**
 * Validate that test data is fresh and relevant
 */
export const validateDataFreshness = (projects: any[], holidays: any[]) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const issues: string[] = [];
  
  // Check if projects have dates within reasonable range (last 3 months to next 6 months)
  const oldestAllowedDate = addMonths(currentDate, -3);
  const newestAllowedDate = addMonths(currentDate, 6);
  
  const staleProjects = projects.filter(project => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    return endDate < oldestAllowedDate || startDate > newestAllowedDate;
  });
  
  if (staleProjects.length > 0) {
    issues.push(`${staleProjects.length} projects have dates outside reasonable range`);
  }
  
  // Check if holidays are for current year
  const outdatedHolidays = holidays.filter(holiday => {
    const holidayYear = new Date(holiday.date).getFullYear();
    return Math.abs(holidayYear - currentYear) > 1;
  });
  
  if (outdatedHolidays.length > 0) {
    issues.push(`${outdatedHolidays.length} holidays are more than 1 year away`);
  }
  
  // Check if there's reasonable data coverage
  const currentMonthProjects = projects.filter(project => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    return (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) ||
           (endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear) ||
           (startDate <= currentDate && endDate >= currentDate);
  });
  
  if (currentMonthProjects.length === 0) {
    issues.push('No projects found for current month');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    lastValidated: currentDate.toISOString(),
  };
};
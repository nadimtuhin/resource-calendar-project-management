import React from 'react';
import { getDayName, isToday, isWeekend, getMonthName } from '../../utils/dateUtils';

interface TimelineHeaderProps {
  dates: Date[];
  isHoliday?: (date: Date) => boolean;
  isCustomWeekend?: (date: Date) => boolean;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({ 
  dates, 
  isHoliday, 
  isCustomWeekend 
}) => {
  const getMonthBoundaries = (dates: Date[]) => {
    const boundaries: { index: number; month: string; isCurrentMonth: boolean }[] = [];
    let currentMonth = '';
    const today = new Date();
    
    dates.forEach((date, index) => {
      const monthName = getMonthName(date);
      if (monthName !== currentMonth) {
        const isCurrentMonth = date.getMonth() === today.getMonth() && 
                             date.getFullYear() === today.getFullYear();
        boundaries.push({ index, month: monthName, isCurrentMonth });
        currentMonth = monthName;
      }
    });
    
    return boundaries;
  };

  const monthBoundaries = getMonthBoundaries(dates);

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
      {/* Month Headers */}
      <div className="flex">
        <div className="w-32 bg-gray-50 border-r border-gray-200"></div>
        {monthBoundaries.map((boundary, index) => {
          const nextBoundary = monthBoundaries[index + 1];
          const width = nextBoundary 
            ? (nextBoundary.index - boundary.index) * 32 
            : (dates.length - boundary.index) * 32;
          
          return (
            <div
              key={boundary.month}
              className={`border-r border-gray-200 px-3 py-2 text-sm font-semibold relative ${
                boundary.isCurrentMonth 
                  ? 'bg-blue-50 text-blue-900' 
                  : 'bg-gray-50 text-gray-900'
              }`}
              style={{ width: `${width}px` }}
            >
              {boundary.month}
              {boundary.isCurrentMonth && (
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day Headers */}
      <div className="flex">
        <div className="w-32 bg-gray-50 border-r border-gray-200"></div>
        {dates.map((date, index) => {
          const dayName = getDayName(date);
          const dayNumber = date.getDate();
          const isCurrentDay = isToday(date);
          const isWeekendDay = isCustomWeekend ? isCustomWeekend(date) : isWeekend(date);
          const isHolidayDay = isHoliday ? isHoliday(date) : false;
          
          return (
            <div
              key={index}
              className={`w-8 p-1 text-center text-xs border-r border-gray-200 relative ${
                isCurrentDay 
                  ? 'bg-blue-100 text-blue-800' 
                  : isHolidayDay
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : isWeekendDay 
                      ? 'bg-gray-100 text-gray-500' 
                      : 'bg-white text-gray-700'
              }`}
            >
              {/* Holiday indicator stripe */}
              {isHolidayDay && (
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              )}
              <div className="font-medium">{dayName}</div>
              <div className={`font-bold ${
                isCurrentDay ? 'text-blue-900' : 
                isHolidayDay ? 'text-red-900' : ''
              }`}>
                {dayNumber}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
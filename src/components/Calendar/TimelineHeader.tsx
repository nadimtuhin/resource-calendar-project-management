import React from 'react';
import { getDayName, isToday, isWeekend, getMonthName } from '../../utils/dateUtils';

interface TimelineHeaderProps {
  dates: Date[];
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({ dates }) => {
  const getMonthBoundaries = (dates: Date[]) => {
    const boundaries: { index: number; month: string }[] = [];
    let currentMonth = '';
    
    dates.forEach((date, index) => {
      const monthName = getMonthName(date);
      if (monthName !== currentMonth) {
        boundaries.push({ index, month: monthName });
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
              className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900"
              style={{ width: `${width}px` }}
            >
              {boundary.month}
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
          const isWeekendDay = isWeekend(date);
          
          return (
            <div
              key={index}
              className={`w-8 p-1 text-center text-xs border-r border-gray-200 ${
                isCurrentDay 
                  ? 'bg-blue-100 text-blue-800' 
                  : isWeekendDay 
                    ? 'bg-gray-100 text-gray-500' 
                    : 'bg-white text-gray-700'
              }`}
            >
              <div className="font-medium">{dayName}</div>
              <div className={`font-bold ${isCurrentDay ? 'text-blue-900' : ''}`}>
                {dayNumber}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
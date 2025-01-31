import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  parse,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";

interface CalendarProps {
  selectedDate?: string;
}

export default function Calendar({ selectedDate }: CalendarProps) {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(() => {
    if (selectedDate) {
      return parse(selectedDate, "yyyy-MM-dd", new Date());
    }
    return new Date();
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = parse(task.dueDate, "yyyy-MM-dd", new Date());
      return isSameDay(taskDate, date);
    });
  };

  // If there's a selected date, ensure we're showing the correct month
  React.useEffect(() => {
    if (selectedDate) {
      const parsedDate = parse(selectedDate, "yyyy-MM-dd", new Date());
      if (!isSameMonth(parsedDate, currentDate)) {
        setCurrentDate(parsedDate);
      }
    }
  }, [selectedDate]);

  return (
    <div className="calendar-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm text-[#1d4e74] hover:bg-[#1d4e74] hover:text-white rounded-md transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {/* Days of week header */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-sm font-medium text-gray-500 text-center"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {daysInMonth.map((date) => {
          const dayTasks = getTasksForDate(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isSelected =
            selectedDate &&
            isSameDay(date, parse(selectedDate, "yyyy-MM-dd", new Date()));

          return (
            <div
              key={date.toString()}
              className={`min-h-[100px] border border-gray-200 rounded-lg p-2 ${
                !isCurrentMonth ? "bg-gray-50" : "bg-white"
              } ${isToday(date) ? "border-blue-500" : ""} ${
                isSelected ? "ring-2 ring-[#1d4e74]" : ""
              }`}
            >
              <div
                className={`text-sm ${
                  isToday(date)
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600"
                } mb-2`}
              >
                {format(date, "d")}
              </div>
              {dayTasks.map((task, index) => (
                <div
                  key={`${task.id}-${index}`}
                  className={`text-xs p-1 rounded mb-1 truncate ${
                    task.type === "campaign"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import Sidebar from "../Dashboard/Sidebar";
import Calendar from "./Calendar";
import TaskTable from "./TaskTable";

export default function TaskList() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const handleTaskSelect = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Task list</h1>
            <p className="text-gray-500 mt-1">
              You can view, manage, and submit post for campaigns you requested
              to partner with.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <Calendar selectedDate={selectedDate} />
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <TaskTable onTaskSelect={handleTaskSelect} />
          </div>
        </div>
      </main>
    </div>
  );
}

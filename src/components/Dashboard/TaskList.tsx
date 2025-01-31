import React from "react";
import { ChevronDown } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import LoadingScreen from "../LoadingScreen";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
    case "live":
      return "text-green-600";
    case "denied":
      return "text-red-600";
    case "draft":
    case "pending":
      return "text-blue-600";
    case "edit_required":
      return "text-orange-600";
    default:
      return "text-gray-600";
  }
};

const getActionStyle = (action: string) => {
  return action === "Submit post"
    ? "bg-[#1d4e74] text-white px-4 py-2 rounded-md hover:bg-[#163a57]"
    : "text-blue-600 hover:text-blue-800";
};

export default function DashboardTaskList() {
  const { tasks, loading, error } = useTasks();

  if (loading) return <LoadingScreen />;

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  // Only show the 5 most recent tasks
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Task list</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left">
                <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign/Event
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">👤</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {task.creatorName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.creatorRole}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.platform}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.ceil(
                        (new Date(task.dueDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days left
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`text-sm ${getActionStyle(task.action)}`}
                    >
                      {task.action}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

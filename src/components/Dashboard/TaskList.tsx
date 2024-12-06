import React from 'react';
import { ChevronDown } from 'lucide-react';

const tasks = [
  {
    id: 1,
    name: 'Steve Owens',
    role: 'Interior designer',
    campaign: 'Brand awareness partnership',
    platform: 'Instagram',
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Draft denied',
    action: 'View/edit draft',
  },
  {
    id: 2,
    name: 'Steve Owens',
    role: 'Interior designer',
    campaign: 'Brand awareness partnership',
    platform: 'Instagram',
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Draft approved',
    action: 'Submit post',
  },
  {
    id: 3,
    name: 'Steve Owens',
    role: 'Interior designer',
    campaign: 'Grand opening event',
    platform: 'Instagram',
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Campaign requested',
    action: 'View campaign',
  },
  {
    id: 4,
    name: 'Steve Owens',
    role: 'Interior designer',
    campaign: 'Brand awareness partnership',
    platform: 'LinkedIn',
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Edit required',
    action: 'View draft',
  },
];

export default function TaskList() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900">Task list</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Name <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Campaign <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Due Date <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Status <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Actions <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600">👤</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{task.name}</div>
                      <div className="text-sm text-gray-500">{task.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{task.campaign}</div>
                      <div className="text-sm text-gray-500">{task.platform}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.dueDate}</div>
                  <div className="text-sm text-gray-500">{task.daysLeft}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.status === 'Draft denied' ? 'bg-red-100 text-red-800' :
                    task.status === 'Draft approved' ? 'bg-green-100 text-green-800' :
                    task.status === 'Campaign requested' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className={`text-sm ${
                    task.action === 'Submit post' ? 'text-white bg-[#1d4e74] px-4 py-2 rounded-md' : 'text-blue-600'
                  }`}>
                    {task.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
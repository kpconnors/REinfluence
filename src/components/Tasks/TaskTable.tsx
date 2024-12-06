import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Task {
  id: number;
  name: string;
  role: string;
  campaign: {
    name: string;
    platform: string;
    image: string;
  };
  dueDate: string;
  daysLeft: string;
  status: string;
  action: string;
}

const tasks: Task[] = [
  {
    id: 1,
    name: 'Steve Owens',
    role: 'Interior designer',
    campaign: {
      name: 'Brand awareness partnership',
      platform: 'Instagram',
      image: '/campaign1.jpg'
    },
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Partnership pending',
    action: 'View draft'
  },
  {
    id: 2,
    name: 'Steve Owens',
    role: 'Interior designer',
    campaign: {
      name: 'Brand awareness partnership',
      platform: 'Instagram',
      image: '/campaign2.jpg'
    },
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Campaign requested',
    action: 'View campaign'
  },
  {
    id: 3,
    name: 'Steve Owens',
    role: 'Interior designer',
    campaign: {
      name: 'Brand awareness partnership',
      platform: 'Instagram',
      image: '/campaign3.jpg'
    },
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Pending approval',
    action: 'View draft'
  },
  {
    id: 4,
    name: 'Steve Owens',
    role: 'Interior designer',
    campaign: {
      name: 'Brand awareness partnership',
      platform: 'Instagram',
      image: '/campaign4.jpg'
    },
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Edit required',
    action: 'Edit draft'
  },
  {
    id: 5,
    name: 'Steve Owens',
    role: 'Interior designer',
    campaign: {
      name: 'Grand opening event',
      platform: 'Instagram',
      image: '/campaign5.jpg'
    },
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Draft denied',
    action: 'Submit post'
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'partnership pending':
      return 'text-blue-600';
    case 'campaign requested':
      return 'text-purple-600';
    case 'pending approval':
      return 'text-yellow-600';
    case 'edit required':
      return 'text-orange-600';
    case 'draft denied':
      return 'text-red-600';
    case 'draft approved':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

const getActionStyle = (action: string) => {
  return action === 'Submit post'
    ? 'bg-[#1d4e74] text-white px-4 py-2 rounded-md hover:bg-[#163a57]'
    : 'text-blue-600 hover:text-blue-800';
};

export default function TaskTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
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
                Campaign
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
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
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
                  <div className="h-10 w-10 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{task.campaign.name}</div>
                    <div className="text-sm text-gray-500">{task.campaign.platform}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{task.dueDate}</div>
                <div className="text-sm text-gray-500">{task.daysLeft}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className={`text-sm ${getActionStyle(task.action)}`}>
                  {task.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
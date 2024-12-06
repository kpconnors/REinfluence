import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  role: string;
  latestCampaign: {
    name: string;
    date: string;
    platform: string;
  };
  dueDate: string;
  daysLeft: string;
  status: string;
  action: string;
}

const partners: Partner[] = [
  {
    id: 1,
    name: 'Partner 1',
    role: 'Interior designer',
    latestCampaign: {
      name: 'Brand awareness partnership',
      date: 'Sep 1, 2024',
      platform: 'Instagram'
    },
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Approved',
    action: 'Assign campaign'
  },
  {
    id: 2,
    name: 'Partner 2',
    role: 'Interior designer',
    latestCampaign: {
      name: 'Brand awareness partnership',
      date: 'Sep 1, 2024',
      platform: 'Instagram'
    },
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Denied',
    action: 'View draft'
  },
  {
    id: 3,
    name: 'Partner 3',
    role: 'Interior designer',
    latestCampaign: {
      name: 'Brand awareness partnership',
      date: 'Sep 1, 2024',
      platform: 'Instagram'
    },
    dueDate: '08/18/2024',
    daysLeft: '2 days left',
    status: 'Pending your approval',
    action: 'View draft'
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'text-green-600';
    case 'denied':
      return 'text-red-600';
    case 'pending your approval':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};

const getActionStyle = (action: string) => {
  return action === 'Assign campaign'
    ? 'text-blue-600 hover:text-blue-800'
    : 'text-blue-600 hover:text-blue-800';
};

export default function ExclusivePartnersList() {
  return (
    <div>
      {/* Search and filters */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search exclusive partners"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Partners table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  Latest Campaign
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
          <tbody className="divide-y divide-gray-200">
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600">👤</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                      <div className="text-sm text-gray-500">{partner.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {partner.latestCampaign.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {partner.latestCampaign.platform} • {partner.latestCampaign.date}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{partner.dueDate}</div>
                  <div className="text-sm text-gray-500">{partner.daysLeft}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${getStatusColor(partner.status)}`}>
                    {partner.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className={`text-sm ${getActionStyle(partner.action)}`}>
                    {partner.action}
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
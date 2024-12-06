import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, User } from 'lucide-react';
import { usePartnerships } from '../../hooks/usePartnerships';
import { useFirestore } from '../../hooks/useFirestore';
import LoadingScreen from '../LoadingScreen';

interface Partner {
  id: string;
  fullName: string;
  companyName: string;
  industry: string;
  profilePhotoUrl?: string;
  partnership: {
    type: 'campaign' | 'event';
    title: string;
    platform?: string;
    date: string;
    status: string;
  };
}

export default function PartnersList() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPartnershipRequests } = usePartnerships();
  const { get: getUser } = useFirestore('users');
  const { get: getCampaign } = useFirestore('campaigns');
  const { get: getEvent } = useFirestore('events');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        // Get all approved partnership requests
        const requests = await getPartnershipRequests('sent');
        const approvedRequests = requests.filter(req => req.status === 'approved');

        // Get partner details and campaign/event info for each request
        const partnersData = await Promise.all(
          approvedRequests.map(async (request) => {
            const creator = await getUser(request.creatorId);
            if (!creator) return null;

            let partnershipDetails;
            if (request.type === 'campaign') {
              const campaign = await getCampaign(request.campaignId!);
              if (!campaign) return null;
              partnershipDetails = {
                type: 'campaign' as const,
                title: campaign.title,
                platform: campaign.platform,
                date: campaign.dueDate,
                status: campaign.status
              };
            } else {
              const event = await getEvent(request.eventId!);
              if (!event) return null;
              partnershipDetails = {
                type: 'event' as const,
                title: event.title,
                date: event.eventDate,
                status: event.status
              };
            }

            return {
              id: creator.uid,
              fullName: creator.fullName,
              companyName: creator.companyName,
              industry: creator.industry,
              profilePhotoUrl: creator.profilePhotoUrl,
              partnership: partnershipDetails
            };
          })
        );

        setPartners(partnersData.filter((p): p is Partner => p !== null));
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError('Failed to load partners');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [getPartnershipRequests, getUser, getCampaign, getEvent]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
      case 'active':
        return 'text-green-600';
      case 'completed':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div>
      {/* Search and filters */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search partners"
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
                  Partner
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partnership Details
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {partners.length > 0 ? (
              partners.map((partner) => (
                <tr key={partner.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {partner.profilePhotoUrl ? (
                        <img
                          src={partner.profilePhotoUrl}
                          alt={partner.fullName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{partner.fullName}</div>
                        <div className="text-sm text-gray-500">{partner.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {partner.partnership.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {partner.partnership.type === 'campaign' 
                            ? `${partner.partnership.platform} campaign`
                            : 'Event'
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(partner.partnership.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getStatusColor(partner.partnership.status)}`}>
                      {partner.partnership.status.charAt(0).toUpperCase() + 
                       partner.partnership.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No active partnerships found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
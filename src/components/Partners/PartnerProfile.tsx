import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Dashboard/Sidebar';
import { ChevronLeft, Calendar, User } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { useCampaigns } from '../../hooks/useCampaigns';
import { useEvents } from '../../hooks/useEvents';
import { usePartnerships } from '../../hooks/usePartnerships';
import LoadingScreen from '../LoadingScreen';
import RequestModal from './RequestModal';

interface RequestModalState {
  isOpen: boolean;
  type: 'campaign' | 'event';
  data: any;
}

export default function PartnerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { get } = useFirestore('users');
  const { campaigns } = useCampaigns(id);
  const { events } = useEvents(id);
  const { requestPartnership } = usePartnerships();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestModal, setRequestModal] = useState<RequestModalState>({
    isOpen: false,
    type: 'campaign',
    data: null
  });

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        if (!id) throw new Error('No partner ID provided');
        const partnerData = await get(id);
        if (!partnerData) throw new Error('Partner not found');
        setPartner(partnerData);
      } catch (err) {
        console.error('Error fetching partner:', err);
        setError('Failed to load partner profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id, get]);

  const handleRequestPartnership = (type: 'campaign' | 'event', data: any) => {
    setRequestModal({
      isOpen: true,
      type,
      data
    });
  };

  const handleSubmitRequest = async (formData: any) => {
    try {
      await requestPartnership(
        requestModal.type,
        requestModal.data.id,
        partner.uid,
        formData
      );
      setRequestModal(prev => ({ ...prev, isOpen: false }));
      // Show success message
    } catch (err) {
      console.error('Error submitting request:', err);
      throw err; // Let RequestModal handle the error
    }
  };

  if (loading) return <LoadingScreen />;

  if (error || !partner) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="text-red-600">{error || 'Failed to load partner profile'}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center space-y-4">
                {partner.profilePhotoUrl ? (
                  <img
                    src={partner.profilePhotoUrl}
                    alt={partner.fullName}
                    className="w-48 h-48 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center">
                    <User className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Full name</h2>
                  <p className="text-gray-600">{partner.fullName}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Company name</h2>
                  <p className="text-gray-600">{partner.companyName}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Industry</h2>
                  <p className="text-gray-600">{partner.industry}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Location</h2>
                  <p className="text-gray-600">{partner.location}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Career experience</h2>
                  <p className="text-gray-600">{partner.careerExperience}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Social media</h2>
                  <p className="text-gray-600">{partner.socialMediaHandle}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">About</h2>
                  <p className="text-gray-600">{partner.bio || 'No bio available'}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Goals</h2>
                  <p className="text-gray-600">{partner.goals}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns Section */}
          {campaigns.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Campaigns</h2>
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>
                    <div className="text-gray-600 mt-1">
                      {campaign.platform} post by {new Date(campaign.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                    <p className="text-gray-600">{campaign.requirements}</p>
                  </div>

                  {campaign.imageUrls && campaign.imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                      {campaign.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Campaign ${index + 1}`}
                          className="aspect-square object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleRequestPartnership('campaign', campaign)}
                    className="w-full bg-[#1d4e74] text-white py-2 px-4 rounded-md hover:bg-[#163a57] transition-colors duration-200"
                  >
                    Request partnership
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Events Section */}
          {events.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Events</h2>
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Event details:</h4>
                    <p className="text-gray-600">{event.details}</p>
                  </div>

                  {event.imageUrls && event.imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                      {event.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Event ${index + 1}`}
                          className="aspect-square object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {event.requiresPayment && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-md">
                      <p className="text-blue-800">
                        This event requires a contribution payment of ${event.paymentAmount} USD
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleRequestPartnership('event', event)}
                    className="w-full bg-[#1d4e74] text-white py-2 px-4 rounded-md hover:bg-[#163a57] transition-colors duration-200"
                  >
                    Request partnership
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {requestModal.isOpen && (
        <RequestModal
          isOpen={requestModal.isOpen}
          onClose={() => setRequestModal(prev => ({ ...prev, isOpen: false }))}
          onSubmit={handleSubmitRequest}
          type={requestModal.type}
          data={requestModal.data}
        />
      )}
    </div>
  );
}
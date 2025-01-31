import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Dashboard/Sidebar";
import { ChevronDown, Plus, HelpCircle } from "lucide-react";
import EventsList from "./EventsList";
import PartnersList from "./PartnersList";
import ExclusivePartnersList from "./ExclusivePartnersList";
import { useCampaigns } from "../../hooks/useCampaigns";
import { useEvents } from "../../hooks/useEvents";
import LoadingScreen from "../LoadingScreen";

type TabType = "campaigns" | "events" | "partners" | "exclusive";

export default function PartnersAndCampaigns() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("campaigns");
  const { campaigns, loading, error } = useCampaigns();
  const { events, loading: eventsLoading } = useEvents();

  // Set initial tab based on URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["campaigns", "events", "partners", "exclusive"].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, [location]);

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
      default:
        return "text-gray-600";
    }
  };

  const getActionText = (status: string) => {
    switch (status.toLowerCase()) {
      case "live":
        return "View post";
      default:
        return "View draft";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "events":
        return <EventsList />;
      case "partners":
        return <PartnersList />;
      case "exclusive":
        return <ExclusivePartnersList />;
      case "campaigns":
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
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
              <tbody className="divide-y divide-gray-200">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {campaign.images && campaign.images.length > 0 ? (
                            <img
                              src={campaign.images[0]}
                              alt={campaign.title}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded " />
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {campaign.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {campaign.platform}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(campaign.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm ${getStatusColor(
                            campaign.status
                          )}`}
                        >
                          {campaign.status.charAt(0).toUpperCase() +
                            campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          {getActionText(campaign.status)}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <p className="text-lg">No campaigns found</p>
                      <p className="text-sm mt-1">
                        Create a new campaign to get started
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="text-red-600">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                My partners & campaigns
              </h1>
              <p className="text-gray-500 mt-1">
                You can manage your partners and approve submitted work for your
                campaigns.
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1d4e74] text-white rounded-md hover:bg-[#163a57] transition-colors">
              <Plus className="h-5 w-5" />
              Create Exclusive Partnerships
              <HelpCircle className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("campaigns")}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === "campaigns"
                    ? "border-[#1d4e74] text-[#1d4e74]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My campaigns
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                  {campaigns.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === "events"
                    ? "border-[#1d4e74] text-[#1d4e74]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My events
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                  {events.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("partners")}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === "partners"
                    ? "border-[#1d4e74] text-[#1d4e74]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My partners
              </button>
              <button
                onClick={() => setActiveTab("exclusive")}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === "exclusive"
                    ? "border-[#1d4e74] text-[#1d4e74]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Exclusive partners
              </button>
            </nav>
          </div>

          <div className="mt-6">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
}

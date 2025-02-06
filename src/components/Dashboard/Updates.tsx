import React, { useEffect, useState } from "react";
import { User, Check, X } from "lucide-react";
import { usePartnerships } from "../../hooks/usePartnerships";
import { PartnershipRequest } from "../../types/partnership";
import { useFirestore } from "../../hooks/useFirestore";

export default function Updates() {
  const [requests, setRequests] = useState<
    (PartnershipRequest & { requesterName: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { getPartnershipRequests, approveRequest, denyRequest } =
    usePartnerships();
  const { get } = useFirestore("users");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const receivedRequests = await getPartnershipRequests("received");

        // Get requester details for each request
        const requestsWithNames = await Promise.all(
          receivedRequests.map(async (request) => {
            const requester = await get(request.requesterId);
            return {
              ...request,
              requesterName: requester?.fullName || "Unknown User",
              requesterPhoto: requester?.profilePhotoUrl || null,
            };
          })
        );

        // Sort by most recent first
        const sortedRequests = requestsWithNames.sort((a, b) => {
          return b.createdAt.seconds - a.createdAt.seconds;
        });

        setRequests(sortedRequests);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [getPartnershipRequests, get]);

  const getRequestText = (request: PartnershipRequest) => {
    if (request.type === "campaign") {
      return "has requested to join your campaign";
    } else {
      return request.agreeToPay
        ? "has requested to join your paid event"
        : "has requested to join your event";
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await approveRequest(requestId);
      // Update the request status locally
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "approved" } : req
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleDeny = async (requestId: string) => {
    try {
      await denyRequest(requestId);
      // Update the request status locally
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "denied" } : req
        )
      );
    } catch (err) {
      console.error("Error denying request:", err);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="text-green-600 text-sm">Approved</span>;
      case "denied":
        return <span className="text-red-600 text-sm">Denied</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Updates</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1d4e74] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Updates</h2>
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {request.requesterPhoto ? (
                    <img
                      src={request.requesterPhoto}
                      alt={`${request.requesterName}'s profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{request.requesterName}</span>{" "}
                    {getRequestText(request)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {request.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(request.id!)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Approve"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeny(request.id!)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Deny"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  getStatusBadge(request.status)
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No new partnership requests
        </p>
      )}
    </div>
  );
}

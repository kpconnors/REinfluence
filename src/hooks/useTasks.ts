import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Event } from "../types/event";
import { Campaign } from "../types/campaign";
import { Partnership, PartnershipRequest } from "../types/partnership";
import { UserProfile } from "../types/user";
import { format } from "date-fns";

interface Task {
  id: string;
  type: "campaign" | "event";
  title: string;
  dueDate: string;
  status: string;
  platform: string;
  creatorName: string;
  creatorRole: string;
  action: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
  };

  const formatDate = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, "yyyy-MM-dd");
  };

  const fetchTasks = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Fetch all campaigns where user is creator
      const campaignsRef = collection(db, "campaigns");
      const creatorCampaignsQuery = query(
        campaignsRef,
        where("creatorId", "==", currentUser.uid)
      );
      const creatorCampaignsSnapshot = await getDocs(creatorCampaignsQuery);
      const creatorCampaigns = creatorCampaignsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Campaign[];

      // Fetch all events where user is creator
      const eventsRef = collection(db, "events");
      const creatorEventsQuery = query(
        eventsRef,
        where("creatorId", "==", currentUser.uid)
      );
      const creatorEventsSnapshot = await getDocs(creatorEventsQuery);
      const creatorEvents = creatorEventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      // Fetch partnership requests where user is requester
      const requestsRef = collection(db, "partnership_requests");
      const requestsQuery = query(
        requestsRef,
        where("requesterId", "==", currentUser.uid)
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      const requests = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PartnershipRequest[];

      // Fetch campaigns and events from partnership requests
      const partnerCampaigns: Campaign[] = [];
      const partnerEvents: Event[] = [];

      for (const request of requests) {
        if (request.type === "campaign" && request.campaignId) {
          const campaignDoc = await getDoc(
            doc(db, "campaigns", request.campaignId)
          );
          if (campaignDoc.exists()) {
            partnerCampaigns.push({
              id: campaignDoc.id,
              ...campaignDoc.data(),
              status: request.status,
            } as Campaign);
          }
        } else if (request.type === "event" && request.eventId) {
          const eventDoc = await getDoc(doc(db, "events", request.eventId));
          if (eventDoc.exists()) {
            partnerEvents.push({
              id: eventDoc.id,
              ...eventDoc.data(),
              status: request.status,
            } as Event);
          }
        }
      }

      // Transform campaigns into tasks
      const campaignTasks = await Promise.all(
        [...creatorCampaigns, ...partnerCampaigns].map(async (campaign) => {
          const creator = await fetchUserProfile(campaign.creatorId);
          return {
            id: campaign.id,
            type: "campaign" as const,
            title: campaign.title,
            dueDate: formatDate(campaign.dueDate),
            status: campaign.status,
            platform: campaign.platform,
            creatorName: creator?.fullName || "Unknown User",
            creatorRole: creator?.industry || "Unknown Role",
            action: getActionText(campaign.status),
          };
        })
      );

      // Transform events into tasks
      const eventTasks = await Promise.all(
        [...creatorEvents, ...partnerEvents].map(async (event) => {
          const creator = await fetchUserProfile(event.creatorId);
          return {
            id: event.id,
            type: "event" as const,
            title: event.title,
            dueDate: formatDate(event.eventDate),
            status: event.status,
            platform: event.platform,
            creatorName: creator?.fullName || "Unknown User",
            creatorRole: creator?.industry || "Unknown Role",
            action: getActionText(event.status),
          };
        })
      );

      // Combine and sort by due date
      const allTasks = [...campaignTasks, ...eventTasks].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );

      setTasks(allTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const getActionText = (status: string): string => {
    switch (status.toLowerCase()) {
      case "draft":
        return "Edit draft";
      case "pending":
        return "View draft";
      case "approved":
        return "Submit post";
      case "denied":
        return "View/edit draft";
      case "live":
        return "View post";
      default:
        return "View details";
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUser]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
  };
}

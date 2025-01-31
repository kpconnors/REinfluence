import React from "react";
import Sidebar from "./Sidebar";
import WelcomeCard from "./WelcomeCard";
import Updates from "./Updates";
import LatestPartnerships from "./LatestPartnerships";
import DashboardTaskList from "./TaskList";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "../LoadingScreen";

export default function Dashboard() {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <WelcomeCard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Updates />
            <LatestPartnerships />
          </div>
          <div className="mt-8">
            <DashboardTaskList />
          </div>
        </div>
      </main>
    </div>
  );
}

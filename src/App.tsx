import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileSetup from "./components/ProfileSetup/ProfileSetup";
import Profile from "./components/Profile/Profile";
import UpdateProfile from "./components/Profile/UpdateProfile/UpdateProfile";
import DiscoverPartners from "./components/Partners/DiscoverPartners";
import PartnersAndCampaigns from "./components/PartnersAndCampaigns/PartnersAndCampaigns";
import PartnerProfile from "./components/Partners/PartnerProfile";
import CampaignEditor from "./components/Profile/CampaignEditor";
import EventEditor from "./components/Profile/EventEditor";
import TaskList from "./components/Tasks/TaskList";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/partners"
            element={
              <PrivateRoute>
                <DiscoverPartners />
              </PrivateRoute>
            }
          />
          <Route
            path="/partners-campaigns"
            element={
              <PrivateRoute>
                <PartnersAndCampaigns />
              </PrivateRoute>
            }
          />
          <Route
            path="/partners/:id"
            element={
              <PrivateRoute>
                <PartnerProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaign/new"
            element={
              <PrivateRoute>
                <CampaignEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/event/new"
            element={
              <PrivateRoute>
                <EventEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskList />
              </PrivateRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

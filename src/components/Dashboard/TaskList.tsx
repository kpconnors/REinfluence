import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import LoadingScreen from "../LoadingScreen";
import { User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

// Assuming you have a method to fetch user profile photo by userId
const getUserProfilePhoto = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data().profilePhotoUrl || null;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile photo:", error);
    return null;
  }
};

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
    case "edit_required":
      return "text-orange-600";
    default:
      return "text-gray-600";
  }
};

const getActionStyle = (action: string) => {
  return action === "Submit post"
    ? "bg-[#1d4e74] text-white px-4 py-2 rounded-md hover:bg-[#163a57]"
    : "text-blue-600 hover:text-blue-800";
};

export default function DashboardTaskList() {
  const { tasks, loading, error } = useTasks();
  const { userProfile } = useAuth();
  const [profilePhotos, setProfilePhotos] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchProfilePhotos = async () => {
      const photos: { [key: string]: string } = {};
      for (const task of tasks) {
        if (!photos[task.creatorId]) {
          const photoUrl = await getUserProfilePhoto(task.creatorId);
          photos[task.creatorId] = photoUrl || "";
        }
      }
      setProfilePhotos(photos);
    };

    if (tasks.length > 0) {
      fetchProfilePhotos();
    }
  }, [tasks]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  // Only show the 5 most recent tasks
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Task list</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
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
                  Campaign/Event
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
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {profilePhotos[task.creatorId] ? (
                        <img
                          src={profilePhotos[task.creatorId]}
                          alt="Profile"
                          className="h-10 w-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full mr-3 bg-gray-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {task.creatorName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.creatorRole}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/*<div className="h-10 w-10 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>*/}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.platform}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.ceil(
                        (new Date(task.dueDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days left
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`text-sm ${getActionStyle(task.action)}`}
                    >
                      {task.action}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

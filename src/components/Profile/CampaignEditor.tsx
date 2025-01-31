import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, File, Trash2 } from "lucide-react";
import Sidebar from "../Dashboard/Sidebar";
import { FormField } from "../FormField";
import { useCampaigns } from "../../hooks/useCampaigns";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "../LoadingScreen";

interface FileUpload {
  file: File;
  name: string;
  size: number;
  progress: number;
}

const socialPlatforms = [
  "Instagram",
  "Twitter",
  "LinkedIn",
  "TikTok",
  "YouTube",
];

interface CampaignFormData {
  title: string;
  platform: string;
  dueDate: string;
  requirements: string;
}

export default function CampaignEditor() {
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    platform: "",
    dueDate: "",
    requirements: "",
  });

  const [files, setFiles] = useState<FileUpload[]>([]);
  const [errors, setErrors] = useState<Partial<CampaignFormData>>({});
  const { createCampaign, loading, error } = useCampaigns();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof CampaignFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        name: file.name,
        size: Math.round(file.size / 1024), // Convert to KB
        progress: 0,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Partial<CampaignFormData> = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    }
    if (!formData.platform) {
      newErrors.platform = "Platform is required";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    if (!formData.requirements) {
      newErrors.requirements = "Requirements are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !currentUser) return;

    try {
      const campaignData = {
        creatorId: currentUser.uid,
        title: formData.title,
        platform: formData.platform,
        dueDate: formData.dueDate,
        requirements: formData.requirements,
        status: "draft" as const,
      };

      // Create campaign with images
      await createCampaign(
        campaignData,
        files.map((f) => f.file)
      );

      // Navigate to campaigns list
      navigate("/partners-campaigns");
    } catch (err) {
      console.error("Error creating campaign:", err);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Create campaign
          </h1>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="space-y-6">
              <FormField label="Campaign title" error={errors.title} required>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
                />
              </FormField>

              <FormField
                label="Select social media platform"
                error={errors.platform}
                required
              >
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
                >
                  <option value="">Select social media platform</option>
                  {socialPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Campaign due date"
                error={errors.dueDate}
                required
              >
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
                />
              </FormField>

              <FormField
                label="Requirements"
                error={errors.requirements}
                required
              >
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="What should the campaign include"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
                />
              </FormField>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign images (optional)
                </label>

                <div className="mt-1 border-2 border-gray-300 border-dashed rounded-lg p-6 hover:border-[#1d4e74] transition-colors">
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <label className="mt-2 cursor-pointer">
                      <span className="text-[#1d4e74] hover:text-[#163a57] font-medium">
                        Upload images
                      </span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <File className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.size}KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1d4e74] text-white py-2 px-4 rounded-md hover:bg-[#163a57] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating campaign..." : "Create campaign"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

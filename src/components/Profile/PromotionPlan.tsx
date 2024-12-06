import React from 'react';
import { Calendar } from 'lucide-react';

interface PromotionPlanProps {
  title: string;
  platform: string;
  date: string;
  includes: string[];
  images: string[];
}

export default function PromotionPlan({ title, platform, date, includes, images }: PromotionPlanProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center text-gray-600 mt-1">
          <Calendar className="h-4 w-4 mr-2" />
          {platform} post by {date}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">What's included:</h4>
        <ul className="space-y-2">
          {includes.map((item, index) => (
            <li key={index} className="text-gray-600">• {item}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        {images.map((image, index) => (
          <div 
            key={index}
            className="aspect-square bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg"
          />
        ))}
      </div>

      <button className="w-full bg-[#1d4e74] text-white py-2 px-4 rounded-md hover:bg-[#163a57] transition-colors duration-200">
        Request partnership
      </button>
    </div>
  );
}
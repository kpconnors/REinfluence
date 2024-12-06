import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planType: 'social' | 'event') => void;
}

export default function AddPlanModal({ isOpen, onClose, onSelectPlan }: AddPlanModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectPlan = (planType: 'social' | 'event') => {
    onClose();
    if (planType === 'social') {
      navigate('/campaign/new');
    } else {
      navigate('/event/new');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add plans</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg text-gray-700 mb-4">What plan are you adding?</h3>
          
          <button
            onClick={() => handleSelectPlan('social')}
            className="w-full py-3 px-4 border-2 border-[#1d4e74] rounded-lg text-center hover:bg-gray-50 transition-colors"
          >
            Social media campaign
          </button>
          
          <button
            onClick={() => handleSelectPlan('event')}
            className="w-full py-3 px-4 border-2 border-[#1d4e74] rounded-lg text-center hover:bg-gray-50 transition-colors"
          >
            Upcoming event
          </button>
        </div>
      </div>
    </div>
  );
}
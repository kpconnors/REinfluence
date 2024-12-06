import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { FormField } from '../FormField';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  type: 'campaign' | 'event';
  data: {
    id: string;
    title: string;
    platform?: string;
    date: string;
    details?: string;
    includes?: string[];
    requiresPayment?: boolean;
    paymentAmount?: number;
  };
}

export default function RequestModal({ isOpen, onClose, onSubmit, type, data }: RequestModalProps) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [agreeToPay, setAgreeToPay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = {
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        photo,
        agreeToPay: data.requiresPayment ? agreeToPay : undefined
      };

      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Request partnership</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {type === 'campaign' ? (
          <p className="mb-6">
            To request partnership, please submit a draft for {data.title}.
          </p>
        ) : (
          <p className="mb-6">
            You would like to request partnership for {data.title} event
            {data.requiresPayment && ` (Payment required: $${data.paymentAmount} USD)`}.
          </p>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'campaign' && (
            <>
              <FormField label="Content" required>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
                  placeholder="Enter your post content"
                />
              </FormField>

              <FormField label="Tags">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
                  placeholder="Enter tags separated by commas"
                />
              </FormField>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Photo (optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#1d4e74] transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-[#1d4e74] hover:text-[#163a57] focus-within:outline-none">
                        <span>Upload a photo</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {data.requiresPayment && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreeToPay"
                checked={agreeToPay}
                onChange={(e) => setAgreeToPay(e.target.checked)}
                className="h-4 w-4 text-[#1d4e74] focus:ring-[#1d4e74] border-gray-300 rounded"
              />
              <label htmlFor="agreeToPay" className="ml-2 block text-sm text-gray-900">
                I agree to pay the contribution amount of ${data.paymentAmount} USD
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (data.requiresPayment && !agreeToPay)}
              className="px-4 py-2 bg-[#1d4e74] text-white rounded-md hover:bg-[#163a57] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
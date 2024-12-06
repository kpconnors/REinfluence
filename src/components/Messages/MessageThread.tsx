import React, { useState } from 'react';
import { Mic, Paperclip, Send, MoreVertical, Search } from 'lucide-react';
import { Conversation } from './types';

interface MessageThreadProps {
  conversation: Conversation;
}

interface ThreadMessage {
  id: number;
  content: string;
  timestamp: string;
  type: 'notification' | 'message';
  action?: {
    text: string;
    onClick: () => void;
  };
}

const messages: ThreadMessage[] = [
  {
    id: 1,
    content: 'For your review',
    timestamp: 'Today',
    type: 'notification',
    action: {
      text: 'View request',
      onClick: () => console.log('View request clicked'),
    },
  },
  {
    id: 2,
    content: 'Draft approved',
    timestamp: 'Yesterday',
    type: 'notification',
    action: {
      text: 'Submit post',
      onClick: () => console.log('Submit post clicked'),
    },
  },
  {
    id: 3,
    content: 'Edit requested',
    timestamp: 'Apr 5, 2024',
    type: 'notification',
    action: {
      text: 'Edit post',
      onClick: () => console.log('Edit post clicked'),
    },
  },
];

export default function MessageThread({ conversation }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {conversation.user.avatar ? (
              <img
                src={conversation.user.avatar}
                alt={conversation.user.name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <span className="text-gray-600">👤</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">{conversation.user.name}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-gray-600">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col items-center">
            <div className="bg-gray-50 rounded-lg px-4 py-3 max-w-lg">
              <p className="text-sm text-gray-900">{message.content}</p>
              {message.action && (
                <button
                  onClick={message.action.onClick}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  {message.action.text}
                </button>
              )}
            </div>
            <span className="text-xs text-gray-500 mt-1">{message.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-gray-600">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          />
          <button className="text-gray-400 hover:text-gray-600">
            <Mic className="h-5 w-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`${
              newMessage.trim()
                ? 'bg-[#1d4e74] hover:bg-[#163a57]'
                : 'bg-gray-300 cursor-not-allowed'
            } text-white p-2 rounded-md`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
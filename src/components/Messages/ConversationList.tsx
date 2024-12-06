import React from 'react';
import { Search } from 'lucide-react';
import { Conversation } from './types';

interface ConversationListProps {
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const conversations: Conversation[] = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Michael Fassbender',
    },
    lastMessage: {
      id: 1,
      senderId: 1,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      timestamp: 'Yesterday',
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Christina Smith',
    },
    lastMessage: {
      id: 2,
      senderId: 2,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      timestamp: 'Apr 13, 2024',
      read: true,
    },
    unreadCount: 0,
  },
  // Add more conversations as needed
];

export default function ConversationList({ selectedConversation, onSelectConversation }: ConversationListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Messages</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 ${
              selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
            }`}
          >
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              {conversation.user.avatar ? (
                <img
                  src={conversation.user.avatar}
                  alt={conversation.user.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <span className="text-gray-600">👤</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {conversation.user.name}
                </p>
                <p className="text-xs text-gray-500">{conversation.lastMessage.timestamp}</p>
              </div>
              <p className="text-sm text-gray-500 truncate">{conversation.lastMessage.content}</p>
            </div>
            {conversation.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                {conversation.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import { Conversation } from './types';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex overflow-hidden">
        <div className="w-96 border-r border-gray-200 bg-white">
          <ConversationList 
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </div>
        <div className="flex-1 bg-white">
          {selectedConversation ? (
            <MessageThread conversation={selectedConversation} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
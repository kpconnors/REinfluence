export interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  lastMessage: Message;
  unreadCount: number;
}
export interface Campaign {
  id: string;
  creatorId: string;
  title: string;
  platform: string;
  dueDate: string;
  requirements: string;
  imageUrls: string[];
  status: 'draft' | 'pending' | 'approved' | 'denied' | 'live';
  createdAt: string;
  updatedAt: string;
}
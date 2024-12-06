export interface Event {
  id: string;
  creatorId: string;
  title: string;
  platform: string;
  eventDate: string;
  details: string;
  requiresPayment: boolean;
  imageUrls: string[];
  status: 'pending' | 'approved' | 'denied' | 'payment_required';
  createdAt: string;
  updatedAt: string;
}
export interface PartnershipRequest {
  id?: string;
  campaignId?: string;
  eventId?: string;
  requesterId: string; // User who wants to join
  creatorId: string;   // User who created the campaign/event
  type: 'campaign' | 'event';
  status: 'pending' | 'approved' | 'denied';
  content?: string;    // For campaign drafts
  tags?: string[];     // For campaign drafts
  photoUrl?: string;   // For campaign drafts
  agreeToPay?: boolean; // For paid events
  createdAt: string;
  updatedAt: string;
}

export interface Partnership {
  id?: string;
  campaignId?: string;
  eventId?: string;
  partnerId: string;   // User who joined
  creatorId: string;   // User who created the campaign/event
  type: 'campaign' | 'event';
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'completed' | 'not_required';
  createdAt: string;
  updatedAt: string;
}
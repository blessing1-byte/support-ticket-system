export type Notification = {
  id: string;
  event_id: string;
  recipient_id: string;
  ticket_id: string;
  type: string;
  message: string;
  is_read: string;
  created_at: Date;
};

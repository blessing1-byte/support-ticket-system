CREATE TABLE IF NOT EXISTS notifications(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    ticket_id uuid NOT NULL, 
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_type on notifications(type)
CREATE TABLE IF NOT EXISTS outbox_events(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    topic VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    --the aggregate id is the main pointer to the id of the event . ed ticket id, user id, payment id.
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_unpublished_outbox ON outbox_events(created_at) WHERE published_at is NULL
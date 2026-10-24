CREATE TABLE IF NOT EXISTS tickets(
    id UUID PRIMARY KEY  DEFAULT gen_random_uuid(),
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK(status IN('OPEN', 'IN PROGRESS', 'RESOLVED', 'CLOSED')),
    created_by UUID NOT NULL REFERENCES users(id),
    assigned_agent_id UUID REFERENCES users(id) ,
    assigned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);
 
--  index on the created_by
CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON tickets(
    created_by
);

CREATE INDEX IF NOT EXISTS idx_tickets_assigned_agent_id ON tickets(
    assigned_agent_id
);
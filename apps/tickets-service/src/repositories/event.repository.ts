import { getPool } from "shared";
import { Events } from "../types/types";

const pool = getPool();
export async function findUnpublishedEvents(): Promise<Events[]> {
  const result = await pool.query(
    `SELECT id, topic, event_type, aggregate_id, payload FROM outbox_events
     WHERE published_at is NULL
     ORDER BY created_at ASC
     LIMIT 10`,
  );
  return result.rows;
}

export async function markEventAsPublished(eventId: string) {
  const result = await pool.query(
    `UPDATE outbox_events
     SET published_at = NOW()
    WHERE id = $1`,
    [eventId],
  );
  return (result.rowCount ?? 0) > 0;
}

import { AppError, createProducer } from "shared";
import { publishJsonSafe } from "shared";
import { TOPICS } from "shared";
import * as eventRepo from "../repositories/event.repository";

let producer: Awaited<ReturnType<typeof createProducer>> | null = null;

export async function initKafka() {
  //a fn that initializes the producer
  producer = await createProducer("ticket-service");
}

export async function publishTicketEvent() {
  //get details from the transaction in ticket repo
  const events = await eventRepo.findUnpublishedEvents();

  if (events.length === 0) {
    throw new Error("no more event to read from");
  }

  //access the values from the array using a f0r of loop
  for (const event of events) {
    await publishJsonSafe(
      producer,
      event.payload,
      event.topic,
      event.aggregate_id,
    );
    await eventRepo.markEventAsPublished(event.id);
  }
}

import { AppError, createProducer, logger } from "shared";
import { publishJsonSafe } from "shared";
import { TOPICS } from "shared";
import * as eventRepo from "../repositories/event.repository";

let producer: Awaited<ReturnType<typeof createProducer>> | null = null;

const POLL_EVENT = 5000;
export async function initKafka() {
  //a fn that initializes the producer
  producer = await createProducer("ticket-service");
}

export async function publishEvent() {
  //get details from the transaction in ticket repo
  const events = await eventRepo.findUnpublishedEvents();

  if (events.length === 0) {
    return;
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

export async function pollOutbox() {
  while (true) {
    //try to publish event first
    try {
      await publishEvent();
    } catch (error) {
      logger.error(error);
    }

    //then set a timeout that holds for five seconds and then returns to check the loop
    await new Promise((resolve) => {
      setTimeout(resolve, POLL_EVENT);
    });
  }
}

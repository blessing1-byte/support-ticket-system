import { Consumer } from "kafkajs";
import { createKafkaClient } from "./topics";
import { logger } from "../logger/logger";

export async function createConsumer(
  clientId: string,
  groupId: string,
): Promise<Consumer> {
  //create client
  const kafka = createKafkaClient(clientId);

  const consumer = kafka.consumer({ groupId });

  consumer.connect();

  logger.info({ groupId }, "kafka consumer connected successfully");

  return consumer;
}

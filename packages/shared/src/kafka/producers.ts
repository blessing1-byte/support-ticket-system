import { Producer, RecordMetadata } from "kafkajs";
import { logger } from "../logger/logger";
import { createKafkaClient } from "./topics";
//this creates the producer and also publishes the event to kafka

//configure the producer set up using the client id
export async function createProducer(clientId: string): Promise<Producer> {
  const kafka = createKafkaClient(clientId);

  const producer = kafka.producer();

  await producer.connect();

  logger.info({ clientId }, "KAFKA PRODUCER SUCCESSFULLY");

  return producer;
}

export async function publishJson(
  producer: Producer,
  payload: Record<string, any>,
  topic: string,
  key?: string,
): Promise<RecordMetadata[]> {
  const result = await producer.send({
    topic,
    messages: [
      {
        key: key ?? null,
        value: JSON.stringify(payload),
      },
    ],
  });
  logger.info({ topic, payload }, "kafka event published successfully");

  console.log(result);
  return result;
}

export async function publishJsonSafe(
  producer: Producer | null,
  payload: Record<string, any>,
  topic: string,
  key?: string,
): Promise<void> {
  if (!producer) {
    logger.warn("producer is not ready");
    return;
  }

  try {
    await publishJson(producer, payload, topic, key);
  } catch (error) {
    logger.error({ error, topic, payload }, " failed to publish event safely");
  }
}

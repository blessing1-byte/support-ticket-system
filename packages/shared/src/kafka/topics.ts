import { Kafka, logLevel, type KafkaConfig } from "kafkajs";

export const TOPICS = {
  TICKET_EVENTS: "ticket.events",
};

export function createKafkaClient(
  clientId: string,
  config: Partial<KafkaConfig> = {},
) {
  //turn to array -> trim whitespace -> remove invalid elements
  const brokers = (process.env.KAFKA_BROKERS || "localhost:9092")
    .split(",")
    .map((broker) => broker.trim())
    .filter(Boolean);

  if (brokers.length === 0) {
    throw new Error("KAFKA_BROKERS was not set in env");
  }

  return new Kafka({
    clientId,
    brokers,
    logLevel: logLevel.ERROR,
    retry: {
      retries: 8,
    },
    ...config,
  });
}

import { Kafka, logLevel, type KafkaConfig } from "kafkajs";

export const TOPICS = {
  TICKET_EVENTS: "ticket.events",
};

export function createKafkaClient(
  clientId: string,
  config: Partial<KafkaConfig> = {},
) {
  //turn to array -> trim whitespace -> remove invalid elements
  const Broker = (process.env.KAFKA_BROKERS || "http://localhost:9092")
    .split(",")
    .map((broker) => broker.trim())
    .filter(Boolean);

  if (Broker.length === 0) {
    throw new Error("KAFKA_BROKERS was not set in env");
  }

  return new Kafka({
    clientId,
    brokers: Broker,
    logLevel: logLevel.ERROR,
    retry: {
      retries: 8,
    },
  });
}

import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const TOPIC = "zap-events";
const consumer = kafka.consumer({ groupId: 'test-group' })

async function main() {
  await consumer.connect()
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value?.toString(),
      })
    },
  })
}

main(); 
import { Kafka } from "kafkajs";
import { prisma } from "./lib/prisma";

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
      const zapId = message.value?.toString();
      
      const zapdata = await prisma.zap.findMany({
        where: { id: zapId! }, 
      })

      console.log(`Received message: ${zapId}`, zapdata);
    },
  })
}

main();
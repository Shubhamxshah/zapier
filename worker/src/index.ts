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
      const zapRunId = message.value?.toString();
      
      const zapRunData = await prisma.zapRun.findUnique({
        where: { id: zapRunId! },
        select: {
          zapId: true,
        }
      })

      const zapData = await prisma.zap.findUnique({
        where: { id: zapRunData!.zapId },
        include: {
          Trigger: true, 
          Action: true,
        }
      })
      console.dir({ zapRunId, zapRunData, zapData }, { depth: null });

      const actionLength = zapData?.Action.length || 0;
      let stage = zapData?.stage || 0;

      while (stage < actionLength) {
        switch (zapData?.Action[0].actionId) {
          case "email": 
            // Handle email action
            //@ts-ignore
            const email = zapData?.Action[stage].metadata?.email;
            //@ts-ignore
            const body = zapData?.Action[stage].metadata?.body;
            processEmail(email, body);
            stage++;
            await prisma.zap.update({
              where: { id: zapData.id },
              data: { stage }
            });
            break;
          case "sol":
            // Handle sol action
            console.log("send sol")
            break;
        }
      }
    },
  })
}

main();
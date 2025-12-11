import { Kafka } from "kafkajs";
import { prisma } from "./lib/prisma";
import { processEmail } from "./actions/email";

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const TOPIC_NAME = "zap-events";
const consumer = kafka.consumer({ groupId: 'test-group' })
const producer = kafka.producer();

async function main() {
  await consumer.connect()
  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })
  await producer.connect();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const parsedValue = JSON.parse(message.value!.toString());
      const zapRunId = parsedValue.zapRunId;
      let stage = parsedValue.stage;

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
            if (stage !== actionLength) {
                  await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            zapRunId: zapRunId,
                            stage: stage,
                        })
                    }],
                });
            }
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
import { prisma } from "./lib/prisma";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

const TOPIC_NAME = "zap-events";

async function main() {

    const producer = kafka.producer();
    await producer.connect();

    while (1) {
        const pendingRows = await prisma.zapRunOutbox.findMany({
            where: {},
            take: 10,
        });


        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map(r => ({
                value: r.zapRunId,
            }))
        })
    }
}

main();
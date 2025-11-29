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

    while (true) {
        try {
            const pendingRows = await prisma.zapRunOutbox.findMany({
                where: {},
                take: 10,
            }); // fetches 10 at a time, if has lesser than 10, will fetch however many there are

            if (pendingRows.length > 0) {
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: pendingRows.map(r => ({
                        value: r.zapRunId,
                    }))
                });

                // delete processed records
                await prisma.zapRunOutbox.deleteMany({
                    where: { id: { in: pendingRows.map(r => r.id) } }
                });
            } else {
                // if no pending rows, wait for a while before checking again
                await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second
            }
        } catch (error) {
            console.error("Error processing zap runs:", error);
        }
    }
}

main();
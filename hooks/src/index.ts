import express from "express";
import { prisma } from "./lib/prisma";    

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;

    const body = req.body;

    await prisma.$transaction(async (tx) => {
        // Your transaction logic here
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
            },
        });

        await tx.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        })
    })

    res.status(200).json({ message: "Hook received" });
})

app.listen(PORT, () => {
    console.log(`Hooks server is running on port ${PORT}`);
})
import Router from "express";
import { authMiddleware } from "../middleware";
import { zapCreateSchema } from "../types/index";
import { prisma } from "../lib/prisma"; 

const zapRouter = Router(); 

zapRouter.post("/", authMiddleware, async (req , res) => {
    const userId = req.userId;
    if (typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid userId" });
    }
    const parsedData = zapCreateSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ errors: parsedData.error });
    }

    const zapData = parsedData.data;

    try {
        const zap = await prisma.zap.create({
            data: {
                userId: userId,
                trigger: {
                    create: {
                        triggerId: zapData.availableTriggerId,
                        metadata: zapData.triggerMetadata || {},
                    }
                },
                actions: {
                    create: zapData.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        metadata: x.actionMetadata || {},
                        sortingOrder: index,
                    }))
                }
            }
        });
        res.status(201).json({ zap });
    } catch (error) {
        console.error("Error creating zap:", error);
        res.status(500).json({ error: "Failed to create zap" });
    }
});

zapRouter.get("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    if (typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid userId" });
    }
    
    try {
        const zaps = await prisma.zap.findMany({
            where: { userId },
            include: {
                trigger: true,
                actions: true,
            }
        });
        res.status(200).json({ zaps });
    } catch (error) {
        console.error("Error fetching zaps:", error);
        res.status(500).json({ error: "Failed to fetch zaps" });
    }
})

zapRouter.get("/:zapId", authMiddleware, async (req, res) => {
    const zapId = req.params.zapId;

    try {
        const zap = await prisma.zap.findUnique({
            where: { id: zapId },
            include: {
                trigger: true,
                actions: true,
            }
        });

        if (!zap) {
            return res.status(404).json({ error: "Zap not found" });
        }

        res.status(200).json({ zap });
    } catch (error) {
        console.error("Error fetching zap:", error);
        res.status(500).json({ error: "Failed to fetch zap" });
    }
});

export default zapRouter;
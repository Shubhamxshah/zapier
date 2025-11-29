import Router from "express";
import { authMiddleware } from "../middleware";
import { zapCreateSchema } from "../types";
import { connect } from "http2";
import { prisma } from "../lib/prisma";

const zapRouter = Router(); 

zapRouter.post("/", authMiddleware, async (req , res) => {
    const parsedData = zapCreateSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ errors: parsedData.error });
    }

    const zapData = parsedData.data;

    const zap = await prisma.zap.create({
        data: {
            userId: zapData.userId,
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
                }))
            }
        }
    });
    res.status(201).json({ zap });
});

export default zapRouter;
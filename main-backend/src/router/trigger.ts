import { Router } from "express";
import { signinSchema, signupSchema } from "../types/index";
import { prisma } from "../lib/prisma";
import  jwt  from "jsonwebtoken";
import { authMiddleware } from "../middleware";


const router = Router();

router.get("/triggers", authMiddleware, async (req, res) => {
    const triggers = await prisma.availableTrigger.findMany();
    res.json(triggers);
});

router.post("/triggers", authMiddleware, async (req, res) => {
    const { name, image } = req.body;

    const newTrigger = await prisma.availableTrigger.create({
        data: {
            name,
            image,
        },
    });

    res.status(201).json(newTrigger);
});

export { router as triggerRouter };
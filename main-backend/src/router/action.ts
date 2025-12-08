import { Router } from "express";
import { signinSchema, signupSchema } from "../types/index";
import { prisma } from "../lib/prisma";
import  jwt  from "jsonwebtoken";
import { authMiddleware } from "../middleware";


const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

router.get("/actions", authMiddleware, async (req, res) => {
    const actions = await prisma.availableAction.findMany();
    res.json(actions);
});

router.post("/actions", authMiddleware, async (req, res) => {
    const { name, image } = req.body;

    const newAction = await prisma.availableAction.create({
        data: {
            name,
            image,
        },
    });

    res.status(201).json(newAction);
});

export { router as actionRouter };
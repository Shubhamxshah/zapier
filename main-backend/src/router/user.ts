import { Router } from "express";
import { signinSchema, signupSchema } from "../schema";
import { prisma } from "../lib/prisma";
import  jwt  from "jsonwebtoken";
import { authMiddleware } from "../middleware";


const userRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

userRouter.post("/signup", async (req, res) => {
    const body = req.body;
    const parseResult = signupSchema.safeParse(body);
    if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error });
    }

    const { username, password, name } = parseResult.data;

    const existingUser = await prisma.user.findFirst({
        where: { username },
    });

    if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
    }

    const user = await prisma.user.create({
        data: {
            username,
            password, // In a real application, make sure to hash the password before storing it
            name,
        },
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(201).json({ token });

});

userRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const parseResult = signinSchema.safeParse(body);
    if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error });
    }

    const { username, password } = parseResult.data;

    const existingUser = await prisma.user.findFirst({
        where: { username, password },
    });

    if (!existingUser) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET);
    res.status(201).json({ token });

});

userRouter.get("/", authMiddleware, async (req, res) => {
    const id = req.body.userId;
    
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            name: true,
        },
    });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
});

export default userRouter;

import z from 'zod';

export const signupSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
    name: z.string().min(1).max(100).optional(),
})

export const signinSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
})



import z from 'zod';

export const signupSchema = z.object({
    email: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
    name: z.string().min(1).max(100).optional(),
})

export const signinSchema = z.object({
    email: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
})

export const zapCreateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    availableTriggerId: z.string(), 
    triggerMetadata: z.any().optional(), 
    actions: z.array(z.object({
        availableActionId: z.string(), 
        actionMetadata: z.any().optional(),
    }))
})


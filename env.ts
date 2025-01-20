import { z } from 'zod';

const EnvSchema = z.object({
    // EXAMPLE_API_KEY: z.string().min(1),
});

export const env = EnvSchema.parse({
    // EXAMPLE_API_KEY: process.env.EXAMPLE_API_KEY,
});

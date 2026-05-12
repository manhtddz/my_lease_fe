import { z } from 'zod';

const domain = 'user';

export const userSchema = z.object({
    email: z
        .string()
        .min(1, `${domain}.email.required`)
        .email(`${domain}.email.invalid`),

    password: z
        .string()
        .min(1, `${domain}.password.required`)
            .min(6, `${domain}.password.min`),
    name: z.string().min(1, `${domain}.name.required`),
    status: z.string().min(1, `${domain}.status.required`).refine(value => value === '1' || value === '0', { message: `${domain}.status.invalid` }),
});

export type UserFormData = z.infer<typeof userSchema>;

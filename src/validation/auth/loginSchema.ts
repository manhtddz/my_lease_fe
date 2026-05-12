import { z } from 'zod';

const domain = 'login';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, `${domain}.email.required`)
        .email(`${domain}.email.invalid`),

    password: z
        .string()
        .min(1, `${domain}.password.required`)
        .min(6, `${domain}.password.min`)
});

export type LoginFormData = z.infer<typeof loginSchema>;

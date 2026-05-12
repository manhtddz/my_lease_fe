import { z } from 'zod';

const domain = 'tenant';

export const tenantSchema = z.object({
    phone_number: z
        .string()
        .min(1, `${domain}.phone_number.required`),
    id_card_number: z
        .string(),
    
    name: z.string().min(1, `${domain}.name.required`),
});

export type TenantFormData = z.infer<typeof tenantSchema>;

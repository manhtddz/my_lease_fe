import type { TFunction } from 'i18next';
import { z } from 'zod';

const domain = 'tenant';
export const tenantSchema = (t: TFunction) => {
    const f = (field: string) => t(`models.${domain}.${field}`);

    return z.object({
        name: z.string().min(1, t('validation.required', { field: f('name') })),
        phone_number: z.string().min(1, t('validation.required', { field: f('phone_number') })),
        id_card_number: z.string().min(1, t('validation.required', { field: f('id_card_number') })),
    });
};

export type TenantFormData = z.infer<ReturnType<typeof tenantSchema>>;

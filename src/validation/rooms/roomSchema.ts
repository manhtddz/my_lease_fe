import type { TFunction } from 'i18next';
import { z } from 'zod';
import { RoomType, type RoomTypeType } from '../../types/enums/rooms/RoomType';

const domain = 'room';
export const roomSchema = (t: TFunction) => {
    const f = (field: string) => t(`models.${domain}.${field}`);

    return z.object({
        room_number: z.string().min(1, t('validation.required', { field: f('room_number') })),
        floor: z.coerce.number()
            .refine(value => value !== 0, t('validation.required', { field: f('floor') })),
        room_type: z.enum(
            Object.values(RoomType) as [RoomTypeType, ...RoomTypeType[]],
            { message: t('validation.in', { field: f('room_type'), values: Object.values(RoomType).join(', ') }) }
        ),
        room_price: z.coerce.number()
            .refine(value => value !== 0, t('validation.required', { field: f('room_price') }))
            .refine(value => Number(value) > 0, { message: t('validation.min_value', { field: f('room_price'), min: 1 }) }),
        max_occupants: z.coerce.number()
            .refine(value => value !== 0, t('validation.required', { field: f('max_occupants') }))
            .refine(value => Number(value) > 0, { message: t('validation.min_value', { field: f('max_occupants'), min: 1 }) }),
    });
};

export type RoomFormData = z.infer<ReturnType<typeof roomSchema>>;

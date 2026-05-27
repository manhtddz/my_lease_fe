import type { TFunction } from 'i18next';
import { z } from 'zod';
import { RoomType, type RoomTypeType } from '../../types/enums/rooms/RoomType';
import { requiredNumberSchema } from '../../utils/form';

const domain = 'room';
export const roomSchema = (t: TFunction) => {
    const f = (field: string) => t(`models.${domain}.${field}`);

    return z.object({
        room_number: z.string().min(1, t('validation.required', { field: f('room_number') })),

        // Sử dụng hàm helper an toàn, hết lỗi TypeScript
        floor: requiredNumberSchema(f('floor')),

        room_type: z.enum(
            Object.values(RoomType) as [RoomTypeType, ...RoomTypeType[]],
            { message: t('validation.in', { field: f('room_type'), values: Object.values(RoomType).join(', ') }) }
        ),

        room_price: requiredNumberSchema(f('room_price'))
            .refine(value => value > 0, { message: t('validation.min_value', { field: f('room_price'), min: 1 }) }),

        max_occupants: requiredNumberSchema(f('max_occupants'))
            .refine(value => value > 0, { message: t('validation.min_value', { field: f('max_occupants'), min: 1 }) }),
    });
};

export type RoomFormData = z.infer<ReturnType<typeof roomSchema>>;

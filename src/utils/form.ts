import z, { ZodError } from 'zod';
import { t, type TFunction } from 'i18next';

export const extractValidationErrors = (error: ZodError) => {
    const formattedErrors: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;

        if (!formattedErrors[fieldName]) {
            formattedErrors[fieldName] = [];
        }

        formattedErrors[fieldName].push(issue.message);
    });

    return formattedErrors;
};

export const extractValidationServerErrors = (
    serverErrors: Record<string, string[]>,
    t: TFunction,
    model: string
): Record<string, string[]> => {
    const translatedErrors: Record<string, string[]> = {};

    Object.keys(serverErrors).forEach((field) => {
        translatedErrors[field] = serverErrors[field].map((errorCode) => {
            const lastDot = errorCode.lastIndexOf('.');
            const fieldFromCode = errorCode.slice(0, lastDot).replaceAll(' ', '_');
            const rulePart = errorCode.slice(lastDot + 1);

            const [rule, ...params] = rulePart.split(':');
            const label = t(`models.${model}.${fieldFromCode}`, { defaultValue: fieldFromCode });

            const interpolations: Record<string, string> = { field: label };
            if (rule === 'min' && params[0]) {
                interpolations.length = params[0];
            }

            return t(`validation.${rule}`, { ...interpolations, defaultValue: errorCode });
        });
    });

    return translatedErrors;
};

export const requiredNumberSchema = (fieldName: string) =>
    z.preprocess(
        (val) => {
            if (val === undefined || val === null || val === '') {
                return '';
            }
            return String(val);
        },
        z.string()
            .min(1, t('validation.required', { field: fieldName }))
            .transform((val, ctx) => {
                const parsed = Number(val);

                // TRỌNG TÂM: Khi người dùng gõ chữ, điều kiện này sẽ khớp
                if (isNaN(parsed)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        // Trả về câu thông báo định dạng số không hợp lệ do bạn dịch
                        message: t('validation.invalid_number', { field: fieldName }),
                    });
                    return z.NEVER;
                }
                return parsed;
            })
    );


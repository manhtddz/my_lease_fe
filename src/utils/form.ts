import { ZodError } from 'zod';
import type { TFunction } from 'i18next';

export const extractValidationErrors = (error: ZodError, t: TFunction) => {
    const formattedErrors: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;

        if (!formattedErrors[fieldName]) {
            formattedErrors[fieldName] = [];
        }

        // Gom tất cả các thông số của Zod (min, max, exact, expected, v.v.)
        // và thêm các alias (bí danh) nếu bạn muốn dùng tên khác trong JSON
        const options = {
            ...issue,
            length: (issue as any).minimum ?? (issue as any).maximum ?? (issue as any).limit,
            min: (issue as any).minimum,
            max: (issue as any).maximum,
        };

        const translatedMessage = t(`validation.${issue.message}`, options);
        formattedErrors[fieldName].push(translatedMessage);
    });

    return formattedErrors;
};

export const extractValidationServerErrors = (serverErrors: Record<string, string[]>, t: TFunction) => {
    const translatedErrors: Record<string, string[]> = {};

    Object.keys(serverErrors).forEach((field) => {
        translatedErrors[field] = serverErrors[field].map((errorCode) => {
            return t(`validation.${errorCode}`); 
        });
    });

    return translatedErrors;
};



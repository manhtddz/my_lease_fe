import { ZodError } from 'zod';
import type { TFunction } from 'i18next';

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



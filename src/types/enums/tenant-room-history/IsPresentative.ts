export const IsPresentative = {// 0. No, 1. Yes
    FALSE: '0',
    TRUE: '1',
} as const;

export const IsPresentativeEnum = {
    [IsPresentative.FALSE]: `enums.tenant_room_history.is_presentative.${IsPresentative.FALSE}`,
    [IsPresentative.TRUE]: `enums.tenant_room_history.is_presentative.${IsPresentative.TRUE}`,
} as const;

// Create a type from the object values
export type IsPresentativeType = (typeof IsPresentative)[keyof typeof IsPresentative];
export type IsPresentativeEnumType = (typeof IsPresentativeEnum)[keyof typeof IsPresentativeEnum];
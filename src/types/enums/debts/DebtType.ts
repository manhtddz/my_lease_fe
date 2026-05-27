export const DebtTypeValue = {
    OWNER_DEBT: '1',
    TENANT_DEBT: '2',
} as const

export const DebtTypeEnum = {
    [DebtTypeValue.OWNER_DEBT]: `enums.debt.debt_type.${DebtTypeValue.OWNER_DEBT}`,
    [DebtTypeValue.TENANT_DEBT]: `enums.debt.debt_type.${DebtTypeValue.TENANT_DEBT}`,
} as const

export type DebtTypeValueType = (typeof DebtTypeValue)[keyof typeof DebtTypeValue]
export type DebtTypeEnumType = (typeof DebtTypeEnum)[keyof typeof DebtTypeEnum]

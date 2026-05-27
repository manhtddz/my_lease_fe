export const DebtStatus = {
    CANCELLED: '0',
    ACTIVE: '1',
} as const

export const DebtStatusEnum = {
    [DebtStatus.CANCELLED]: `enums.debt.status.${DebtStatus.CANCELLED}`,
    [DebtStatus.ACTIVE]: `enums.debt.status.${DebtStatus.ACTIVE}`,
} as const

export type DebtStatusType = (typeof DebtStatus)[keyof typeof DebtStatus]
export type DebtStatusEnumType = (typeof DebtStatusEnum)[keyof typeof DebtStatusEnum]

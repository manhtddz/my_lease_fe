export const UserStatus = {
    ACTIVE: '1',
    INACTIVE: '0',
} as const;

export const UserStatusEnum = {
    [UserStatus.ACTIVE]: `enums.user.status.${UserStatus.ACTIVE}`,
    [UserStatus.INACTIVE]: `enums.user.status.${UserStatus.INACTIVE}`,
} as const;

// Create a type from the object values
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];
export type UserStatusEnumType = (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
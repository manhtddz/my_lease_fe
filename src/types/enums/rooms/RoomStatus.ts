export const RoomStatus = {// 0. Available, 1. Partially Occupied, 2. Fully Occupied, 3. Reserved
    AVAILABLE: '0',
    PARTIALLY_OCCUPIED: '1',
    FULLY_OCCUPIED: '2',
    RESERVED: '3',
} as const;

export const RoomStatusEnum = {
    [RoomStatus.AVAILABLE]: `enums.room.status.${RoomStatus.AVAILABLE}`,
    [RoomStatus.PARTIALLY_OCCUPIED]: `enums.room.status.${RoomStatus.PARTIALLY_OCCUPIED}`,
    [RoomStatus.FULLY_OCCUPIED]: `enums.room.status.${RoomStatus.FULLY_OCCUPIED}`,
    [RoomStatus.RESERVED]: `enums.room.status.${RoomStatus.RESERVED}`,
} as const;

// Create a type from the object values
export type RoomStatusType = (typeof RoomStatus)[keyof typeof RoomStatus];
export type RoomStatusEnumType = (typeof RoomStatusEnum)[keyof typeof RoomStatusEnum];
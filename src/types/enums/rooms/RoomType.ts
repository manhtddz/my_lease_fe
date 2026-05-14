export const RoomType = {// 1. Single, 2. Double, 3. Triple, 4. Quadruple, 5. Family
    SINGLE: '1',
    DOUBLE: '2',
    TRIPLE: '3',
    QUADRUPLE: '4',
    FAMILY: '5',
} as const;

export const RoomTypeEnum = {
    [RoomType.SINGLE]: `enums.room.room_type.${RoomType.SINGLE}`,
    [RoomType.DOUBLE]: `enums.room.room_type.${RoomType.DOUBLE}`,
    [RoomType.TRIPLE]: `enums.room.room_type.${RoomType.TRIPLE}`,
    [RoomType.QUADRUPLE]: `enums.room.room_type.${RoomType.QUADRUPLE}`,
    [RoomType.FAMILY]: `enums.room.room_type.${RoomType.FAMILY}`,
} as const;

// Create a type from the object values
export type RoomTypeType = (typeof RoomType)[keyof typeof RoomType];
export type RoomTypeEnumType = (typeof RoomTypeEnum)[keyof typeof RoomTypeEnum];
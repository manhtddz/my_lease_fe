export type Room = {
    id: number;
    room_number: string;
    floor: string;
    room_type: string;
    room_price: string;
    max_occupants: string;
    status: string;
};

export type RoomDataListParams = {
    page: number;
    size: number;
    sort_by: string;
    sort_dir: string;
    room_number?: string;
    room_type?: string[];
    status?: string[];
}

export type RoomDataListResult = {
    data: Room[]
    total: number
    current_page: number
    per_page: number
}

export type RoomSearchForm = {
    room_number: string;
    room_type: string[];
    status: string[];
};
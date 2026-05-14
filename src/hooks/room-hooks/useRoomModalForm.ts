import { useState } from 'react'
import { roomApi } from '../../services/room'
import type { Room } from '../../types/RoomType'

export function useRoomModalForm() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRoom, setEditingRoom] = useState<Room | null>(null) // null = tạo mới


    const openCreateModal = () => {
        setEditingRoom(null)
        setIsModalOpen(true)
    }

    const openEditModal = async (id: number) => {
        const room = await roomApi.getRoomById(id)
        setEditingRoom(room)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setEditingRoom(null)
        setIsModalOpen(false)
    }

    return {
        isModalOpen, openCreateModal,
        openEditModal, closeModal,
        editingRoom,
    }
}
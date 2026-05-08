import { useState } from "react"

export function useModalDeleteConfirm() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(0)

    function handleDelete(id: number) {
        setDeleteId(id)
        setIsDeleteModalOpen(true)
    }

    return {
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deleteId,
        setDeleteId,
        handleDelete,
    }
}

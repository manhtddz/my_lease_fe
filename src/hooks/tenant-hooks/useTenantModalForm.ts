import { useState } from 'react'
import { tenantApi } from '../../services/tenant'
import type { Tenant } from '../../types/TenantType'

export function useTenantModalForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)

  const openCreateModal = () => {
    setEditingTenant(null)
    setIsModalOpen(true)
  }

  const openEditModal = async (id: number, prefillData?: Tenant) => {
    const tenant = prefillData ?? await tenantApi.getTenantById(id)
    setEditingTenant(tenant)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setEditingTenant(null)
    setIsModalOpen(false)
  }

  return {
    isModalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
    editingTenant,
  }
}

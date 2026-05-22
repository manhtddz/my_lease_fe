import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useState } from 'react'

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <main className="flex-grow-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
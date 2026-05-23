import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] font-sans print:bg-white relative">
      <Outlet />
    </div>
  )
}

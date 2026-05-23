import { Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function Layout() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] font-sans print:bg-white relative">
      <header className="absolute top-4 right-4 z-50 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="text-muted-foreground hover:text-foreground rounded-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </header>
      <Outlet />
    </div>
  )
}

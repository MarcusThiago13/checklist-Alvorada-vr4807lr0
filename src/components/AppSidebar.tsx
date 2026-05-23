import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Star, CheckCircle, Trash2, Plus, Folder } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import useChecklistStore from '@/stores/useChecklistStore'
import { useState } from 'react'
import { CreateChecklistModal } from '@/components/CreateChecklistModal'

export function AppSidebar() {
  const { pathname } = useLocation()
  const { checklists } = useChecklistStore()
  const [isModalOpen, setModalOpen] = useState(false)

  const categories = Array.from(
    new Set(checklists.filter((c) => !c.isDeleted).map((c) => c.category)),
  )

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4 border-b bg-sidebar">
          <div className="flex items-center gap-2 font-bold text-xl text-primary mb-2">
            <CheckCircle className="h-6 w-6" />
            <span>ChecklistApp</span>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="w-full mt-2 flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nova Lista
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'}>
                  <Link to="/">
                    <LayoutDashboard /> Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/starred'}>
                  <Link to="/starred">
                    <Star /> Favoritos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/completed'}>
                  <Link to="/completed">
                    <CheckCircle /> Concluídos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/trash'}>
                  <Link to="/trash">
                    <Trash2 /> Lixeira
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {categories.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Categorias</SidebarGroupLabel>
              <SidebarMenu>
                {categories.map((cat) => (
                  <SidebarMenuItem key={cat}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/category/${encodeURIComponent(cat)}`}
                    >
                      <Link to={`/category/${encodeURIComponent(cat)}`}>
                        <Folder /> {cat}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>
      <CreateChecklistModal open={isModalOpen} onOpenChange={setModalOpen} />
    </>
  )
}

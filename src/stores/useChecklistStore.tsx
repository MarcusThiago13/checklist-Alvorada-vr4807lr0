import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Checklist, Task, Priority, Category } from '@/lib/types'
import { toast } from '@/hooks/use-toast'

interface StoreState {
  checklists: Checklist[]
  addChecklist: (title: string, category: Category) => void
  updateChecklist: (id: string, updates: Partial<Checklist>) => void
  deleteChecklist: (id: string) => void
  addTask: (checklistId: string, text: string, priority?: Priority) => void
  updateTask: (checklistId: string, taskId: string, updates: Partial<Task>) => void
  deleteTask: (checklistId: string, taskId: string) => void
  toggleStar: (id: string) => void
  moveToTrash: (id: string) => void
  restoreFromTrash: (id: string) => void
}

const mockData: Checklist[] = [
  {
    id: '1',
    title: 'Lançamento do Projeto',
    category: 'Trabalho',
    starred: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    tasks: [
      { id: 't1', text: 'Revisar PRs pendentes', completed: true, priority: 'high' },
      { id: 't2', text: 'Deploy para staging', completed: false, priority: 'high' },
      { id: 't3', text: 'Atualizar documentação', completed: false, priority: 'medium' },
    ],
  },
  {
    id: '2',
    title: 'Supermercado',
    category: 'Compras',
    starred: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    tasks: [
      { id: 't4', text: 'Leite de amêndoas', completed: false, priority: 'low' },
      { id: 't5', text: 'Café em grãos', completed: true, priority: 'medium' },
    ],
  },
]

const ChecklistContext = createContext<StoreState | undefined>(undefined)

export const ChecklistProvider = ({ children }: { children: ReactNode }) => {
  const [checklists, setChecklists] = useState<Checklist[]>(mockData)

  const addChecklist = (title: string, category: Category) => {
    const newChecklist: Checklist = {
      id: Math.random().toString(36).substring(7),
      title,
      category,
      tasks: [],
      starred: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    }
    setChecklists([newChecklist, ...checklists])
    toast({ title: 'Lista criada', description: `A lista "${title}" foi criada com sucesso.` })
  }

  const updateChecklist = (id: string, updates: Partial<Checklist>) => {
    setChecklists(checklists.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteChecklist = (id: string) => {
    setChecklists(checklists.filter((c) => c.id !== id))
    toast({ title: 'Lista excluída permanentemente' })
  }

  const moveToTrash = (id: string) => {
    updateChecklist(id, { isDeleted: true })
    toast({ title: 'Lista movida para a lixeira' })
  }

  const restoreFromTrash = (id: string) => {
    updateChecklist(id, { isDeleted: false })
    toast({ title: 'Lista restaurada' })
  }

  const toggleStar = (id: string) => {
    const list = checklists.find((c) => c.id === id)
    if (list) {
      updateChecklist(id, { starred: !list.starred })
    }
  }

  const addTask = (checklistId: string, text: string, priority: Priority = 'medium') => {
    setChecklists(
      checklists.map((c) => {
        if (c.id === checklistId) {
          return {
            ...c,
            tasks: [
              ...c.tasks,
              { id: Math.random().toString(36).substring(7), text, completed: false, priority },
            ],
          }
        }
        return c
      }),
    )
    toast({ title: 'Tarefa adicionada', description: text })
  }

  const updateTask = (checklistId: string, taskId: string, updates: Partial<Task>) => {
    setChecklists(
      checklists.map((c) => {
        if (c.id === checklistId) {
          return {
            ...c,
            tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
          }
        }
        return c
      }),
    )
  }

  const deleteTask = (checklistId: string, taskId: string) => {
    setChecklists(
      checklists.map((c) => {
        if (c.id === checklistId) {
          return {
            ...c,
            tasks: c.tasks.filter((t) => t.id !== taskId),
          }
        }
        return c
      }),
    )
    toast({ title: 'Tarefa removida' })
  }

  const value = {
    checklists,
    addChecklist,
    updateChecklist,
    deleteChecklist,
    addTask,
    updateTask,
    deleteTask,
    toggleStar,
    moveToTrash,
    restoreFromTrash,
  }

  return <ChecklistContext.Provider value={value}>{children}</ChecklistContext.Provider>
}

export default function useChecklistStore() {
  const context = useContext(ChecklistContext)
  if (!context) throw new Error('useChecklistStore must be used within ChecklistProvider')
  return context
}

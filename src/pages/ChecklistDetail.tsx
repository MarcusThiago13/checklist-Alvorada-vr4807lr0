import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useChecklistStore from '@/stores/useChecklistStore'
import { Priority } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trash2, Plus, GripVertical, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ChecklistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { checklists, updateChecklist, moveToTrash, addTask, updateTask, deleteTask } =
    useChecklistStore()
  const list = checklists.find((c) => c.id === id)

  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <img
          src="https://img.usecurling.com/p/200/200?q=magnifying%20glass&color=blue"
          alt="Not found"
          className="w-32 h-32 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-bold mb-2 text-slate-800">Lista não encontrada</h2>
        <p className="text-muted-foreground mb-6">
          A lista que você procura foi excluída ou não existe.
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início
        </Button>
      </div>
    )
  }

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTask.trim()) {
      addTask(list.id, newTask)
      setNewTask('')
    }
  }

  const filteredTasks = useMemo(() => {
    return list.tasks.filter((t) => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
  }, [list.tasks, filter])

  const priorityColors = {
    low: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400',
    medium:
      'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400',
    high: 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400',
  }

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-20">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="-ml-4 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
        <div className="flex-1 min-w-0 pl-2">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-slate-100">
              {list.category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground font-medium">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
              Criado em {new Date(list.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
          <Input
            value={list.title}
            onChange={(e) => updateChecklist(list.id, { title: e.target.value })}
            className="text-2xl md:text-3xl font-bold border-transparent bg-transparent px-0 h-auto py-1 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:ring-1 shadow-none w-full max-w-2xl"
          />
        </div>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 self-start shrink-0"
          onClick={() => {
            moveToTrash(list.id)
            navigate('/')
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Excluir Lista
        </Button>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative max-w-2xl">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleAddTask}
              placeholder="Adicionar nova tarefa... (Pressione Enter)"
              className="pl-4 pr-12 py-6 text-base rounded-xl bg-white shadow-sm border-slate-200 focus-visible:ring-primary/40"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10 rounded-lg"
              onClick={() => {
                if (newTask.trim()) {
                  addTask(list.id, newTask)
                  setNewTask('')
                }
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 gap-3 bg-slate-50/30">
          <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-auto">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(f)}
                className={cn(
                  'capitalize rounded-md flex-1 sm:flex-none h-8',
                  filter !== f && 'text-slate-500 hover:text-slate-900',
                )}
              >
                {f === 'all' ? 'Todas' : f === 'active' ? 'Ativas' : 'Concluídas'}
              </Button>
            ))}
          </div>
          <div className="text-sm font-medium text-slate-500 shrink-0">
            {list.tasks.filter((t) => t.completed).length} de {list.tasks.length} concluídas
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Nenhuma tarefa encontrada neste filtro.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <GripVertical className="h-5 w-5 text-slate-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block shrink-0" />
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) =>
                    updateTask(list.id, task.id, { completed: checked === true })
                  }
                  className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 shrink-0 shadow-sm"
                />
                <Input
                  value={task.text}
                  onChange={(e) => updateTask(list.id, task.id, { text: e.target.value })}
                  className={cn(
                    'flex-1 border-transparent bg-transparent shadow-none px-2 focus-visible:ring-1 text-base transition-all',
                    task.completed && 'line-through text-slate-400',
                  )}
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      variant="outline"
                      className={cn(
                        'cursor-pointer shrink-0 ml-2 shadow-sm transition-colors',
                        priorityColors[task.priority],
                      )}
                    >
                      {priorityLabels[task.priority]}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={() => updateTask(list.id, task.id, { priority: 'low' })}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Baixa
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTask(list.id, task.id, { priority: 'medium' })}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        Média
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTask(list.id, task.id, { priority: 'high' })}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        Alta
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                  onClick={() => deleteTask(list.id, task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

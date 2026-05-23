import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useChecklistStore from '@/stores/useChecklistStore'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Index() {
  const { checklists, addChecklist, toggleStar, restoreFromTrash } = useChecklistStore()
  const [quickAdd, setQuickAdd] = useState('')
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isStarred = pathname === '/starred'
  const isCompleted = pathname === '/completed'
  const isTrash = pathname === '/trash'
  const isCategory = pathname.startsWith('/category/')
  const categoryName = isCategory ? decodeURIComponent(pathname.split('/')[2]) : null

  const activeLists = checklists.filter((c) => {
    if (isTrash) return c.isDeleted
    if (c.isDeleted) return false

    if (isStarred) return c.starred
    if (isCategory) return c.category === categoryName
    if (isCompleted) {
      return c.tasks.length > 0 && c.tasks.every((t) => t.completed)
    }
    return true
  })

  const getTitle = () => {
    if (isStarred) return 'Favoritos ⭐'
    if (isCompleted) return 'Concluídos ✅'
    if (isTrash) return 'Lixeira 🗑️'
    if (isCategory) return `Categoria: ${categoryName} 📁`
    return 'Olá, Usuário 👋'
  }

  const allActiveForProgress = checklists.filter((c) => !c.isDeleted)
  const totalTasks = allActiveForProgress.reduce((acc, c) => acc + c.tasks.length, 0)
  const completedTasks = allActiveForProgress.reduce(
    (acc, c) => acc + c.tasks.filter((t) => t.completed).length,
    0,
  )
  const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  const handleQuickAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quickAdd.trim()) {
      addChecklist(quickAdd, 'Geral')
      setQuickAdd('')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <section className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          {!isTrash && !isStarred && !isCompleted && !isCategory && (
            <p className="text-muted-foreground mt-1 text-lg">
              Aqui está o resumo das suas listas hoje.
            </p>
          )}
        </div>

        {!isTrash && (
          <Card className="w-full md:w-72 bg-primary text-primary-foreground border-none shadow-lg shrink-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium opacity-90">Progresso Geral</div>
                <div className="text-3xl font-bold">{overallProgress}%</div>
              </div>
              <Progress
                value={overallProgress}
                className="h-2 bg-primary-foreground/20 [&>div]:bg-white"
              />
              <div className="mt-4 text-sm opacity-90 font-medium">
                {allActiveForProgress.length} listas ativas
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        {!isTrash && !isCompleted && (
          <div className="relative max-w-lg mb-8 group">
            <Input
              value={quickAdd}
              onChange={(e) => setQuickAdd(e.target.value)}
              onKeyDown={handleQuickAdd}
              placeholder="Criar nova lista rapidamente... (Pressione Enter)"
              className="pl-4 pr-12 py-6 text-base rounded-xl shadow-sm border-slate-200 focus-visible:ring-primary/50 transition-all bg-white"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:bg-primary/10"
              onClick={() => {
                if (quickAdd.trim()) {
                  addChecklist(quickAdd, 'Geral')
                  setQuickAdd('')
                }
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        )}

        {activeLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-slide-up bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200">
            <img
              src="https://img.usecurling.com/p/300/300?q=empty%20box&color=blue"
              alt="Vazio"
              className="w-48 h-48 object-contain opacity-70 mix-blend-multiply dark:mix-blend-normal mb-6"
            />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              Nenhuma lista encontrada
            </h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              {isTrash
                ? 'Sua lixeira está vazia.'
                : 'Crie sua primeira lista de tarefas para começar a se organizar.'}
            </p>
            {!isTrash && (
              <Button onClick={() => document.querySelector('input')?.focus()}>
                Criar primeira lista
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeLists.map((list) => {
              const listTotal = list.tasks.length
              const listCompleted = list.tasks.filter((t) => t.completed).length
              const progress = listTotal === 0 ? 0 : Math.round((listCompleted / listTotal) * 100)

              return (
                <Card
                  key={list.id}
                  className={cn(
                    'group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-800 flex flex-col',
                    isTrash && 'opacity-70 hover:opacity-100 grayscale hover:grayscale-0',
                  )}
                  onClick={() => !isTrash && navigate(`/checklist/${list.id}`)}
                >
                  <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 relative">
                    <div className="flex-1 pr-6">
                      <Badge
                        variant="secondary"
                        className="mb-3 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 shadow-sm"
                      >
                        {list.category}
                      </Badge>
                      <CardTitle className="text-lg leading-tight line-clamp-2">
                        {list.title}
                      </CardTitle>
                    </div>
                    {!isTrash && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'absolute right-3 top-3 h-8 w-8 rounded-full',
                          list.starred
                            ? 'text-amber-400 hover:text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                            : 'text-slate-300 hover:text-slate-400 opacity-0 group-hover:opacity-100',
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStar(list.id)
                        }}
                      >
                        <Star className={cn('h-4 w-4', list.starred && 'fill-current')} />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="pb-4 flex-1 flex flex-col justify-end">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-500 mb-2 mt-4">
                      <span>
                        {listCompleted}/{listTotal} tarefas
                      </span>
                      <span className={cn(progress === 100 && 'text-emerald-500')}>
                        {progress}%
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className={cn('h-1.5', progress === 100 && '[&>div]:bg-emerald-500')}
                    />
                  </CardContent>

                  {isTrash && (
                    <CardFooter className="pt-0 pb-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          restoreFromTrash(list.id)
                        }}
                      >
                        Restaurar Lista
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

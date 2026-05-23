export type Priority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  text: string
  completed: boolean
  priority: Priority
}

export type Category = 'Trabalho' | 'Pessoal' | 'Compras' | 'Estudos' | string

export type Checklist = {
  id: string
  title: string
  category: Category
  tasks: Task[]
  starred: boolean
  isDeleted: boolean
  createdAt: string
}

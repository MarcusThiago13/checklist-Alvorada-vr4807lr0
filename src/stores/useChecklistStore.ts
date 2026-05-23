import { useState, useCallback, useRef } from 'react'
import pb from '@/lib/pocketbase/client'
import { Status, ItemState } from '@/lib/checklist-data'
import { toast } from '@/hooks/use-toast'

export default function useChecklistStore() {
  const [items, setItems] = useState<Record<string, ItemState>>({})
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const loadItems = useCallback(async () => {
    if (!pb.authStore.isValid || !pb.authStore.record?.id) return

    try {
      const filter = `user_id = "${pb.authStore.record.id}"`
      const records = await pb.collection('checklist_state').getFullList({ filter })

      const newItems: Record<string, ItemState> = {}
      for (const rec of records) {
        newItems[rec.item_id] = {
          id: rec.id,
          item_id: rec.item_id,
          status: rec.status as Status,
          responsavel: rec.responsavel || '',
          anotacao: rec.anotacao || '',
        }
      }
      setItems(newItems)
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao carregar dados.',
      })
    }
  }, [])

  const updateItem = useCallback((itemId: string, data: Partial<ItemState>) => {
    setItems((prev) => {
      const current = prev[itemId] || {
        item_id: itemId,
        status: 'pendente',
        responsavel: '',
        anotacao: '',
      }

      const updated = { ...current, ...data }

      if (debounceTimers.current[itemId]) {
        clearTimeout(debounceTimers.current[itemId])
      }

      debounceTimers.current[itemId] = setTimeout(async () => {
        if (!pb.authStore.isValid) return

        try {
          const payload = {
            item_id: itemId,
            status: updated.status,
            responsavel: updated.responsavel,
            anotacao: updated.anotacao,
          }

          const res = await pb.send('/backend/v1/checklist-state', {
            method: 'POST',
            body: JSON.stringify(payload),
          })

          setItems((s) => ({
            ...s,
            [itemId]: { ...s[itemId], id: res.id },
          }))
        } catch (e) {
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Falha ao salvar marcação. Tente novamente.',
          })
        }
      }, 1000)

      return {
        ...prev,
        [itemId]: updated,
      }
    })
  }, [])

  const resetAll = useCallback(async () => {
    if (
      !window.confirm(
        'Tem certeza que deseja resetar todas as marcações? Isso não pode ser desfeito.',
      )
    ) {
      return
    }

    Object.values(debounceTimers.current).forEach(clearTimeout)
    debounceTimers.current = {}

    setItems({})

    if (!pb.authStore.isValid) return

    try {
      await pb.send('/backend/v1/checklist-state/reset', {
        method: 'POST',
      })
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao salvar marcação. Tente novamente.',
      })
    }
  }, [])

  return { items, loadItems, updateItem, resetAll }
}

import { useState, useCallback, useRef } from 'react'
import pb from '@/lib/pocketbase/client'
import { Status, ItemState } from '@/lib/checklist-data'

export default function useChecklistStore() {
  const [items, setItems] = useState<Record<string, ItemState>>({})
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const loadItems = useCallback(async () => {
    if (!pb.authStore.isValid) return

    try {
      const records = await pb.collection('checklist_state').getFullList({
        filter: `user_id = "${pb.authStore.record?.id}"`,
      })

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
      console.error('Failed to load items', e)
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
        try {
          const { id, ...saveData } = updated
          const payload = {
            ...saveData,
            user_id: pb.authStore.record?.id,
          }

          if (id) {
            await pb.collection('checklist_state').update(id, payload)
          } else {
            try {
              const res = await pb.collection('checklist_state').create(payload)
              setItems((s) => ({
                ...s,
                [itemId]: { ...s[itemId], id: res.id },
              }))
            } catch (err: any) {
              try {
                const existing = await pb
                  .collection('checklist_state')
                  .getFirstListItem(`user_id="${pb.authStore.record?.id}" && item_id="${itemId}"`)
                if (existing) {
                  await pb.collection('checklist_state').update(existing.id, payload)
                  setItems((s) => ({
                    ...s,
                    [itemId]: { ...s[itemId], id: existing.id },
                  }))
                }
              } catch {
                /* intentionally ignored */
              }
            }
          }
        } catch (e) {
          console.error('Failed to save item', e)
        }
      }, 2000)

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

    try {
      const records = await pb.collection('checklist_state').getFullList({
        filter: `user_id = "${pb.authStore.record?.id}"`,
      })

      for (const r of records) {
        await pb.collection('checklist_state').delete(r.id)
      }
    } catch (e) {
      console.error('Failed to reset items', e)
    }
  }, [])

  return { items, loadItems, updateItem, resetAll }
}

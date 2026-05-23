import { useState, useCallback, useRef } from 'react'
import pb from '@/lib/pocketbase/client'
import { Status, ItemState } from '@/lib/checklist-data'

export default function useChecklistStore() {
  const [items, setItems] = useState<Record<string, ItemState>>({})
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const initializeGuest = async () => {
    if (pb.authStore.isValid) return
    try {
      const randomId = Math.random().toString(36).slice(2, 10)
      const email = `guest_${randomId}@guest.local`
      const password = `Guest${randomId}1!`
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        privacy_accepted: true,
      })
      await pb.collection('users').authWithPassword(email, password)
    } catch (e) {
      console.error('Guest login failed', e)
    }
  }

  const loadItems = useCallback(async () => {
    await initializeGuest()

    try {
      let filter = `user_id = ""`
      if (pb.authStore.isValid) {
        filter = `user_id = "${pb.authStore.record?.id}"`
      }

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
          await initializeGuest()
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
          console.error('Failed to save item', e)
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

    try {
      await initializeGuest()
      await pb.send('/backend/v1/checklist-state/reset', {
        method: 'POST',
      })
    } catch (e) {
      console.error('Failed to reset items', e)
    }
  }, [])

  return { items, loadItems, updateItem, resetAll }
}

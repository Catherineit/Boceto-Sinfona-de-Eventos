import { useEffect, useState } from 'react'
import api from '../api'

export function useCarritoEventos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  const fetchCarritoEventos = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await api.get('/carrito/eventos')
      setItems(res.data?.items || [])
    } catch (err) {
      console.error('Error fetching carrito eventos:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchCarritoEventos()
  }, [token])

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/carrito/eventos/${itemId}`)
      setItems(items.filter(i => i.id !== itemId))
    } catch (err) {
      console.error('Error removing item:', err)
    }
  }

  const updateQuantity = async (itemId, cantidad) => {
    if (cantidad < 1) {
      removeItem(itemId)
      return
    }
    try {
      await api.put(`/carrito/eventos/${itemId}`, { cantidad })
      setItems(items.map(i => i.id === itemId ? { ...i, cantidad } : i))
    } catch (err) {
      console.error('Error updating quantity:', err)
    }
  }

  return { items, loading, removeItem, updateQuantity, refetch: fetchCarritoEventos }
}

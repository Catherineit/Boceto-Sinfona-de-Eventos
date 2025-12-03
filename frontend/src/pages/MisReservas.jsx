import React, { useEffect, useState } from 'react'
import api from '../api'

export default function MisReservas(){
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/reservas')
        setReservas(res.data.reservas || [])
      } catch (err) {
        console.error(err)
        const { showToast } = await import('../utils/toast')
        showToast('Error cargando reservas', 'danger')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function handleCancel(id) {
    const ok = window.confirm('¿Deseas cancelar esta reserva?')
    if (!ok) return
    setCancelling(id)
    try {
      await api.delete(`/reservas/${id}`)
      setReservas(prev => prev.filter(r => r.id_reserva !== id))
      const { showToast } = await import('../utils/toast')
      showToast('Reserva cancelada', 'success')
    } catch (err) {
      console.error(err)
      const { showToast } = await import('../utils/toast')
      const msg = err?.response?.data?.message || 'Error cancelando reserva'
      showToast(msg, 'danger')
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return <div>Cargando reservas...</div>

  return (
    <div>
      <h3>Mis Reservas</h3>
      {reservas.length === 0 && <p>No tienes reservas.</p>}
      <ul className="list-group">
        {reservas.map(r => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={r.id_reserva}>
            <div>
              <strong>{r.titulo}</strong>
              <div className="text-muted small">Evento: {new Date(r.fecha_evento).toLocaleString()}</div>
              <div className="text-muted small">Reservado: {new Date(r.fecha_reserva).toLocaleString()}</div>
              <div className="badge bg-secondary mt-1">Estado: {r.estado}</div>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(r.id_reserva)} disabled={cancelling === r.id_reserva}>
                {cancelling === r.id_reserva ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : 'Cancelar'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

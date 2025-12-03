import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ModalReserva from './ModalReserva'
import api from '../api'

export default function CardEvento({ evento }){
  const [showReserva, setShowReserva] = useState(false)
  const [localEvento, setLocalEvento] = useState(evento)

  const disponibles = Math.max(0, localEvento.capacidad - (localEvento.aforo_actual || 0))
  const porcentaje = localEvento.capacidad ? (disponibles / localEvento.capacidad) * 100 : 0
  const badgeClass = disponibles === 0 ? 'bg-danger' : porcentaje <= 30 ? 'bg-warning text-dark' : 'bg-success'

  import('../utils/toast').then(m => {})

  const handleConfirm = async ({ cantidad = 1 }) => {
    try {
      await api.post('/reservas', { id_evento: localEvento.id_evento, cantidad })
      // optimistic update
      setLocalEvento(prev => ({ ...prev, aforo_actual: (prev.aforo_actual || 0) + cantidad }))
      const { showToast } = await import('../utils/toast')
      showToast('Reserva creada correctamente', { type: 'success' })
    } catch (err) {
      console.error(err)
      const { showToast } = await import('../utils/toast')
      showToast(err.response?.data?.message || 'Error al crear reserva', { type: 'danger' })
    }
    setShowReserva(false)
  }

  return (
    <div className="card h-100">
      <div style={{height:160,overflow:'hidden'}}>
        <img src={localEvento.imagenUrl || '/assets/placeholder.png'} alt={localEvento.titulo} className="card-img-top" style={{objectFit:'cover',width:'100%',height:'100%'}} />
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{localEvento.titulo}</h5>
        <p className="card-text text-muted small">{localEvento.descripcion ? localEvento.descripcion.slice(0,80) : ''}</p>
        <p className="mt-auto mb-1 small text-muted">{new Date(localEvento.fecha).toLocaleDateString()} · {localEvento.ubicacion || ''}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className={`badge ${badgeClass}`}>{disponibles === 0 ? 'Agotado' : `${disponibles} disponibles`}</span>
          <div>
            <Link to={`/eventos/${localEvento.id_evento}`} className="btn btn-link btn-sm me-2">Ver más</Link>
            <button className="btn btn-primary btn-sm" disabled={disponibles===0} onClick={()=>setShowReserva(true)}>Reservar</button>
          </div>
        </div>
      </div>
      <ModalReserva evento={localEvento} show={showReserva} onClose={()=>setShowReserva(false)} onConfirm={handleConfirm} />
    </div>
  )
}

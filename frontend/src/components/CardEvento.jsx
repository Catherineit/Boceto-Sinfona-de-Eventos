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
        <div className="event-meta mb-2" style={{fontSize:'0.9rem',color:'var(--muted)'}}>{new Date(localEvento.fecha).toLocaleDateString(undefined, { day:'numeric', month:'long', year:'numeric' })}</div>
        <div className="event-meta" style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.9rem',color:'var(--muted)'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{color:'var(--muted)'}}>
            <path d="M8 0a5 5 0 0 0-5 5c0 3.75 5 11 5 11s5-7.25 5-11a5 5 0 0 0-5-5zm0 7.5A2.5 2.5 0 1 1 8 2.5a2.5 2.5 0 0 1 0 5z"/>
          </svg>
          <span>{localEvento.ubicacion}</span>
        </div>
        <p className="card-text text-muted small mt-3">{localEvento.descripcion ? localEvento.descripcion.slice(0,100) : ''}</p>
        <div className="mt-auto mb-3 event-meta" style={{fontSize:'0.9rem',color:'var(--muted)'}}>Capacidad: {localEvento.capacidad} personas</div>
        <div className="event-footer d-flex justify-content-start gap-2">
          <Link to={`/eventos/${localEvento.id_evento}`} className="btn btn-primary btn-sm" style={{borderRadius:'999px',padding:'0.45rem 0.9rem'}}>Ver más</Link>
          <button className="btn btn-primary btn-sm" disabled={disponibles===0} onClick={()=>setShowReserva(true)} style={{borderRadius:'999px',padding:'0.45rem 0.9rem'}}>Reservar</button>
        </div>
      </div>
      <ModalReserva evento={localEvento} show={showReserva} onClose={()=>setShowReserva(false)} onConfirm={handleConfirm} />
    </div>
  )
}

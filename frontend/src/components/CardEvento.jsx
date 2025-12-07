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
    <div className="card h-100" style={{border:'none',borderRadius:16,overflow:'hidden',boxShadow:'0 4px 20px rgba(16,24,40,0.08)',transition:'all 0.3s ease'}}>
      <div style={{height:180,overflow:'hidden',position:'relative'}}>
        <img src={localEvento.imagenUrl || '/assets/placeholder.png'} alt={localEvento.titulo} className="card-img-top" style={{objectFit:'cover',width:'100%',height:'100%',transition:'transform 0.3s ease'}} onMouseOver={e=>e.target.style.transform='scale(1.05)'} onMouseOut={e=>e.target.style.transform='scale(1)'} />
        <div style={{position:'absolute',top:12,right:12,background:badgeClass.replace('bg-',''),padding:'6px 12px',borderRadius:999,display:'flex',alignItems:'center',gap:6,boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>
          <i className={`fas ${disponibles===0?'fa-times-circle':porcentaje<=30?'fa-exclamation-circle':'fa-check-circle'}`} style={{color:'white',fontSize:'0.85rem'}}></i>
          <span style={{color:'white',fontSize:'0.75rem',fontWeight:'600'}}>{disponibles} cupos</span>
        </div>
      </div>
      <div className="card-body d-flex flex-column" style={{padding:20}}>
        <h5 className="card-title mb-3" style={{fontWeight:'700',fontSize:'1.15rem',color:'#1a1a1a'}}>{localEvento.titulo}</h5>
        <div className="d-flex flex-column gap-2 mb-3">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,background:'rgba(30,111,191,0.1)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <i className="fas fa-calendar-alt" style={{color:'var(--primary)',fontSize:'0.9rem'}}></i>
            </div>
            <span style={{fontSize:'0.9rem',color:'#555'}}>{new Date(localEvento.fecha).toLocaleDateString(undefined, { day:'numeric', month:'long', year:'numeric' })}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,background:'rgba(30,111,191,0.1)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <i className="fas fa-map-marker-alt" style={{color:'var(--primary)',fontSize:'0.9rem'}}></i>
            </div>
            <span style={{fontSize:'0.9rem',color:'#555'}}>{localEvento.ubicacion}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,background:'rgba(30,111,191,0.1)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <i className="fas fa-users" style={{color:'var(--primary)',fontSize:'0.9rem'}}></i>
            </div>
            <span style={{fontSize:'0.9rem',color:'#555'}}>Capacidad: {localEvento.capacidad} personas</span>
          </div>
        </div>
        <p className="card-text text-muted small" style={{lineHeight:1.6}}>{localEvento.descripcion ? localEvento.descripcion.slice(0,100)+'...' : ''}</p>
        <div className="mt-auto d-flex gap-2 pt-3" style={{borderTop:'1px solid #f0f0f0'}}>
          <Link to={`/eventos/${localEvento.id_evento}`} className="btn btn-outline-primary btn-sm flex-fill" style={{borderRadius:999,padding:'10px 0',fontWeight:'600',border:'2px solid var(--primary)'}}><i className="fas fa-info-circle me-1"></i>Ver más</Link>
          <button className="btn btn-primary btn-sm flex-fill" disabled={disponibles===0} onClick={()=>setShowReserva(true)} style={{borderRadius:999,padding:'10px 0',fontWeight:'600',boxShadow:'0 4px 12px rgba(30,111,191,0.3)'}}><i className="fas fa-ticket-alt me-1"></i>Reservar</button>
        </div>
      </div>
      <ModalReserva evento={localEvento} show={showReserva} onClose={()=>setShowReserva(false)} onConfirm={handleConfirm} />
    </div>
  )
}

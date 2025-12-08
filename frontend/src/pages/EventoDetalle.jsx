import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import ModalReserva from '../components/ModalReserva'
import eventosData from '../data/events'

export default function EventoDetalle(){
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [showReserva, setShowReserva] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const fallback = eventosData.find(e => String(e.id_evento) === String(id)) || null
      try {
        const res = await api.get(`/eventos/${id}`)
        if (res?.data?.evento) {
          setEvento(res.data.evento)
        } else {
          setEvento(fallback)
        }
      } catch (err) {
        console.error(err)
        setEvento(fallback)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const reservar = async ({ cantidad = 1 } = {}) => {
    setMessage(null)
    try {
      const res = await api.post('/reservas', { id_evento: Number(id), cantidad })
      setMessage({ type: 'success', text: `Reserva creada (id=${res.data.id_reserva})` })
      // actualizar aforo localmente
      setEvento(prev => ({ ...prev, aforo_actual: (prev.aforo_actual || 0) + cantidad }))
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Error al reservar' })
    }
  }

  if (loading) return <div className="container py-5 text-center">Cargando...</div>
  if (!evento) return <div className="container py-5 text-center">Evento no encontrado</div>

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <div style={{borderRadius:16,overflow:'hidden',boxShadow:'0 10px 30px rgba(16,24,40,0.12)'}}>
            <img src={evento.imagenUrl || '/assets/placeholder.png'} alt={evento.titulo} style={{width:'100%',height:'100%',objectFit:'cover'}} />
          </div>
        </div>
        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">{evento.titulo}</h2>
          <p className="text-muted" style={{lineHeight:1.7}}>{evento.descripcion}</p>
          <div className="d-flex flex-column gap-2 my-3">
            <div><i className="fas fa-calendar-alt me-2 text-primary"></i>{new Date(evento.fecha).toLocaleDateString(undefined, { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
            <div><i className="fas fa-map-marker-alt me-2 text-primary"></i>{evento.ubicacion}</div>
            <div><i className="fas fa-users me-2 text-primary"></i>Aforo: {evento.aforo_actual || 0} / {evento.capacidad}</div>
          </div>
          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          <button className="btn btn-primary" onClick={()=>setShowReserva(true)}><i className="fas fa-ticket-alt me-2"></i>Reservar</button>
        </div>
      </div>

      <ModalReserva evento={evento} show={showReserva} onClose={()=>setShowReserva(false)} onConfirm={async (data)=>{
        await reservar({ cantidad: data.cantidad })
        setShowReserva(false)
      }} />
    </div>
  )
}

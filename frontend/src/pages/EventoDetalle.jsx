import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import ModalReserva from '../components/ModalReserva'
import { showToast } from '../utils/toast'
import eventosData from '../data/events'

export default function EventoDetalle(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [showReserva, setShowReserva] = useState(false)
  const isAuth = Boolean(localStorage.getItem('token'))

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

  const agregarAlCarrito = async () => {
    navigate('/contacto')
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
          
          <div className="d-flex align-items-center gap-3 mb-4" style={{background:'rgba(30,111,191,0.1)',padding:'16px',borderRadius:12}}>
            <i className="fas fa-tag text-primary" style={{fontSize:'1.3rem'}}></i>
            <div>
              <small className="text-muted d-block">Precio del evento</small>
              <h4 className="mb-0 fw-bold text-primary">${(evento.precio || 950000).toLocaleString()}</h4>
            </div>
          </div>

          <div className="d-flex flex-column gap-2 my-3">
            <div><i className="fas fa-map-marker-alt me-2 text-primary"></i>{evento.ubicacion}</div>
            <div><i className="fas fa-users me-2 text-primary"></i>Aforo disponible: {Math.max(0, (evento.capacidad || 0) - (evento.aforo_actual || 0))} / {evento.capacidad} personas</div>
          </div>

          <div className="alert alert-info small" style={{borderRadius:12,border:'none',background:'rgba(30,111,191,0.1)',color:'#1a1a1a'}}>
            <i className="fas fa-info-circle me-2" style={{color:'var(--primary)'}}></i>
            <strong>Nota:</strong> La cantidad de invitados no afecta el precio total del evento. El precio mostrado es fijo.
          </div>

          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          <div className="d-flex gap-2">
            <button className="btn btn-primary flex-grow-1" onClick={()=>setShowReserva(true)}><i className="fas fa-ticket-alt me-2"></i>Reservar ahora</button>
            <button className="btn btn-outline-primary flex-grow-1" onClick={agregarAlCarrito}><i className="fas fa-phone me-2"></i>Contáctanos</button>
          </div>
        </div>
      </div>

      <ModalReserva evento={evento} show={showReserva} onClose={()=>setShowReserva(false)} onConfirm={async (data)=>{
        await reservar({ cantidad: data.cantidad })
        setShowReserva(false)
      }} />
    </div>
  )
}

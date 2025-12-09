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

  const reservar = async ({ cantidad = 1, fechaReserva } = {}) => {
    setMessage(null)
    if (!isAuth) {
      setMessage({ type: 'danger', text: 'Debes iniciar sesión para reservar' })
      setTimeout(() => navigate('/login'), 1500)
      return
    }
    try {
      const res = await api.post('/reservas', { 
        id_evento: Number(id), 
        cantidad,
        fechaReserva
      })
      setMessage({ type: 'success', text: '✅ Reserva creada exitosamente. Ve a "Mis Reservas" para verla.' })
      // Navegar a Mis Reservas después de 2 segundos
      setTimeout(() => navigate('/mis-reservas'), 2000)
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
    <div className="evento-detalle" style={{background:'#f8f9fa',paddingTop:32,paddingBottom:32}}>
      <div className="container">
        {/* Imagen Grande */}
        <div className="mb-4" style={{borderRadius:16,overflow:'hidden',boxShadow:'0 10px 30px rgba(16,24,40,0.12)',height:400}}>
          <img src={evento.imagenUrl || '/assets/placeholder.png'} alt={evento.titulo} style={{width:'100%',height:'100%',objectFit:'cover'}} />
        </div>

        {/* Contenido Principal */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="bg-white" style={{padding:32,borderRadius:16,boxShadow:'0 2px 10px rgba(16,24,40,0.08)'}}>
              <h1 className="fw-bold mb-4" style={{fontSize:'2.5rem',color:'#1a1a1a'}}>{evento.titulo}</h1>
              
              {/* Detalles rápidos */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div style={{background:'rgba(30,111,191,0.08)',padding:16,borderRadius:12}}>
                    <small className="text-muted d-block mb-2">👥 Capacidad máxima</small>
                    <strong style={{color:'#1a1a1a',fontSize:'1.1rem'}}>{evento.capacidad} personas</strong>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div style={{background:'rgba(30,111,191,0.08)',padding:16,borderRadius:12,marginBottom:24}}>
                <i className="fas fa-map-marker-alt" style={{color:'var(--primary)',marginRight:12,fontSize:'1.2rem'}}></i>
                <strong style={{color:'#1a1a1a'}}>{evento.ubicacion}</strong>
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <h4 className="fw-bold mb-3" style={{color:'#1a1a1a'}}>Descripción del evento</h4>
                <p style={{lineHeight:1.8,color:'#555',fontSize:'1.05rem'}}>{evento.descripcion}</p>
              </div>

              {/* Precio */}
              <div style={{background:'linear-gradient(135deg, rgba(30,111,191,0.1) 0%, rgba(30,111,191,0.05) 100%)',padding:24,borderRadius:16,marginBottom:24,border:'2px solid rgba(30,111,191,0.2)'}}>
                <small className="text-muted d-block mb-2">💰 Precio del evento</small>
                <h2 className="mb-0 fw-bold text-primary" style={{fontSize:'2rem'}}>${(evento.precio || 950000).toLocaleString()}</h2>
              </div>

              {/* Nota importante */}
              <div className="alert" style={{background:'rgba(13,110,253,0.1)',border:'1px solid rgba(30,111,191,0.3)',borderRadius:12,color:'#1a1a1a',marginBottom:24}}>
                <i className="fas fa-info-circle" style={{color:'var(--primary)',marginRight:12}}></i>
                <strong>Nota importante:</strong> La cantidad de invitados no afecta el precio total del evento. El precio mostrado es fijo.
              </div>

              {message && <div className={`alert alert-${message.type} mb-3`} style={{borderRadius:12}}>{message.text}</div>}
            </div>
          </div>

          {/* Panel lateral */}
          <div className="col-lg-4">
            <div className="bg-white" style={{padding:24,borderRadius:16,boxShadow:'0 2px 10px rgba(16,24,40,0.08)',position:'sticky',top:20}}>
              <h4 className="fw-bold mb-4" style={{color:'#1a1a1a'}}>¿Interesado en este evento?</h4>
              <div className="d-flex flex-column gap-3">
                <button className="btn btn-primary" onClick={()=>setShowReserva(true)} style={{padding:'12px 24px',fontSize:'1.05rem',fontWeight:600,borderRadius:8}}>
                  <i className="fas fa-ticket-alt me-2"></i>Reservar ahora
                </button>
                <button className="btn btn-outline-primary" onClick={agregarAlCarrito} style={{padding:'12px 24px',fontSize:'1.05rem',fontWeight:600,borderRadius:8}}>
                  <i className="fas fa-phone me-2"></i>Contáctanos
                </button>
              </div>

              <hr className="my-4" />

              <div style={{fontSize:'0.9rem',color:'#666'}}>
                <p className="mb-2"><i className="fas fa-check-circle" style={{color:'var(--primary)',marginRight:8}}></i>Reserva segura y confirmada</p>
                <p className="mb-2"><i className="fas fa-check-circle" style={{color:'var(--primary)',marginRight:8}}></i>Soporte disponible 24/7</p>
                <p><i className="fas fa-check-circle" style={{color:'var(--primary)',marginRight:8}}></i>Cancela sin penalización</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalReserva evento={evento} show={showReserva} onClose={()=>setShowReserva(false)} onConfirm={async (data)=>{
        await reservar({ cantidad: data.cantidad, fechaReserva: data.fechaReserva })
        setShowReserva(false)
      }} />
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import ModalReserva from '../components/ModalReserva'

export default function EventoDetalle(){
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [showReserva, setShowReserva] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/eventos/${id}`)
        setEvento(res.data.evento)
      } catch (err) {
        console.error(err)
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

  if (loading) return <div>Cargando...</div>
  if (!evento) return <div>Evento no encontrado</div>

  return (
    <div>
      <h3>{evento.titulo}</h3>
      <p>{evento.descripcion}</p>
      <p>Fecha: {new Date(evento.fecha).toLocaleString()}</p>
      <p>Cupo: {evento.aforo_actual}/{evento.capacidad}</p>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <button className="btn btn-primary" onClick={()=>setShowReserva(true)}>Reservar</button>
      <ModalReserva evento={evento} show={showReserva} onClose={()=>setShowReserva(false)} onConfirm={async (data)=>{
        await reservar({ cantidad: data.cantidad })
        setShowReserva(false)
      }} />
    </div>
  )
}

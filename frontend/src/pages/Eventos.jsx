import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import CardEvento from '../components/CardEvento'

export default function Eventos(){
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/eventos')
        setEventos(res.data.eventos || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div>Cargando eventos...</div>

  return (
    <div>
      <h3>Eventos</h3>
      <div className="row">
        {eventos.map(ev => (
          <div key={ev.id_evento} className="col-md-4 mb-3">
            <CardEvento evento={ev} />
          </div>
        ))}
      </div>
    </div>
  )
}

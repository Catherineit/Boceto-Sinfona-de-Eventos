import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Eventos(){
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/eventos')
        setEventos(res.data.eventos || [])
      } catch (err) {
        console.error('Error fetching eventos', err)
        setEventos([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return eventos
    return eventos.filter(e => (e.titulo || '').toLowerCase().includes(q) || (e.descripcion || '').toLowerCase().includes(q) || (e.ubicacion || '').toLowerCase().includes(q))
  }, [eventos, query])

  // Mock data to show the mockup when there are no events from API
  const sampleEvents = [
    { id_evento: 's1', titulo: 'Taller de Marketing Digital', fecha: '2025-05-05', ubicacion: 'Centro de Innovación Puente Alto', capacidad: 50, imagenUrl: '/assets/placeholder.png' },
    { id_evento: 's2', titulo: 'Conferencia de Tecnología', fecha: '2025-05-12', ubicacion: 'Centro de Innovación Puente Alto', capacidad: 50, imagenUrl: '/assets/placeholder.png' },
    { id_evento: 's3', titulo: 'Charla sobre Emprendimiento', fecha: '2025-05-20', ubicacion: 'Centro de Innovación Puente Alto', capacidad: 50, imagenUrl: '/assets/placeholder.png' }
  ]

  const display = (!loading && filtered.length === 0) ? sampleEvents : filtered

  return (
    <div>
      <div className="events-mockup">
        <div className="events-hero text-center">
          <h1 className="display-4 fw-bold">Eventos</h1>
          <div className="page-subtitle">Explora actividades, talleres y experiencias — reserva tu lugar al instante.</div>

          <div className="mt-4" style={{display:'flex',justifyContent:'center'}}>
            <div style={{maxWidth:820, width:'100%'}}>
              <div className="search-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16" style={{color:'var(--primary)'}}>
                  <path d="M11 6a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
                  <path d="M12.9 11.3a6.5 6.5 0 1 0-1.6 1.6l3.85 3.85 1.6-1.6-3.85-3.85z"/>
                </svg>
                <input type="search" className="search-input" placeholder="Buscar eventos" value={query} onChange={e=>setQuery(e.target.value)} />
                <button className="search-button" onClick={()=>{}} aria-label="Buscar">Buscar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <h4 className="mb-4">Nuestros eventos</h4>

        {loading ? (
          <div>Cargando eventos...</div>
        ) : (
          <div className="row events-grid">
            {display.map(ev => {
              const disponibles = Math.max(0, (ev.capacidad || 0) - (ev.aforo_actual || 0))
              return (
                <div key={ev.id_evento} className="col-sm-6 col-md-4 mb-4 d-flex">
                  <div className="card event-card w-100">
                    <div style={{height:160,overflow:'hidden'}}>
                      <img src={ev.imagenUrl || '/assets/placeholder.png'} alt={ev.titulo} className="card-img-top" style={{objectFit:'cover',width:'100%',height:'100%'}} />
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{ev.titulo}</h5>
                      <div className="event-meta mb-2">{new Date(ev.fecha).toLocaleDateString(undefined, { day:'numeric', month:'long', year:'numeric' })}</div>
                      <div className="event-meta" style={{display:'flex',alignItems:'center',gap:8}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{color:'var(--muted)'}}>
                          <path d="M8 0a5 5 0 0 0-5 5c0 3.75 5 11 5 11s5-7.25 5-11a5 5 0 0 0-5-5zm0 7.5A2.5 2.5 0 1 1 8 2.5a2.5 2.5 0 0 1 0 5z"/>
                        </svg>
                        <span>{ev.ubicacion}</span>
                      </div>

                      <div className="mt-auto mb-3 event-meta">{disponibles} cupos disponibles</div>

                      <div className="event-footer">
                        <Link to={`/eventos/${ev.id_evento}`} className="btn btn-primary">Ver más</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import CardEvento from '../components/CardEvento'

export default function Eventos(){
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return eventos
    return eventos.filter(e => (e.titulo || '').toLowerCase().includes(q) || (e.descripcion || '').toLowerCase().includes(q) || (e.ubicacion || '').toLowerCase().includes(q))
  }, [eventos, query])

  return (
    <div>
      <div className="events-mockup">
        <div className="events-hero text-center">
          <h1 className="display-4 fw-bold">Eventos</h1>
          <div className="page-subtitle">Explora actividades, talleres y experiencias — reserva tu lugar al instante.</div>

          <div className="mt-4" style={{display:'flex',justifyContent:'center'}}>
            <div style={{maxWidth:820, width:'100%'}}>
              <div className="search-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16" style={{color:'var(--primary)'}}>
                  <path d="M11 6a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
                  <path d="M12.9 11.3a6.5 6.5 0 1 0-1.6 1.6l3.85 3.85 1.6-1.6-3.85-3.85z"/>
                </svg>
                <input type="search" className="search-input" placeholder="Buscar eventos" value={query} onChange={e=>setQuery(e.target.value)} />
                <button className="search-button" onClick={()=>{}} aria-label="Buscar">Buscar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h4 className="mb-4">Nuestros eventos</h4>
        {loading ? <div>Cargando eventos...</div> : (
          <div className="row events-grid">
            {filtered.length === 0 && <div className="text-muted">No se encontraron eventos.</div>}
            {filtered.map(ev => (
              <div key={ev.id_evento} className="col-sm-6 col-md-4 mb-4 d-flex">
                <div className="w-100 event-card d-flex">
                  <CardEvento evento={ev} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import eventosData from '../data/events'

export default function Eventos(){
  const [query, setQuery] = useState('')

  const eventos = eventosData

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return eventos
    return eventos.filter(e => (
      (e.titulo || '').toLowerCase().includes(q) ||
      (e.descripcion || '').toLowerCase().includes(q) ||
      (e.ubicacion || '').toLowerCase().includes(q)
    ))
  }, [eventos, query])

  return (
    <div>
      <div className="events-mockup">
        <div className="events-hero text-center">
          <div className="mb-3" style={{display:'inline-flex',alignItems:'center',gap:12,background:'rgba(30,111,191,0.1)',padding:'8px 20px',borderRadius:999}}>
            <i className="fas fa-sparkles" style={{color:'var(--primary)',fontSize:'1.2rem'}}></i>
            <span style={{color:'var(--primary)',fontWeight:'600',fontSize:'0.95rem'}}>DESCUBRE EXPERIENCIAS ÚNICAS</span>
          </div>
          <h1 className="display-4 fw-bold mb-3">Eventos Especiales</h1>
          <div className="page-subtitle mb-4"><i className="fas fa-calendar-check me-2" style={{color:'var(--primary)'}}></i>Explora actividades, talleres y experiencias — reserva tu lugar al instante.</div>

          <div className="mt-4" style={{display:'flex',justifyContent:'center'}}>
            <div style={{maxWidth:820, width:'100%'}}>
              <div className="search-card" style={{position:'relative',boxShadow:'0 8px 32px rgba(30,111,191,0.15)'}}>
                <i className="fas fa-search" style={{position:'absolute',left:24,top:'50%',transform:'translateY(-50%)',color:'var(--primary)',fontSize:'1.1rem',zIndex:2}}></i>
                <input type="search" className="search-input" placeholder="Buscar por nombre, ubicación o descripción..." value={query} onChange={e=>setQuery(e.target.value)} style={{paddingLeft:56}} />
                {query && (
                  <button onClick={()=>setQuery('')} style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#999',cursor:'pointer',fontSize:'1.2rem'}}>
                    <i className="fas fa-times-circle"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="mb-1 fw-bold"><i className="fas fa-calendar-alt me-2" style={{color:'var(--primary)'}}></i>Nuestros eventos</h4>
            <p className="text-muted mb-0 small">{filtered.length} evento{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="row events-grid">
          {filtered.map(ev => {
            const disponibles = Math.max(0, ev.capacidad - (ev.aforo_actual || 0))
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

                    <p className="mt-3" style={{color:'var(--muted)'}}>{ev.descripcion}</p>

                    <div className="mt-auto mb-3 event-meta">Capacidad: {disponibles} personas</div>

                    <div className="event-footer">
                      <Link to={`/eventos/${ev.id_evento}`} className="btn btn-primary">Ver más</Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


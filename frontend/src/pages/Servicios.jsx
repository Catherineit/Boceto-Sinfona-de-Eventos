import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Servicios(){
  const [query, setQuery] = useState('')

  const services = [
    { id: 's-garzones', title: 'Servicio de Garzones', desc: 'Personal de servicio para tu evento', price: 'Consultar precio', icon: '/assets/icons/waiter.svg' },
    { id: 's-juegos', title: 'Juegos infantiles', desc: 'Diversión para los más pequeños', price: '$80.000', icon: '/assets/icons/duck.svg' },
    { id: 's-deco', title: 'Decoración temática', desc: 'Decora tu evento según tu estilo', price: 'Consultar precio', icon: '/assets/icons/decor.svg' },
    { id: 's-animador', title: 'Animador', desc: 'Animación para tu evento', price: '$120.000', icon: '/assets/icons/host.svg' },
    { id: 's-karaoke', title: 'Karaoke', desc: 'Canta tus canciones favoritas', price: '$60.000', icon: '/assets/icons/mic.svg' }
  ]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return services
    return services.filter(s => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q))
  }, [query])

  return (
    <div>
      <div className="events-mockup">
        <div className="events-hero text-center">
          <h1 className="display-4 fw-bold">Servicios</h1>
          <div className="page-subtitle">Elige los servicios complementarios para tu evento</div>

          <div className="mt-4" style={{display:'flex',justifyContent:'center'}}>
            <div style={{maxWidth:820, width:'100%'}}>
              <div className="search-card">
                <input type="search" className="search-input" placeholder="Buscar servicios" value={query} onChange={e=>setQuery(e.target.value)} />
                <span className="search-icon" aria-hidden>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 6a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
                    <path d="M12.9 11.3a6.5 6.5 0 1 0-1.6 1.6l3.85 3.85 1.6-1.6-3.85-3.85z"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <h4 className="mb-4">Servicios disponibles</h4>
        <div className="row services-grid">
          {filtered.map(s => (
            <div key={s.id} className="col-sm-6 col-md-4 mb-4 d-flex">
              <div className="card service-card w-100 text-center">
                <div style={{paddingTop:22}}>
                  {s.icon ? (
                    <img src={s.icon} alt={s.title} style={{width:72,height:72,objectFit:'contain'}} />
                  ) : (
                    <div style={{width:72,height:72,background:'#eef6ff',borderRadius:12,margin:'0 auto'}} />
                  )}
                </div>
                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="card-title mt-2">{s.title}</h5>
                  <p className="card-text small text-muted" style={{minHeight:40}}>{s.desc}</p>
                  <div className="mb-3" style={{color:'var(--muted)'}}>{s.price}</div>
                  <div className="mt-auto">
                    <button className="btn btn-primary">Agregar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

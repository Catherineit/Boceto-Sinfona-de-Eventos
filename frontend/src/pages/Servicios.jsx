import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Servicios(){
  const [query, setQuery] = useState('')

  const services = [
    { id: 's-garzones', title: 'Servicio de Garzones', desc: 'Personal de servicio para tu evento', price: 'Consultar precio', icon: '/assets/images/Garzon.jpg' },
    { id: 's-juegos', title: 'Juegos infantiles', desc: 'Diversión para los más pequeños', price: '$80.000', icon: '/assets/images/Inflables.jpg' },
    { id: 's-deco', title: 'Decoración temática', desc: 'Decora tu evento según tu estilo', price: 'Consultar precio', icon: '/assets/images/DecoracionTematica.jpg' },
    { id: 's-animador', title: 'Animador', desc: 'Animación para tu evento', price: '$120.000', icon: '/assets/images/Animador.jpg' },
    { id: 's-karaoke', title: 'Karaoke', desc: 'Canta tus canciones favoritas', price: '$60.000', icon: '/assets/images/Karaoke.jpg' }
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
          <div className="mb-3" style={{display:'inline-flex',alignItems:'center',gap:12,background:'rgba(30,111,191,0.1)',padding:'8px 20px',borderRadius:999}}>
            <i className="fas fa-concierge-bell" style={{color:'var(--primary)',fontSize:'1.2rem'}}></i>
            <span style={{color:'var(--primary)',fontWeight:'600',fontSize:'0.95rem'}}>SERVICIOS PREMIUM</span>
          </div>
          <h1 className="display-4 fw-bold mb-3">Servicios Adicionales</h1>
          <div className="page-subtitle mb-4"><i className="fas fa-star me-2" style={{color:'var(--primary)'}}></i>Elige los servicios complementarios para hacer tu evento inolvidable</div>

          <div className="mt-4" style={{display:'flex',justifyContent:'center'}}>
            <div style={{maxWidth:820, width:'100%'}}>
              <div className="search-card" style={{position:'relative',boxShadow:'0 8px 32px rgba(30,111,191,0.15)'}}>
                <i className="fas fa-search" style={{position:'absolute',left:24,top:'50%',transform:'translateY(-50%)',color:'var(--primary)',fontSize:'1.1rem',zIndex:2}}></i>
                <input type="search" className="search-input" placeholder="Buscar servicios..." value={query} onChange={e=>setQuery(e.target.value)} style={{paddingLeft:56}} />
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
        <div className="mb-4">
          <h4 className="fw-bold mb-1"><i className="fas fa-list-check me-2" style={{color:'var(--primary)'}}></i>Servicios disponibles</h4>
          <p className="text-muted mb-0 small">{filtered.length} servicio{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="row services-grid">
          {filtered.map(s => (
            <div key={s.id} className="col-sm-6 col-lg-4 mb-4 d-flex">
              <div className="card service-card w-100" style={{border:'none',borderRadius:16,overflow:'hidden',boxShadow:'0 4px 20px rgba(16,24,40,0.08)',transition:'all 0.3s ease'}}>
                <div style={{paddingTop:0,overflow:'hidden',height:200,position:'relative'}}>
                  {s.icon ? (
                    <img src={s.icon} alt={s.title} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.3s ease'}} onMouseOver={e=>e.target.style.transform='scale(1.05)'} onMouseOut={e=>e.target.style.transform='scale(1)'} />
                  ) : (
                    <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg, #eef6ff, #d4e8ff)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <i className="fas fa-image" style={{fontSize:'3rem',color:'#ccc'}}></i>
                    </div>
                  )}
                  <div style={{position:'absolute',top:12,right:12,background:'rgba(255,255,255,0.95)',padding:'6px 12px',borderRadius:999,boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>
                    <i className="fas fa-star" style={{color:'#ffc107',fontSize:'0.85rem',marginRight:4}}></i>
                    <span style={{fontSize:'0.75rem',fontWeight:'600',color:'#333'}}>Premium</span>
                  </div>
                </div>
                <div className="card-body d-flex flex-column align-items-center text-center" style={{padding:24}}>
                  <h5 className="card-title mt-2 mb-3" style={{fontWeight:'700',fontSize:'1.15rem',color:'#1a1a1a'}}>{s.title}</h5>
                  <p className="card-text small text-muted mb-3" style={{lineHeight:1.6,minHeight:45}}>{s.desc}</p>
                  <div className="mb-3 d-flex align-items-center justify-content-center gap-2" style={{background:'rgba(30,111,191,0.1)',padding:'10px 20px',borderRadius:999,width:'fit-content'}}>
                    <i className="fas fa-tag" style={{color:'var(--primary)',fontSize:'0.9rem'}}></i>
                    <span style={{color:'var(--primary)',fontWeight:'700',fontSize:'1.05rem'}}>{s.price}</span>
                  </div>
                  <div className="mt-auto w-100">
                    <button className="btn btn-primary w-100" style={{borderRadius:999,padding:'12px 0',fontWeight:'600',boxShadow:'0 4px 12px rgba(30,111,191,0.3)',transition:'all 0.3s ease'}}><i className="fas fa-plus-circle me-2"></i>Agregar al evento</button>
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

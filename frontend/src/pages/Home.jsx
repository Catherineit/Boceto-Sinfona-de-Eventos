import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CarouselHome from '../components/CarouselHome'
import CardEvento from '../components/CardEvento'
import api from '../api'
import fallbackEvents from '../data/events'

export default function Home(){
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/eventos')
        const serverEvents = (res && res.data && Array.isArray(res.data.eventos) && res.data.eventos.length > 0)
          ? res.data.eventos
          : fallbackEvents
        setEvents(serverEvents)
      } catch (err) {
        console.error(err)
        setEvents(fallbackEvents)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const slides = [
    { titulo: 'Gestiona tus eventos fácilmente', subtitulo: 'Crea, publica y controla aforos en segundos', ctaText: 'Ver Eventos', ctaLink: '/eventos', imagen: '/assets/images/Gestion.jpg' },
    { titulo: 'Reserva tu lugar al instante', subtitulo: 'Sistema de reservas en tiempo real', ctaText: 'Mis Reservas', ctaLink: '/mis-reservas', imagen: '/assets/images/Cliente.jpg' }
  ]

  // Los eventos destacados deben coincidir con los eventos definidos en `data/events.js`
  const featured = fallbackEvents.slice(0,4)

  return (
    <div>
      <div className="hero py-4">
        <div className="container">
          <CarouselHome slides={slides} />
          <div className="text-center mt-4 d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/eventos" className="btn btn-lg btn-primary" style={{borderRadius:999,padding:'14px 32px',fontWeight:'600',boxShadow:'0 6px 16px rgba(30,111,191,0.35)',transition:'all 0.3s ease'}}><i className="fas fa-calendar-alt me-2"></i>Ver Eventos Disponibles</Link>
            <Link to="/login" className="btn btn-lg" style={{borderRadius:999,padding:'14px 32px',fontWeight:'600',background:'transparent',border:'2px solid var(--primary)',color:'var(--primary)',transition:'all 0.3s ease'}}><i className="fas fa-sign-in-alt me-2"></i>Iniciar Sesión</Link>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <div className="d-inline-block px-4 py-2 mb-3" style={{background:'rgba(30,111,191,0.1)',borderRadius:999,fontSize:'0.8rem',fontWeight:'600',color:'var(--primary)',letterSpacing:'0.5px'}}>
            <i className="fas fa-rocket me-2"></i>CARACTERÍSTICAS PRINCIPALES
          </div>
          <h2 className="fw-bold mb-2">Todo lo que necesitas en un solo lugar</h2>
          <p className="text-muted mb-0">Gestiona tus eventos de manera profesional y eficiente</p>
        </div>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center" style={{border:'none',borderRadius:16,padding:24,boxShadow:'0 4px 20px rgba(16,24,40,0.08)',transition:'all 0.3s ease'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow='0 8px 30px rgba(16,24,40,0.12)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(16,24,40,0.08)'}}>
              <div style={{width:64,height:64,margin:'0 auto 20px',borderRadius:16,background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 20px rgba(102,126,234,0.3)'}}>
                <i className="fas fa-calendar-alt" style={{fontSize:'1.8rem',color:'#fff'}}></i>
              </div>
              <h6 className="fw-bold mb-2">Eventos Disponibles</h6>
              <p className="small text-muted mb-0">Consulta todas las actividades activas y próximas en tiempo real.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center" style={{border:'none',borderRadius:16,padding:24,boxShadow:'0 4px 20px rgba(16,24,40,0.08)',transition:'all 0.3s ease'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow='0 8px 30px rgba(16,24,40,0.12)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(16,24,40,0.08)'}}>
              <div style={{width:64,height:64,margin:'0 auto 20px',borderRadius:16,background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 20px rgba(240,147,251,0.3)'}}>
                <i className="fas fa-ticket-alt" style={{fontSize:'1.8rem',color:'#fff'}}></i>
              </div>
              <h6 className="fw-bold mb-2">Reservas en Línea</h6>
              <p className="small text-muted mb-0">Guarda tu cupo en segundos con un sistema automatizado.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center" style={{border:'none',borderRadius:16,padding:24,boxShadow:'0 4px 20px rgba(16,24,40,0.08)',transition:'all 0.3s ease'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow='0 8px 30px rgba(16,24,40,0.12)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(16,24,40,0.08)'}}>
              <div style={{width:64,height:64,margin:'0 auto 20px',borderRadius:16,background:'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 20px rgba(79,172,254,0.3)'}}>
                <i className="fas fa-user-circle" style={{fontSize:'1.8rem',color:'#fff'}}></i>
              </div>
              <h6 className="fw-bold mb-2">Cuenta Personal</h6>
              <p className="small text-muted mb-0">Visualiza tu historial de reservas y notificaciones.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center" style={{border:'none',borderRadius:16,padding:24,boxShadow:'0 4px 20px rgba(16,24,40,0.08)',transition:'all 0.3s ease'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow='0 8px 30px rgba(16,24,40,0.12)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(16,24,40,0.08)'}}>
              <div style={{width:64,height:64,margin:'0 auto 20px',borderRadius:16,background:'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 20px rgba(250,112,154,0.3)'}}>
                <i className="fas fa-cog" style={{fontSize:'1.8rem',color:'#fff'}}></i>
              </div>
              <h6 className="fw-bold mb-2">Panel Administrador</h6>
              <p className="small text-muted mb-0">Gestión de eventos, asistencia y reportes completos.</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="fw-bold mb-1"><i className="fas fa-star me-2" style={{color:'#ffc107'}}></i>Eventos Destacados</h3>
              <p className="text-muted mb-0 small">Los eventos más populares de la temporada</p>
            </div>
            <Link to="/eventos" className="btn btn-sm" style={{borderRadius:999,padding:'8px 20px',fontWeight:'600',background:'transparent',border:'2px solid var(--primary)',color:'var(--primary)',transition:'all 0.3s ease'}}>Ver todos <i className="fas fa-arrow-right ms-1"></i></Link>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="d-flex overflow-auto gap-3 py-3" style={{paddingBottom:8}}>
              {featured.length === 0 && <div className="text-muted">No hay eventos destacados</div>}
              {featured.map(e => (
                <div key={e.id_evento} style={{minWidth:280}}>
                  <CardEvento evento={e} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="my-5 py-5" style={{background:'linear-gradient(135deg, rgba(30,111,191,0.08), rgba(30,111,191,0.02))',borderRadius:20}}>
          <div className="container">
            <div className="text-center mb-5">
              <div className="d-inline-block px-4 py-2 mb-3" style={{background:'rgba(30,111,191,0.15)',borderRadius:999,fontSize:'0.8rem',fontWeight:'600',color:'var(--primary)',letterSpacing:'0.5px'}}>
                <i className="fas fa-thumbs-up me-2"></i>BENEFICIOS
              </div>
              <h2 className="fw-bold mb-2">Por qué elegir Sinfonía de Eventos</h2>
              <p className="text-muted mb-0">La solución completa para gestionar tus eventos de forma profesional</p>
            </div>
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <div className="list-group list-group-flush">
                  <div className="list-group-item border-0 px-0 py-3" style={{background:'transparent'}}>
                    <div className="d-flex align-items-start gap-3">
                      <div style={{width:48,height:48,background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(102,126,234,0.3)'}}>
                        <i className="fas fa-shield-alt" style={{fontSize:'1.3rem',color:'#fff'}}></i>
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">Plataforma segura y fácil de usar</h6>
                        <p className="mb-0 small text-muted">Interfaz intuitiva con máximos estándares de seguridad para proteger tus datos</p>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3" style={{background:'transparent'}}>
                    <div className="d-flex align-items-start gap-3">
                      <div style={{width:48,height:48,background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(240,147,251,0.3)'}}>
                        <i className="fas fa-bolt" style={{fontSize:'1.3rem',color:'#fff'}}></i>
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">Reservas en tiempo real</h6>
                        <p className="mb-0 small text-muted">Sistema instantáneo con actualización automática de cupos disponibles</p>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3" style={{background:'transparent'}}>
                    <div className="d-flex align-items-start gap-3">
                      <div style={{width:48,height:48,background:'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(79,172,254,0.3)'}}>
                        <i className="fas fa-sync-alt" style={{fontSize:'1.3rem',color:'#fff'}}></i>
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">Información actualizada de eventos</h6>
                        <p className="mb-0 small text-muted">Catálogo completo y siempre sincronizado con los últimos cambios</p>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3" style={{background:'transparent'}}>
                    <div className="d-flex align-items-start gap-3">
                      <div style={{width:48,height:48,background:'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(250,112,154,0.3)'}}>
                        <i className="fas fa-clock" style={{fontSize:'1.3rem',color:'#fff'}}></i>
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">Disponible 24/7</h6>
                        <p className="mb-0 small text-muted">Plataforma accesible en cualquier momento desde cualquier dispositivo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <div style={{borderRadius:20,overflow:'hidden',boxShadow:'0 12px 48px rgba(16,24,40,0.15)',transition:'transform 0.3s ease'}} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                  <img src="/assets/images/Asesoria.jpg" alt="beneficios" className="img-fluid" style={{width:'100%',height:'auto',display:'block'}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
          <div className="text-center mt-3">
            <Link to="/eventos" className="btn btn-lg btn-primary me-2">Ver Eventos Disponibles</Link>
            <Link to="/login" className="btn btn-outline-secondary btn-lg">Iniciar Sesión</Link>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card p-3 text-center">
              <div className="fs-3">🎉</div>
              <h6 className="mt-2">Eventos Disponibles</h6>
              <p className="small text-muted">Consulta todas las actividades activas y próximas.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 text-center">
              <div className="fs-3">📅</div>
              <h6 className="mt-2">Reservas en Línea</h6>
              <p className="small text-muted">Guarda tu cupo en segundos con un sistema automatizado.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 text-center">
              <div className="fs-3">👤</div>
              <h6 className="mt-2">Cuenta Personal</h6>
              <p className="small text-muted">Visualiza tu historial de reservas y notificaciones.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 text-center">
              <div className="fs-3">🛠️</div>
              <h6 className="mt-2">Panel Administrador</h6>
              <p className="small text-muted">Gestión de eventos, asistencia y reportes.</p>
            </div>
          </div>
        </div>

        <h3 className="mt-5">Eventos Destacados</h3>
        {loading ? <p>Cargando...</p> : (
          <div className="d-flex overflow-auto gap-3 py-3" style={{paddingBottom:8}}>
            {featured.length === 0 && <div className="text-muted">No hay eventos destacados</div>}
            {featured.map(e => (
              <div key={e.id_evento} style={{minWidth:260}}>
                <CardEvento evento={e} />
              </div>
            ))}
          </div>
        )}

        <div className="my-5 py-4" style={{background:'linear-gradient(135deg, rgba(30,111,191,0.08), rgba(30,111,191,0.02))',borderRadius:'16px'}}>
          <div className="container">
            <h3 className="mb-4 text-center fw-bold">Por qué usar la plataforma</h3>
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <div className="list-group list-group-flush">
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex align-items-center">
                      <div style={{width:40,height:40,background:'var(--primary)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginRight:16,color:'white',fontWeight:'bold'}}>✔</div>
                      <div>
                        <h6 className="mb-1" style={{fontWeight:'600'}}>Plataforma segura y fácil de usar</h6>
                        <p className="mb-0 small text-muted">Interfaz intuitiva con máximos estándares de seguridad</p>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex align-items-center">
                      <div style={{width:40,height:40,background:'var(--primary)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginRight:16,color:'white',fontWeight:'bold'}}>✔</div>
                      <div>
                        <h6 className="mb-1" style={{fontWeight:'600'}}>Reservas en tiempo real</h6>
                        <p className="mb-0 small text-muted">Sistema instantáneo con actualización de cupos</p>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex align-items-center">
                      <div style={{width:40,height:40,background:'var(--primary)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginRight:16,color:'white',fontWeight:'bold'}}>✔</div>
                      <div>
                        <h6 className="mb-1" style={{fontWeight:'600'}}>Información actualizada de eventos</h6>
                        <p className="mb-0 small text-muted">Catálogo completo y siempre sincronizado</p>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex align-items-center">
                      <div style={{width:40,height:40,background:'var(--primary)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginRight:16,color:'white',fontWeight:'bold'}}>✔</div>
                      <div>
                        <h6 className="mb-1" style={{fontWeight:'600'}}>Disponible 24/7</h6>
                        <p className="mb-0 small text-muted">Plataforma accesible en cualquier momento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <div style={{borderRadius:'16px',overflow:'hidden',boxShadow:'0 10px 40px rgba(16,24,40,0.12)',transition:'transform 0.3s ease'}}>
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

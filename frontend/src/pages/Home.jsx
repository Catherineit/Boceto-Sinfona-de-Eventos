import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CarouselHome from '../components/CarouselHome'
import CardEvento from '../components/CardEvento'
import api from '../api'

export default function Home(){
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/eventos')
        setEvents(res.data.eventos || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const slides = [
    { titulo: 'Gestiona tus eventos fácilmente', subtitulo: 'Crea, publica y controla aforos en segundos', ctaText: 'Ver Eventos', ctaLink: '/eventos', imagen: '/assets/hero1.jpg' },
    { titulo: 'Reserva tu lugar al instante', subtitulo: 'Sistema de reservas en tiempo real', ctaText: 'Mis Reservas', ctaLink: '/mis-reservas', imagen: '/assets/hero2.jpg' }
  ]

  const featured = events.slice(0,4)

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

        <h3 className="mt-5">Por qué usar la plataforma</h3>
        <div className="row mt-3">
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li>✔ Plataforma segura y fácil de usar</li>
              <li>✔ Reservas en tiempo real</li>
              <li>✔ Información actualizada de eventos</li>
              <li>✔ Disponible 24/7</li>
            </ul>
          </div>
          <div className="col-md-6 text-center">
            <img src="/assets/benefits.png" alt="beneficios" className="img-fluid" style={{maxHeight:220}} />
          </div>
        </div>
      </div>
    </div>
  )
}

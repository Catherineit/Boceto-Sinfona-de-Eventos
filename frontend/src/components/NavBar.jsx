import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NavBar(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  let user = null
  try { user = JSON.parse(localStorage.getItem('user') || 'null') } catch(e) { user = null }
  const isAdmin = user && (user.rol === 'admin' || user.role === 'admin')
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/assets/logo.png" alt="Logo" style={{height:32,marginRight:8}} />
          <span>Boceto</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/eventos">Eventos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/servicios">Servicios</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
            {token && <li className="nav-item"><Link className="nav-link" to="/mis-reservas">Mis Reservas</Link></li>}
            {isAdmin && <li className="nav-item"><Link className="nav-link" to="/admin">Panel Administrador</Link></li>}
          </ul>
          <ul className="navbar-nav">
            {token ? (
              <>
                <li className="nav-item"><button className="btn btn-link nav-link" onClick={logout}>Cerrar sesión</button></li>
              </>
            ) : (
              <li className="nav-item"><Link className="nav-link btn btn-outline-primary" to="/login">Iniciar Sesión</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

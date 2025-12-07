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
    <nav className="navbar navbar-expand-lg navbar-light sticky-top" style={{background:'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',boxShadow:'0 2px 15px rgba(30,111,191,0.08)',backdropFilter:'blur(10px)'}}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{gap:10}}>
          <div style={{width:50,height:50,borderRadius:'50%',overflow:'hidden',flexShrink:0,boxShadow:'0 4px 12px rgba(30,111,191,0.3)'}}>
            <img src="/assets/images/Logo.JPG" alt="Sinfonía de Eventos" style={{width:'100%',height:'100%',objectFit:'cover'}} />
          </div>
          <span style={{fontSize:'1.3rem',fontWeight:'700',background:'linear-gradient(135deg, var(--primary), #2e8fd6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Sinfonía de Eventos</span>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation" style={{boxShadow:'none'}}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto ms-lg-4" style={{gap:8}}>
            <li className="nav-item"><Link className="nav-link px-3" to="/" style={{borderRadius:8,transition:'all 0.3s'}}><i className="fas fa-home me-2"></i>Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link px-3" to="/eventos" style={{borderRadius:8,transition:'all 0.3s'}}><i className="fas fa-calendar-alt me-2"></i>Eventos</Link></li>
            <li className="nav-item"><Link className="nav-link px-3" to="/servicios" style={{borderRadius:8,transition:'all 0.3s'}}><i className="fas fa-concierge-bell me-2"></i>Servicios</Link></li>
            <li className="nav-item"><Link className="nav-link px-3" to="/contacto" style={{borderRadius:8,transition:'all 0.3s'}}><i className="fas fa-envelope me-2"></i>Contacto</Link></li>
            {token && <li className="nav-item"><Link className="nav-link px-3" to="/mis-reservas" style={{borderRadius:8,transition:'all 0.3s'}}><i className="fas fa-ticket-alt me-2"></i>Mis Reservas</Link></li>}
            {isAdmin && <li className="nav-item"><Link className="nav-link px-3" to="/admin" style={{borderRadius:8,transition:'all 0.3s'}}><i className="fas fa-user-shield me-2"></i>Admin</Link></li>}
          </ul>
          <ul className="navbar-nav">
            {token ? (
              <>
                <li className="nav-item"><button className="btn btn-outline-danger" onClick={logout} style={{borderRadius:999,padding:'8px 20px',fontWeight:'500'}}><i className="fas fa-sign-out-alt me-2"></i>Cerrar sesión</button></li>
              </>
            ) : (
              <li className="nav-item"><Link className="btn btn-primary" to="/login" style={{borderRadius:999,padding:'8px 24px',fontWeight:'500',boxShadow:'0 4px 12px rgba(30,111,191,0.3)'}}><i className="fas fa-sign-in-alt me-2"></i>Iniciar Sesión</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NavBar(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Boceto</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Eventos</Link></li>
          </ul>
          <ul className="navbar-nav">
            {token ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/mis-reservas">Mis Reservas</Link></li>
                <li className="nav-item"><button className="btn btn-link nav-link" onClick={logout}>Cerrar sesión</button></li>
              </>
            ) : (
              <li className="nav-item"><Link className="nav-link" to="/login">Iniciar sesión</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

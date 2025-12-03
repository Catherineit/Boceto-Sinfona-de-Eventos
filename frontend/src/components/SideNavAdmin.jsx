import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SideNavAdmin(){
  return (
    <div className="d-flex flex-column p-3 bg-light" style={{minHeight:'100vh'}}>
      <h5>Admin</h5>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item"><NavLink className="nav-link" to="/admin">Dashboard</NavLink></li>
        <li className="nav-item"><NavLink className="nav-link" to="/admin/eventos">Eventos</NavLink></li>
        <li className="nav-item"><NavLink className="nav-link" to="/admin/reservas">Reservas</NavLink></li>
        <li className="nav-item"><NavLink className="nav-link" to="/admin/usuarios">Usuarios</NavLink></li>
        <li className="nav-item"><NavLink className="nav-link" to="/admin/reportes">Reportes</NavLink></li>
      </ul>
    </div>
  )
}

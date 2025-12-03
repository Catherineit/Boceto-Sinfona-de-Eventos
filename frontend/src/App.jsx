import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Eventos from './pages/Eventos'
import EventoDetalle from './pages/EventoDetalle'
import MisReservas from './pages/MisReservas'
import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Eventos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/eventos/:id" element={<EventoDetalle />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

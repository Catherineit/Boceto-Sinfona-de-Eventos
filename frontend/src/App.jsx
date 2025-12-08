import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Home from './pages/Home'
import Eventos from './pages/Eventos'
import Servicios from './pages/Servicios'
import EventoDetalle from './pages/EventoDetalle'
import MisReservas from './pages/MisReservas'
import AdminPanel from './pages/AdminPanel'
import Contacto from './pages/Contacto'
import Registro from './pages/Registro'

function App() {
  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/:id" element={<EventoDetalle />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App

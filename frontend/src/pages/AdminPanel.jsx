import React, { useState, useEffect } from 'react'
import api from '../api'

export default function AdminPanel(){
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadReservas()
  }, [])

  const loadReservas = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/reservas/admin/all')
      setReservas(res.data.reservas || [])
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Error al cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{color:'#1a1a1a'}}>
            <i className="fas fa-user-shield me-2" style={{color:'var(--primary)'}}></i>
            Panel de Administración
          </h2>
          <p className="text-muted mb-0">Gestión de reservas y eventos</p>
        </div>
        <button className="btn btn-outline-primary" onClick={loadReservas}>
          <i className="fas fa-sync-alt me-2"></i>Actualizar
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" style={{borderRadius:12}}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="card" style={{border:'none',borderRadius:16,boxShadow:'0 4px 20px rgba(16,24,40,0.08)'}}>
        <div className="card-header bg-white" style={{borderRadius:'16px 16px 0 0',padding:'20px 24px',borderBottom:'1px solid #f0f0f0'}}>
          <h5 className="mb-0 fw-bold" style={{color:'#1a1a1a'}}>
            <i className="fas fa-calendar-check me-2" style={{color:'var(--primary)'}}></i>
            Todas las Reservas ({reservas.length})
          </h5>
        </div>
        <div className="card-body" style={{padding:0}}>
          {reservas.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-inbox fa-3x mb-3" style={{color:'#ddd'}}></i>
              <p className="text-muted">No hay reservas registradas</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{background:'#f8f9fa'}}>
                  <tr>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>ID</th>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Usuario</th>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Correo</th>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Evento</th>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Fecha Reserva</th>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Fecha Evento</th>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r) => (
                    <tr key={r.id_reserva}>
                      <td style={{padding:'16px 24px',verticalAlign:'middle'}}>
                        <span className="badge bg-secondary" style={{fontSize:'0.85rem'}}>#{r.id_reserva}</span>
                      </td>
                      <td style={{padding:'16px 24px',verticalAlign:'middle',fontWeight:'500'}}>
                        {r.nombre_usuario}
                      </td>
                      <td style={{padding:'16px 24px',verticalAlign:'middle',color:'#555'}}>
                        <i className="fas fa-envelope me-2" style={{color:'var(--primary)',fontSize:'0.85rem'}}></i>
                        {r.correo}
                      </td>
                      <td style={{padding:'16px 24px',verticalAlign:'middle',fontWeight:'500'}}>
                        {r.titulo}
                      </td>
                      <td style={{padding:'16px 24px',verticalAlign:'middle',color:'#555'}}>
                        {new Date(r.fecha_reserva).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{padding:'16px 24px',verticalAlign:'middle',color:'#555'}}>
                        {new Date(r.fecha_evento).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </td>
                      <td style={{padding:'16px 24px',verticalAlign:'middle'}}>
                        <span className={`badge ${r.estado === 'activa' ? 'bg-success' : 'bg-secondary'}`} style={{fontSize:'0.85rem',padding:'6px 12px',borderRadius:8}}>
                          {r.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import api from '../api'

export default function AdminPanel(){
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ estado: '', cantidad: '' })
  const [showReporte, setShowReporte] = useState(false)
  const [reporte, setReporte] = useState(null)
  const [loadingReporte, setLoadingReporte] = useState(false)

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

  const handleEdit = (reserva) => {
    setEditingId(reserva.id_reserva)
    setEditForm({
      estado: reserva.estado,
      cantidad: reserva.cantidad || 1
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ estado: '', cantidad: '' })
  }

  const handleSaveEdit = async (id_reserva) => {
    try {
      await api.put(`/reservas/admin/${id_reserva}`, editForm)
      setEditingId(null)
      setEditForm({ estado: '', cantidad: '' })
      loadReservas()
      alert('Reserva actualizada exitosamente')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error al actualizar reserva')
    }
  }

  const handleGenerarReporte = async () => {
    setLoadingReporte(true)
    try {
      const res = await api.get('/reservas/admin/reporte')
      setReporte(res.data)
      setShowReporte(true)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error al generar reporte')
    } finally {
      setLoadingReporte(false)
    }
  }

  const handleDescargarReporte = () => {
    if (!reporte) return
    
    const contenido = `
REPORTE DE RESERVAS
Fecha de generación: ${new Date(reporte.fecha_generacion).toLocaleString('es-ES')}

=== ESTADÍSTICAS GENERALES ===
Total de reservas: ${reporte.estadisticas.total_reservas}
Activas: ${reporte.estadisticas.activas}
Canceladas: ${reporte.estadisticas.canceladas}
Asistidas: ${reporte.estadisticas.asistidas}
No asistidas: ${reporte.estadisticas.no_asistidas}

=== RESERVAS POR EVENTO ===
${reporte.porEvento.map(e => `${e.titulo}: ${e.total_reservas} reservas (${e.activas} activas)`).join('\n')}

=== RESERVAS POR USUARIO ===
${reporte.porUsuario.map(u => `${u.nombre} (${u.correo}): ${u.total_reservas} reservas (${u.activas} activas)`).join('\n')}

=== ACTIVIDAD RECIENTE (ÚLTIMOS 30 DÍAS) ===
${reporte.recientes.map(r => `${new Date(r.fecha).toLocaleDateString('es-ES')}: ${r.cantidad} reservas`).join('\n')}
    `.trim()

    const blob = new Blob([contenido], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte_reservas_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
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
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handleGenerarReporte} disabled={loadingReporte}>
            <i className={`fas ${loadingReporte ? 'fa-spinner fa-spin' : 'fa-file-alt'} me-2`}></i>
            Generar Reporte
          </button>
          <button className="btn btn-outline-primary" onClick={loadReservas}>
            <i className="fas fa-sync-alt me-2"></i>Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" style={{borderRadius:12}}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Modal Reporte */}
      {showReporte && reporte && (
        <div className="modal show d-block" style={{backgroundColor:'rgba(0,0,0,0.5)'}} onClick={()=>setShowReporte(false)}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-content" style={{borderRadius:16}}>
              <div className="modal-header" style={{borderBottom:'1px solid #f0f0f0'}}>
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-chart-bar me-2" style={{color:'var(--primary)'}}></i>
                  Reporte de Reservas
                </h5>
                <button type="button" className="btn-close" onClick={()=>setShowReporte(false)}></button>
              </div>
              <div className="modal-body" style={{padding:'24px'}}>
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Estadísticas Generales</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="card" style={{border:'2px solid #e0e0e0',borderRadius:12}}>
                        <div className="card-body text-center">
                          <div className="display-6 fw-bold text-primary">{reporte.estadisticas.total_reservas}</div>
                          <small className="text-muted">Total Reservas</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card" style={{border:'2px solid #28a745',borderRadius:12}}>
                        <div className="card-body text-center">
                          <div className="display-6 fw-bold text-success">{reporte.estadisticas.activas}</div>
                          <small className="text-muted">Activas</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card" style={{border:'2px solid #dc3545',borderRadius:12}}>
                        <div className="card-body text-center">
                          <div className="h4 fw-bold text-danger">{reporte.estadisticas.canceladas}</div>
                          <small className="text-muted">Canceladas</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card" style={{border:'2px solid #17a2b8',borderRadius:12}}>
                        <div className="card-body text-center">
                          <div className="h4 fw-bold text-info">{reporte.estadisticas.asistidas}</div>
                          <small className="text-muted">Asistidas</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card" style={{border:'2px solid #ffc107',borderRadius:12}}>
                        <div className="card-body text-center">
                          <div className="h4 fw-bold text-warning">{reporte.estadisticas.no_asistidas}</div>
                          <small className="text-muted">No Asistidas</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Reservas por Evento</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Evento</th>
                          <th>Total</th>
                          <th>Activas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reporte.porEvento.map((e, i) => (
                          <tr key={i}>
                            <td>{e.titulo}</td>
                            <td><span className="badge bg-secondary">{e.total_reservas}</span></td>
                            <td><span className="badge bg-success">{e.activas}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold mb-3">Top Usuarios</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Correo</th>
                          <th>Total</th>
                          <th>Activas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reporte.porUsuario.slice(0, 10).map((u, i) => (
                          <tr key={i}>
                            <td>{u.nombre}</td>
                            <td><small>{u.correo}</small></td>
                            <td><span className="badge bg-secondary">{u.total_reservas}</span></td>
                            <td><span className="badge bg-success">{u.activas}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{borderTop:'1px solid #f0f0f0'}}>
                <button className="btn btn-primary" onClick={handleDescargarReporte}>
                  <i className="fas fa-download me-2"></i>Descargar Reporte
                </button>
                <button className="btn btn-secondary" onClick={()=>setShowReporte(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
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
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Cantidad</th>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Fecha Reserva</th>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Estado</th>
                    <th style={{padding:'16px 24px',fontWeight:'600',color:'#555'}}>Acciones</th>
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
                      <td style={{padding:'16px 24px',verticalAlign:'middle'}}>
                        {editingId === r.id_reserva ? (
                          <input 
                            type="number" 
                            className="form-control form-control-sm" 
                            style={{width:80}}
                            value={editForm.cantidad}
                            onChange={(e) => setEditForm({...editForm, cantidad: e.target.value})}
                            min="1"
                          />
                        ) : (
                          <span className="badge bg-info">{r.cantidad || 1} personas</span>
                        )}
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
                      <td style={{padding:'16px 24px',verticalAlign:'middle'}}>
                        {editingId === r.id_reserva ? (
                          <select 
                            className="form-select form-select-sm" 
                            style={{width:140}}
                            value={editForm.estado}
                            onChange={(e) => setEditForm({...editForm, estado: e.target.value})}
                          >
                            <option value="activa">Activa</option>
                            <option value="cancelada">Cancelada</option>
                            <option value="asistida">Asistida</option>
                            <option value="no_asistida">No Asistida</option>
                          </select>
                        ) : (
                          <span className={`badge ${
                            r.estado === 'activa' ? 'bg-success' : 
                            r.estado === 'cancelada' ? 'bg-danger' :
                            r.estado === 'asistida' ? 'bg-info' :
                            'bg-warning'
                          }`} style={{fontSize:'0.85rem',padding:'6px 12px',borderRadius:8}}>
                            {r.estado}
                          </span>
                        )}
                      </td>
                      <td style={{padding:'16px 24px',verticalAlign:'middle'}}>
                        {editingId === r.id_reserva ? (
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleSaveEdit(r.id_reserva)}
                              style={{borderRadius:8,padding:'4px 12px'}}
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={handleCancelEdit}
                              style={{borderRadius:8,padding:'4px 12px'}}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(r)}
                            style={{borderRadius:8,padding:'4px 12px'}}
                          >
                            <i className="fas fa-edit me-1"></i>Editar
                          </button>
                        )}
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

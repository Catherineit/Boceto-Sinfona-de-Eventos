import React, { useState } from 'react'

export default function ModalReserva({ evento, show=false, onClose=()=>{}, onConfirm=()=>{} }){
  const disponibles = evento?.capacidad
  const [cantidad, setCantidad] = useState(1)
  const [fechaReserva, setFechaReserva] = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)
  const [mostrarCalendario, setMostrarCalendario] = useState(false)
  const precioFijo = evento?.precio || 950000 // Precio fijo del evento

  if (!evento) return null

  const total = precioFijo // Precio fijo, no cambia con la cantidad

  // Función para manejar el cambio en la cantidad
  const handleCantidadChange = (e) => {
    const valor = e.target.value
    if (valor === '') {
      setCantidad('')
      return
    }
    const num = parseInt(valor)
    if (!isNaN(num)) {
      const cantidadValidada = Math.max(1, Math.min(disponibles, num))
      setCantidad(cantidadValidada)
    }
  }

  // Validar cantidad al perder el foco
  const handleCantidadBlur = () => {
    if (cantidad === '' || cantidad < 1) {
      setCantidad(1)
    }
  }

  // Generar calendario del mes actual
  const generarCalendario = () => {
    const [year, month] = fechaReserva.split('-')
    const primerDia = new Date(year, month - 1, 1)
    const ultimoDia = new Date(year, month, 0)
    const diasMes = ultimoDia.getDate()
    const diaInicio = primerDia.getDay()
    
    const dias = []
    // Días vacíos al inicio
    for (let i = 0; i < diaInicio; i++) {
      dias.push(null)
    }
    // Días del mes
    for (let i = 1; i <= diasMes; i++) {
      dias.push(i)
    }
    return { dias, year: parseInt(year), month: parseInt(month) }
  }

  const { dias, year, month } = generarCalendario()
  const nombreMes = new Date(year, month - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  const handleSeleccionarDia = (dia) => {
    const diaStr = String(dia).padStart(2, '0')
    const mesStr = String(month).padStart(2, '0')
    setFechaReserva(`${year}-${mesStr}-${diaStr}`)
    setMostrarCalendario(false)
  }

  const cambiarMes = (offset) => {
    const [y, m] = fechaReserva.split('-')
    let nuevoMes = parseInt(m) + offset
    let nuevoYear = parseInt(y)
    
    if (nuevoMes > 12) {
      nuevoMes = 1
      nuevoYear++
    } else if (nuevoMes < 1) {
      nuevoMes = 12
      nuevoYear--
    }
    
    const mesStr = String(nuevoMes).padStart(2, '0')
    const ultimoDiaDelMes = new Date(nuevoYear, nuevoMes, 0).getDate()
    const [, , dia] = fechaReserva.split('-')
    const diaValido = Math.min(parseInt(dia), ultimoDiaDelMes)
    const diaStr = String(diaValido).padStart(2, '0')
    
    setFechaReserva(`${nuevoYear}-${mesStr}-${diaStr}`)
  }

  const fechaFormateada = new Date(fechaReserva).toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const confirm = async () => {
    if (cantidad <= 0 || cantidad > disponibles) return
    try {
      setSubmitting(true)
      // Allow onConfirm to be async and await it here
      const result = onConfirm({ id_evento: evento.id_evento, cantidad, fechaReserva })
      if (result && typeof result.then === 'function') {
        await result
      }
    } catch (err) {
      // parent onConfirm is expected to handle errors; we don't rethrow
      console.error('Error en confirm modal', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{background:'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" style={{borderRadius:16}}>
          <div className="modal-header" style={{borderBottom:'1px solid #f0f0f0',padding:'24px'}}>
            <h5 className="modal-title fw-bold">{evento.titulo}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} disabled={submitting}></button>
          </div>
          <div className="modal-body" style={{padding:'24px'}}>
            <div className="mb-4">
              <small className="text-muted d-block mb-1">Detalles del evento</small>
              <p className="mb-0"><i className="fas fa-map-marker-alt text-primary me-2"></i><strong>Ubicación:</strong> {evento.ubicacion || 'Por definir'}</p>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold mb-2">Fecha de la reserva</label>
              <div className="position-relative">
                <div 
                  className="form-control" 
                  style={{cursor:'pointer',background:'#f8f9fa'}}
                  onClick={() => setMostrarCalendario(!mostrarCalendario)}
                >
                  <i className="fas fa-calendar-alt text-primary me-2"></i>
                  <span>{fechaFormateada}</span>
                </div>
                
                {mostrarCalendario && (
                  <div style={{
                    position:'absolute',
                    top:'100%',
                    left:0,
                    right:0,
                    background:'white',
                    border:'1px solid #e0e0e0',
                    borderRadius:8,
                    boxShadow:'0 4px 12px rgba(0,0,0,0.15)',
                    zIndex:1000,
                    padding:'16px',
                    marginTop:'4px'
                  }}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => cambiarMes(-1)}
                        style={{padding:'4px 8px'}}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <span className="fw-bold">{nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}</span>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => cambiarMes(1)}
                        style={{padding:'4px 8px'}}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(7, 1fr)',gap:'8px',textAlign:'center'}}>
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(dia => (
                        <div key={dia} style={{fontWeight:'bold',fontSize:'0.8rem',color:'#999',padding:'4px'}}>
                          {dia}
                        </div>
                      ))}
                      {dias.map((dia, idx) => (
                        <button
                          key={idx}
                          className={`btn btn-sm ${dia ? (fechaReserva.endsWith(String(dia).padStart(2, '0')) ? 'btn-primary' : 'btn-outline-light') : ''}`}
                          onClick={() => dia && handleSeleccionarDia(dia)}
                          disabled={!dia}
                          style={{
                            padding:'6px',
                            fontSize:'0.85rem',
                            borderColor:dia ? '#ddd' : 'transparent',
                            color:dia ? 'inherit' : '#ccc',
                            cursor:dia ? 'pointer' : 'default'
                          }}
                        >
                          {dia}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Cantidad de invitados</label>
              <div className="d-flex align-items-center gap-2">
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1 || submitting}
                  style={{width:40,height:40}}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <input 
                  type="number" 
                  className="form-control text-center fw-bold" 
                  min="1" 
                  max={disponibles} 
                  value={cantidad} 
                  onChange={handleCantidadChange}
                  onBlur={handleCantidadBlur}
                  disabled={submitting}
                  style={{flex:1}}
                  placeholder="Ingresa cantidad"
                />
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setCantidad(Math.min(disponibles, cantidad + 1))}
                  disabled={cantidad >= disponibles || submitting}
                  style={{width:40,height:40}}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="card" style={{border:'1px solid #f0f0f0',borderRadius:12,background:'rgba(30,111,191,0.05)',padding:'16px'}}>
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Precio del evento:</span>
                <span className="fw-bold" style={{fontSize:'1.2rem',color:'var(--primary)'}}>${precioFijo.toLocaleString()}</span>
              </div>
              <div className="alert alert-sm alert-info p-2" style={{fontSize:'0.85rem',borderRadius:8,border:'none',background:'rgba(30,111,191,0.1)',color:'#1a1a1a',margin:'0'}}>
                <i className="fas fa-info-circle me-1" style={{color:'var(--primary)'}}></i>
                <strong>Nota:</strong> El precio es fijo. La cantidad de invitados no afecta el costo.
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{borderTop:'1px solid #f0f0f0',padding:'16px',background:'#f9f9f9'}}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancelar</button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={confirm} 
              disabled={disponibles === 0 || submitting || cantidad <= 0 || cantidad > disponibles}
              style={{minWidth:150}}
            >
              {submitting ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando...</>
              ) : (
                <>Confirmar reserva - ${total.toLocaleString()}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

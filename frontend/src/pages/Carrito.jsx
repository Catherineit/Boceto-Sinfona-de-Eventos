import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../hooks/useCarrito'
import { useCarritoEventos } from '../hooks/useCarritoEventos'
import { showToast } from '../utils/toast'
import api from '../api'

const serviceImages = {
  's-garzones': '/assets/images/Garzon.jpg',
  's-juegos': '/assets/images/Inflables.jpg',
  's-deco': '/assets/images/DecoracionTematica.jpg',
  's-animador': '/assets/images/Animador.jpg',
  's-karaoke': '/assets/images/Karaoke.jpg'
}

export default function Carrito() {
  const { items: servicios, loading: loadingServicios, removeItem: removeServicio, updateQuantity: updateServicio, refetch: refetchServicios } = useCarrito()
  const { items: eventos, loading: loadingEventos, removeItem: removeEvento, updateQuantity: updateEvento, refetch: refetchEventos } = useCarritoEventos()
  const navigate = useNavigate()

  const serviciosMapping = [
    { id: 's-garzones', title: 'Servicio de Garzones' },
    { id: 's-juegos', title: 'Juegos infantiles' },
    { id: 's-deco', title: 'Decoración temática' },
    { id: 's-animador', title: 'Animador' },
    { id: 's-karaoke', title: 'Karaoke' }
  ]

  const getServiceTitle = (serviceId) => {
    const srv = serviciosMapping.find(s => s.id === serviceId)
    return srv?.title || serviceId
  }

  const parsePrice = (priceStr) => {
    if (!priceStr || priceStr === 'Consultar precio' || priceStr === 'Consultar') return 0
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''))
    return isNaN(num) ? 0 : num
  }

  const subtotalServicios = useMemo(() => {
    return servicios.reduce((sum, item) => sum + (parsePrice(item.precio) * item.cantidad), 0)
  }, [servicios])

  const totalGeneral = subtotalServicios
  const todosItems = [...servicios, ...eventos]
  const loading = loadingServicios || loadingEventos

  const handleConfirm = async () => {
    if (todosItems.length === 0) {
      showToast('warning', 'Tu carrito está vacío')
      return
    }
    try {
      // Crear reservas de servicios
      if (servicios.length > 0) {
        const itemsServicios = servicios.map(item => ({
          service_id: item.service_id,
          service_name: item.service_name,
          cantidad: item.cantidad,
          precio: item.precio
        }))
        await api.post('/reservas/servicios', { items: itemsServicios })
      }

      // Crear reservas de eventos
      for (const evento of eventos) {
        await api.post('/reservas', { id_evento: evento.id_evento, cantidad: evento.cantidad })
      }

      showToast('success', 'Reserva confirmada correctamente')
      
      // Limpiar carrito después de checkout
      for (const item of servicios) {
        await api.delete(`/carrito/${item.id}`).catch(() => {})
      }
      for (const item of eventos) {
        await api.delete(`/carrito/eventos/${item.id}`).catch(() => {})
      }
      
      setTimeout(() => navigate('/mis-reservas'), 1500)
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo confirmar la reserva'
      showToast('danger', msg)
    }
  }

  if (loading) return <div className="container py-5 text-center">Cargando carrito...</div>

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <div className="d-inline-block px-4 py-2 mb-3" style={{background:'rgba(30,111,191,0.1)',borderRadius:999,fontSize:'0.85rem',fontWeight:'600',color:'var(--primary)'}}>
          <i className="fas fa-shopping-cart me-2"></i>CARRITO DE COMPRAS
        </div>
        <h1 className="fw-bold mb-2">Tu Carrito</h1>
        <p className="text-muted mb-0">{todosItems.length} artículo{todosItems.length !== 1 ? 's' : ''} agregado{todosItems.length !== 1 ? 's' : ''}</p>
      </div>

      {todosItems.length === 0 ? (
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card text-center" style={{border:'none',borderRadius:20,padding:40,boxShadow:'0 4px 20px rgba(16,24,40,0.08)'}}>
              <i className="fas fa-shopping-bag" style={{fontSize:'3rem',color:'#ccc',marginBottom:16}}></i>
              <h5 className="fw-bold mb-2">Tu carrito está vacío</h5>
              <p className="text-muted mb-4">Agrega servicios o eventos para tu pedido</p>
              <Link to="/servicios" className="btn btn-primary" style={{borderRadius:999,padding:'10px 24px',fontWeight:'600'}}>
                <i className="fas fa-arrow-left me-2"></i>Volver a Servicios
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card" style={{border:'none',borderRadius:20,boxShadow:'0 4px 20px rgba(16,24,40,0.08)',overflow:'hidden'}}>
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead style={{background:'rgba(30,111,191,0.05)'}}>
                    <tr>
                      <th style={{padding:'16px',fontWeight:'600',color:'#1a1a1a',border:'none'}}>Artículo</th>
                      <th style={{padding:'16px',fontWeight:'600',color:'#1a1a1a',border:'none'}}>Tipo</th>
                      <th style={{padding:'16px',fontWeight:'600',color:'#1a1a1a',border:'none'}}>Precio</th>
                      <th style={{padding:'16px',fontWeight:'600',color:'#1a1a1a',border:'none'}}>Cantidad</th>
                      <th style={{padding:'16px',fontWeight:'600',color:'#1a1a1a',border:'none'}}>Subtotal</th>
                      <th style={{padding:'16px',fontWeight:'600',color:'#1a1a1a',border:'none'}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicios.map((item) => {
                      const price = parsePrice(item.precio)
                      const itemSubtotal = price * item.cantidad
                      return (
                        <tr key={'srv-' + item.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                          <td style={{padding:'16px',border:'none'}}>
                            <div className="d-flex align-items-center gap-3">
                              <div style={{width:60,height:60,borderRadius:12,overflow:'hidden',background:'#f5f5f5',flexShrink:0}}>
                                <img 
                                  src={serviceImages[item.service_id] || '/assets/placeholder.png'} 
                                  alt={item.service_name}
                                  style={{width:'100%',height:'100%',objectFit:'cover'}}
                                />
                              </div>
                              <div>
                                <h6 className="mb-1 fw-semibold">{item.service_name}</h6>
                                <small className="text-muted">{item.service_id}</small>
                              </div>
                            </div>
                          </td>
                          <td style={{padding:'16px',border:'none'}}>
                            <span className="badge bg-primary">Servicio</span>
                          </td>
                          <td style={{padding:'16px',border:'none'}}>
                            <span className="fw-semibold">{item.precio}</span>
                          </td>
                          <td style={{padding:'16px',border:'none'}}>
                            <div style={{display:'flex',alignItems:'center',gap:8,width:'fit-content'}}>
                              <button 
                                className="btn btn-sm" 
                                style={{width:32,height:32,borderRadius:6,border:'1px solid #e0e0e0',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}}
                                onClick={() => updateServicio(item.id, item.cantidad - 1)}
                              >
                                <i className="fas fa-minus" style={{fontSize:'0.75rem'}}></i>
                              </button>
                              <span style={{minWidth:20,textAlign:'center',fontWeight:'600'}}>{item.cantidad}</span>
                              <button 
                                className="btn btn-sm" 
                                style={{width:32,height:32,borderRadius:6,border:'1px solid #e0e0e0',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}}
                                onClick={() => updateServicio(item.id, item.cantidad + 1)}
                              >
                                <i className="fas fa-plus" style={{fontSize:'0.75rem'}}></i>
                              </button>
                            </div>
                          </td>
                          <td style={{padding:'16px',border:'none'}}>
                            <span className="fw-bold" style={{color:'var(--primary)',fontSize:'1.1rem'}}>
                              ${itemSubtotal.toLocaleString()}
                            </span>
                          </td>
                          <td style={{padding:'16px',border:'none',textAlign:'right'}}>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              style={{borderRadius:8,padding:'6px 12px'}}
                              onClick={() => {
                                removeServicio(item.id)
                                showToast('info', 'Servicio eliminado')
                              }}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {eventos.map((item) => (
                      <tr key={'evt-' + item.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                        <td style={{padding:'16px',border:'none'}}>
                          <div className="d-flex align-items-center gap-3">
                            <div style={{width:60,height:60,borderRadius:12,overflow:'hidden',background:'#f5f5f5',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <i className="fas fa-calendar-alt" style={{fontSize:'1.8rem',color:'var(--primary)'}}></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-semibold">{item.titulo_evento}</h6>
                              <small className="text-muted">ID: {item.id_evento}</small>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:'16px',border:'none'}}>
                          <span className="badge bg-success">Evento</span>
                        </td>
                        <td style={{padding:'16px',border:'none'}}>
                          <span className="fw-semibold text-muted">-</span>
                        </td>
                        <td style={{padding:'16px',border:'none'}}>
                          <div style={{display:'flex',alignItems:'center',gap:8,width:'fit-content'}}>
                            <button 
                              className="btn btn-sm" 
                              style={{width:32,height:32,borderRadius:6,border:'1px solid #e0e0e0',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}}
                              onClick={() => updateEvento(item.id, item.cantidad - 1)}
                            >
                              <i className="fas fa-minus" style={{fontSize:'0.75rem'}}></i>
                            </button>
                            <span style={{minWidth:20,textAlign:'center',fontWeight:'600'}}>{item.cantidad}</span>
                            <button 
                              className="btn btn-sm" 
                              style={{width:32,height:32,borderRadius:6,border:'1px solid #e0e0e0',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}}
                              onClick={() => updateEvento(item.id, item.cantidad + 1)}
                            >
                              <i className="fas fa-plus" style={{fontSize:'0.75rem'}}></i>
                            </button>
                          </div>
                        </td>
                        <td style={{padding:'16px',border:'none'}}>
                          <span className="fw-bold" style={{color:'var(--primary)',fontSize:'1.1rem'}}>-</span>
                        </td>
                        <td style={{padding:'16px',border:'none',textAlign:'right'}}>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            style={{borderRadius:8,padding:'6px 12px'}}
                            onClick={() => {
                              removeEvento(item.id)
                              showToast('info', 'Evento eliminado')
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4">
              <Link to="/servicios" className="btn btn-outline-primary" style={{borderRadius:999,padding:'10px 24px',fontWeight:'600'}}>
                <i className="fas fa-arrow-left me-2"></i>Seguir comprando
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card" style={{border:'none',borderRadius:20,boxShadow:'0 4px 20px rgba(16,24,40,0.08)',padding:28,position:'sticky',top:20}}>
              <h5 className="fw-bold mb-4"><i className="fas fa-receipt me-2" style={{color:'var(--primary)'}}></i>Resumen</h5>
              
              <div className="mb-3">
                <div className="fw-bold mb-3" style={{fontSize:'0.9rem',color:'var(--primary)'}}>Servicios:</div>
                {servicios.length === 0 ? (
                  <p className="text-muted small">Sin servicios</p>
                ) : (
                  servicios.map(item => (
                    <div key={item.id} className="d-flex justify-content-between mb-2 small">
                      <span className="text-muted">{item.service_name} x {item.cantidad}</span>
                      <span>${(parsePrice(item.precio) * item.cantidad).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>

              {eventos.length > 0 && (
                <div className="mb-3">
                  <div className="fw-bold mb-3" style={{fontSize:'0.9rem',color:'var(--primary)'}}>Eventos:</div>
                  {eventos.map(item => (
                    <div key={item.id} className="d-flex justify-content-between mb-2 small">
                      <span className="text-muted">{item.titulo_evento} x {item.cantidad}</span>
                      <span className="text-muted">-</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{borderTop:'2px solid #f0f0f0',paddingTop:16,marginTop:16}}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Total servicios:</span>
                  <span className="fw-bold" style={{fontSize:'1.2rem',color:'var(--primary)'}}>${totalGeneral.toLocaleString()}</span>
                </div>
              </div>

              <div className="alert alert-info small mt-3" style={{borderRadius:12,border:'none',background:'rgba(30,111,191,0.1)',color:'#1a1a1a'}}>
                <i className="fas fa-info-circle me-2" style={{color:'var(--primary)'}}></i>Los servicios adicionales generan costos. Los eventos no tienen costo aquí.
              </div>

              <button 
                className="btn btn-primary w-100 mt-3" 
                style={{borderRadius:999,padding:'14px 0',fontWeight:'600',boxShadow:'0 6px 20px rgba(30,111,191,0.3)'}}
                onClick={handleConfirm}
              >
                <i className="fas fa-check-circle me-2"></i>Confirmar compra
              </button>

              <button 
                className="btn btn-outline-secondary w-100 mt-2" 
                style={{borderRadius:999,padding:'12px 0',fontWeight:'600'}}
                onClick={() => navigate('/eventos')}
              >
                <i className="fas fa-calendar me-2"></i>Ver más eventos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

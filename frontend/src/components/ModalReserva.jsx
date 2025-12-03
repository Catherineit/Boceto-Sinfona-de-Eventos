import React, { useState } from 'react'

export default function ModalReserva({ evento, show=false, onClose=()=>{}, onConfirm=()=>{} }){
  const disponibles = Math.max(0, evento?.capacidad - (evento?.aforo_actual || 0))
  const [cantidad, setCantidad] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  if (!evento) return null

  const confirm = async () => {
    if (cantidad <= 0 || cantidad > disponibles) return
    try {
      setSubmitting(true)
      // Allow onConfirm to be async and await it here
      const result = onConfirm({ id_evento: evento.id_evento, cantidad })
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
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reservar: {evento.titulo}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} disabled={submitting}></button>
          </div>
          <div className="modal-body">
            <p>{evento.descripcion}</p>
            <p><strong>Disponibles:</strong> {disponibles}</p>
            <div className="mb-2">
              <label className="form-label">Cantidad</label>
              <input type="number" className="form-control" min="1" max={disponibles} value={cantidad} onChange={e=>setCantidad(Number(e.target.value))} disabled={submitting} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={confirm} disabled={disponibles===0 || submitting}>
              {submitting ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...</>) : 'Confirmar reserva'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

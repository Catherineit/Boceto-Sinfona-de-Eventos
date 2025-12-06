import React, { useState } from 'react'

export default function Contacto(){
  const [form, setForm] = useState({ nombre:'', correo:'', telefono:'', asunto:'', mensaje:'' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí normalmente llamarías a la API para enviar el mensaje
    console.log('Enviar mensaje', form)
    setSent(true)
    setTimeout(()=>setSent(false), 4000)
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h1 className="display-4 fw-bold">Contacto</h1>
        <p className="text-muted">¿Tienes dudas o necesitas soporte? Escríbenos y te contactamos.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card p-3">
            <div className="card-body">
              <h5 className="mb-3">Envíanos un mensaje</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input name="correo" type="email" value={form.correo} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono (opcional)</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Asunto</label>
                  <input name="asunto" value={form.asunto} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange} className="form-control" rows={5} placeholder="Cuéntanos tu consulta con la mayor cantidad de detalle posible..."></textarea>
                </div>
                <button className="btn btn-primary">Enviar mensaje</button>
                {sent && <span className="ms-3 text-success">Mensaje enviado (simulado)</span>}
              </form>
            </div>
          </div>
          <div className="alert alert-light mt-4">
            <h6>¿Cómo reservo?</h6>
            <p className="mb-0">Busca el evento → haz clic en Reservar → completa tus datos.</p>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card p-3 h-100">
            <div className="card-body">
              <h5 className="mb-3">Información</h5>
              <p className="mb-1"><strong>Dirección:</strong> Centro de Innovación Puente Alto, Av. Ejemplo 123</p>
              <p className="mb-1"><strong>Correo:</strong> <a href="mailto:Sinfonia@Contacto.com">Sinfonia@Contacto.com</a></p>
              <p className="mb-1"><strong>Teléfono:</strong> <a href="tel:+56912345678">+56 9 1234 5678</a></p>
              <p className="mb-3"><strong>Horario:</strong> Lun-Vie 09:00-18:00</p>

              <div style={{width:'100%',height:220,borderRadius:12,overflow:'hidden'}}>
                <iframe title="mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.7535486720667!2d-70.58110130000001!3d-33.5857476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d718a032972d%3A0x45da5699698e2261!2sINACAP%20Puente%20Alto!5e0!3m2!1ses!2scl!4v1764981025930!5m2!1ses!2scl" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>

              <p className="mt-3 small text-muted">Responderemos dentro de 48 horas hábiles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

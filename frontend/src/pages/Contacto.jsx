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
      <div className="text-center mb-5">
        <div className="d-inline-block px-4 py-2 mb-3" style={{background:'rgba(30,111,191,0.1)',borderRadius:999,fontSize:'0.8rem',fontWeight:'600',color:'var(--primary)',letterSpacing:'0.5px'}}>
          <i className="fas fa-headset me-2"></i>CONTACTO Y SOPORTE
        </div>
        <h1 className="display-5 fw-bold mb-2"><i className="fas fa-comments me-3" style={{color:'var(--primary)'}}></i>¿Necesitas ayuda?</h1>
        <p className="text-muted">Estamos aquí para resolver todas tus dudas. Escríbenos y te contactaremos pronto.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card" style={{border:'none',borderRadius:20,boxShadow:'0 4px 24px rgba(16,24,40,0.1)',padding:32}}>
            <h5 className="mb-4 fw-bold"><i className="fas fa-paper-plane me-2" style={{color:'var(--primary)'}}></i>Envíanos un mensaje</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small"><i className="fas fa-user me-2 text-muted"></i>Nombre completo</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} className="form-control" style={{borderRadius:12,padding:'12px 16px',border:'2px solid #e8edf3'}} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small"><i className="fas fa-envelope me-2 text-muted"></i>Correo electrónico</label>
                <input name="correo" type="email" value={form.correo} onChange={handleChange} className="form-control" style={{borderRadius:12,padding:'12px 16px',border:'2px solid #e8edf3'}} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small"><i className="fas fa-phone me-2 text-muted"></i>Teléfono (opcional)</label>
                <input name="telefono" value={form.telefono} onChange={handleChange} className="form-control" style={{borderRadius:12,padding:'12px 16px',border:'2px solid #e8edf3'}} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small"><i className="fas fa-tag me-2 text-muted"></i>Asunto</label>
                <input name="asunto" value={form.asunto} onChange={handleChange} className="form-control" style={{borderRadius:12,padding:'12px 16px',border:'2px solid #e8edf3'}} />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small"><i className="fas fa-comment-dots me-2 text-muted"></i>Mensaje</label>
                <textarea name="mensaje" value={form.mensaje} onChange={handleChange} className="form-control" rows={5} placeholder="Cuéntanos tu consulta con la mayor cantidad de detalle posible..." style={{borderRadius:12,padding:'12px 16px',border:'2px solid #e8edf3'}}></textarea>
              </div>
              <button className="btn btn-primary" style={{borderRadius:999,padding:'12px 32px',fontWeight:'600',boxShadow:'0 4px 12px rgba(30,111,191,0.3)'}}><i className="fas fa-paper-plane me-2"></i>Enviar mensaje</button>
              {sent && <span className="ms-3 text-success fw-semibold"><i className="fas fa-check-circle me-1"></i>Mensaje enviado (simulado)</span>}
            </form>
          </div>
          <div className="card mt-4" style={{border:'none',borderRadius:16,background:'linear-gradient(135deg, rgba(30,111,191,0.08), rgba(30,111,191,0.02))',padding:20}}>
            <div className="d-flex align-items-start gap-3">
              <div style={{width:48,height:48,background:'var(--primary)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <i className="fas fa-question-circle" style={{fontSize:'1.4rem',color:'#fff'}}></i>
              </div>
              <div>
                <h6 className="fw-bold mb-2">¿Cómo reservo un evento?</h6>
                <p className="mb-0 small text-muted">Es simple: busca el evento → haz clic en "Reservar" → completa tus datos personales → confirma tu asistencia.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card h-100" style={{border:'none',borderRadius:20,boxShadow:'0 4px 24px rgba(16,24,40,0.1)',padding:32}}>
            <h5 className="mb-4 fw-bold"><i className="fas fa-info-circle me-2" style={{color:'var(--primary)'}}></i>Información de contacto</h5>
            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex align-items-start gap-3">
                <div style={{width:40,height:40,background:'rgba(30,111,191,0.1)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <i className="fas fa-map-marker-alt" style={{color:'var(--primary)',fontSize:'1.1rem'}}></i>
                </div>
                <div>
                  <p className="mb-0 small fw-semibold">Dirección</p>
                  <p className="mb-0 small text-muted">Centro de Innovación Puente Alto<br/>Av. Ejemplo 123</p>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div style={{width:40,height:40,background:'rgba(30,111,191,0.1)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <i className="fas fa-envelope" style={{color:'var(--primary)',fontSize:'1.1rem'}}></i>
                </div>
                <div>
                  <p className="mb-0 small fw-semibold">Correo</p>
                  <a href="mailto:Sinfonia@Contacto.com" className="small text-decoration-none">Sinfonia@Contacto.com</a>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div style={{width:40,height:40,background:'rgba(30,111,191,0.1)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <i className="fas fa-phone" style={{color:'var(--primary)',fontSize:'1.1rem'}}></i>
                </div>
                <div>
                  <p className="mb-0 small fw-semibold">Teléfono</p>
                  <a href="tel:+56912345678" className="small text-decoration-none">+56 9 1234 5678</a>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div style={{width:40,height:40,background:'rgba(30,111,191,0.1)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <i className="fas fa-clock" style={{color:'var(--primary)',fontSize:'1.1rem'}}></i>
                </div>
                <div>
                  <p className="mb-0 small fw-semibold">Horario</p>
                  <p className="mb-0 small text-muted">Lun-Vie 09:00-18:00<br/>Sáb 10:00-14:00</p>
                </div>
              </div>
            </div>

            <div style={{width:'100%',height:240,borderRadius:16,overflow:'hidden',marginBottom:16}}>
              <iframe title="mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.7535486720667!2d-70.58110130000001!3d-33.5857476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d718a032972d%3A0x45da5699698e2261!2sINACAP%20Puente%20Alto!5e0!3m2!1ses!2scl!4v1764981025930!5m2!1ses!2scl" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <div className="alert mb-0" style={{background:'rgba(30,111,191,0.08)',border:'none',borderRadius:12,padding:16}}>
              <p className="mb-0 small"><i className="fas fa-reply me-2" style={{color:'var(--primary)'}}></i><strong>Tiempo de respuesta:</strong> Responderemos dentro de 48 horas hábiles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

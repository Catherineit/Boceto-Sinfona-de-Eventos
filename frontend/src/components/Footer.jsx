import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer mt-5 py-5" style={{background:'linear-gradient(135deg, #1a365d 0%, #2d5a8f 100%)',color:'#fff'}}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center mb-3">
              <div style={{width:56,height:56,borderRadius:'50%',overflow:'hidden',flexShrink:0,marginRight:12,boxShadow:'0 4px 12px rgba(0,0,0,0.3)'}}>
                <img src="/assets/images/Logo.JPG" alt="Sinfonía de Eventos" style={{width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
              <h5 className="mb-0 fw-bold">Sinfonía de Eventos</h5>
            </div>
            <p className="small" style={{color:'rgba(255,255,255,0.8)',lineHeight:1.7}}>
              Creamos experiencias memorables para tus eventos más importantes. Calidad, profesionalismo y atención personalizada.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a href="#" className="btn btn-sm" style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s ease'}} onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.2)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.transform='translateY(0)'}}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="btn btn-sm" style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s ease'}} onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.2)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.transform='translateY(0)'}}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="btn btn-sm" style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s ease'}} onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.2)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.transform='translateY(0)'}}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="btn btn-sm" style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s ease'}} onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.2)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.transform='translateY(0)'}}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold mb-3"><i className="fas fa-phone-volume me-2"></i>Contacto</h6>
            <div className="d-flex flex-column gap-2">
              <a href="mailto:Sinfonia@Contacto.com" className="text-decoration-none d-flex align-items-center gap-2" style={{color:'rgba(255,255,255,0.9)',transition:'all 0.3s ease'}} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.9)'}>
                <div style={{width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <i className="fas fa-envelope" style={{fontSize:'0.85rem'}}></i>
                </div>
                <span className="small">Sinfonia@Contacto.com</span>
              </a>
              <a href="tel:+56912345678" className="text-decoration-none d-flex align-items-center gap-2" style={{color:'rgba(255,255,255,0.9)',transition:'all 0.3s ease'}} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.9)'}>
                <div style={{width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <i className="fas fa-phone" style={{fontSize:'0.85rem'}}></i>
                </div>
                <span className="small">+56 9 1234 5678</span>
              </a>
              <div className="d-flex align-items-center gap-2" style={{color:'rgba(255,255,255,0.9)'}}>
                <div style={{width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <i className="fas fa-map-marker-alt" style={{fontSize:'0.85rem'}}></i>
                </div>
                <span className="small">Santiago, Chile</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold mb-3"><i className="fas fa-clock me-2"></i>Horario de Atención</h6>
            <div className="d-flex flex-column gap-2 small" style={{color:'rgba(255,255,255,0.9)'}}>
              <div className="d-flex justify-content-between align-items-center p-2" style={{background:'rgba(255,255,255,0.05)',borderRadius:8}}>
                <span><i className="far fa-calendar-alt me-2"></i>Lunes - Viernes</span>
                <span className="fw-semibold">09:00 - 18:00</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2" style={{background:'rgba(255,255,255,0.05)',borderRadius:8}}>
                <span><i className="far fa-calendar-alt me-2"></i>Sábado</span>
                <span className="fw-semibold">10:00 - 14:00</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2" style={{background:'rgba(255,255,255,0.05)',borderRadius:8}}>
                <span><i className="far fa-calendar-alt me-2"></i>Domingo</span>
                <span className="fw-semibold">Cerrado</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" style={{borderColor:'rgba(255,255,255,0.2)'}} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="small" style={{color:'rgba(255,255,255,0.7)'}}>
            © 2025 Sinfonía de Eventos. Todos los derechos reservados.
          </div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <a href="#" className="small text-decoration-none" style={{color:'rgba(255,255,255,0.7)',transition:'color 0.3s ease'}} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'}>
              Privacidad
            </a>
            <span style={{color:'rgba(255,255,255,0.3)'}}>|</span>
            <a href="#" className="small text-decoration-none" style={{color:'rgba(255,255,255,0.7)',transition:'color 0.3s ease'}} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'}>
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

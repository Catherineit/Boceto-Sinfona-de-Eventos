import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer bg-light mt-5 py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="footer-brand text-muted" style={{fontSize:'.95rem'}}>
          © 2025 Sinfonía de Evento - Todos los derechos reservados
        </div>
        <div className="footer-contact text-center text-md-start" style={{marginTop:8}}>
          <div><a href="mailto:Sinfonia@Contacto.com">Sinfonia@Contacto.com</a></div>
          <div><a href="tel:+56912345678">+56 9 1234 5678</a></div>
        </div>
        <div className="footer-hours text-muted text-center text-md-end" style={{marginTop:8}}>
          Lun-Vie 09:00-18:00
        </div>
      </div>
    </footer>
  )
}

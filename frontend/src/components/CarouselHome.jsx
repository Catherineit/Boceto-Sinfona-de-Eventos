import React from 'react'

export default function CarouselHome({ slides = [] }){
  if (!slides || slides.length === 0) return null

  return (
    <div id="homeCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {slides.map((_,i)=> (
          <button key={i} type="button" data-bs-target="#homeCarousel" data-bs-slide-to={i} className={i===0? 'active':''} aria-current={i===0} aria-label={`Slide ${i+1}`}></button>
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((s,i)=> (
          <div key={i} className={`carousel-item ${i===0 ? 'active' : ''}`}>
            <img src={s.imagen || '/assets/hero.jpg'} className="d-block w-100" alt={s.titulo} style={{height:420,objectFit:'cover'}} />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-40 rounded p-3" style={{left: '6%', right:'auto', textAlign:'left'}}>
              <h5 className="display-4" style={{color:'white'}}>{s.titulo}</h5>
              {s.subtitulo && <p style={{color:'rgba(255,255,255,0.9)'}}>{s.subtitulo}</p>}
              {s.ctaText && <a href={s.ctaLink || '#'} className="btn btn-primary btn-lg mt-2">{s.ctaText}</a>}
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}

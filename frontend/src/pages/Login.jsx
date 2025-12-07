import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login(){
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await api.post('/auth/login', { correo, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Error de login')
    }
  }

  return (
    <div className="row justify-content-center my-5">
      <div className="col-md-5 col-lg-4">
        <div className="text-center mb-4">
          <div style={{width:80,height:80,margin:'0 auto 20px',borderRadius:'50%',background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(102,126,234,0.3)'}}>
            <i className="fas fa-user-lock" style={{fontSize:'2rem',color:'#fff'}}></i>
          </div>
          <h3 className="fw-bold mb-2">Bienvenido de vuelta</h3>
          <p className="text-muted small mb-0">Ingresa tus credenciales para continuar</p>
        </div>
        <div className="card" style={{border:'none',borderRadius:20,boxShadow:'0 4px 24px rgba(16,24,40,0.12)',padding:32}}>
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small"><i className="fas fa-envelope me-2 text-muted"></i>Correo electrónico</label>
              <input type="email" className="form-control" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tu@correo.com" style={{borderRadius:12,padding:'12px 16px',border:'2px solid #e8edf3'}} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold small"><i className="fas fa-lock me-2 text-muted"></i>Contraseña</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{borderRadius:12,padding:'12px 16px',border:'2px solid #e8edf3'}} required />
            </div>
            {error && (
              <div className="alert alert-danger d-flex align-items-center" style={{borderRadius:12,border:'none',background:'rgba(220,53,69,0.1)',color:'#dc3545'}}>
                <i className="fas fa-exclamation-circle me-2"></i>
                <span className="small">{error}</span>
              </div>
            )}
            <button className="btn btn-primary w-100 mb-3" style={{borderRadius:999,padding:'12px 0',fontWeight:'600',boxShadow:'0 4px 12px rgba(30,111,191,0.3)',transition:'all 0.3s ease'}}><i className="fas fa-sign-in-alt me-2"></i>Iniciar sesión</button>
            <div className="text-center">
              <a href="#" className="small text-decoration-none" style={{color:'var(--primary)'}}>¿Olvidaste tu contraseña?</a>
            </div>
          </form>
        </div>
        <div className="text-center mt-3">
          <p className="small text-muted mb-0">¿No tienes cuenta? <a href="#" className="text-decoration-none fw-semibold" style={{color:'var(--primary)'}}>Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  )
}

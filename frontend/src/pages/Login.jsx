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
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Iniciar sesión</h3>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input type="email" className="form-control" value={correo} onChange={e => setCorreo(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-primary">Entrar</button>
        </form>
      </div>
    </div>
  )
}

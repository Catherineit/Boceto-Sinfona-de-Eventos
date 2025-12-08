import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

const initialForm = {
  nombre: '',
  correo: '',
  telefono: '',
  password: '',
  confirmPassword: ''
}

export default function Registro(){
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [serverError, setServerError] = useState(null)
  const navigate = useNavigate()

  const passwordChecks = useMemo(() => {
    const length = form.password.length >= 8
    const upper = /[A-Z]/.test(form.password)
    const number = /\d/.test(form.password)
    const symbol = /[^A-Za-z0-9]/.test(form.password)
    return { length, upper, number, symbol }
  }, [form.password])

  const validate = () => {
    const newErrors = {}

    const nombre = (form.nombre || '').trim()
    if (!nombre) newErrors.nombre = 'El nombre es obligatorio'
    else if (nombre.split(/\s+/).length < 2) newErrors.nombre = 'Ingresa al menos nombre y apellido'

    const correo = (form.correo || '').trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!correo) newErrors.correo = 'El correo es obligatorio'
    else if (!emailRegex.test(correo)) newErrors.correo = 'Formato de correo inválido'

    if (!form.password) newErrors.password = 'La contraseña es obligatoria'
    else {
      if (!passwordChecks.length || !passwordChecks.upper || !passwordChecks.number) {
        newErrors.password = 'Contraseña insegura: mínimo 8 caracteres, una mayúscula y un número'
      }
    }

    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña'
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Las contraseñas no coinciden'

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(null)
    setServerError(null)
    const foundErrors = validate()
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length) return

    setSubmitting(true)
    try {
      const payload = {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        password: form.password
      }
      await api.post('/auth/register', payload)
      setSuccess('Tu cuenta ha sido creada correctamente. Te enviamos un correo de confirmación.')
      setForm(initialForm)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo completar el registro'
      if (msg.toLowerCase().includes('correo')) {
        setErrors(prev => ({ ...prev, correo: 'Correo ya registrado' }))
      } else if (msg.toLowerCase().includes('contraseña')) {
        setErrors(prev => ({ ...prev, password: 'Contraseña insegura' }))
      }
      setServerError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <div className="d-inline-block px-4 py-2 mb-3" style={{background:'rgba(30,111,191,0.1)',borderRadius:999,fontSize:'0.85rem',fontWeight:'600',color:'var(--primary)'}}>
          <i className="fas fa-user-plus me-2"></i>CREA TU CUENTA
        </div>
        <h1 className="fw-bold mb-2">Registrarse</h1>
        <p className="text-muted mb-0">Crea una cuenta en pocos pasos, con seguridad y validaciones claras.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          {success && <div className="alert alert-success">{success}</div>}
          {serverError && <div className="alert alert-danger">{serverError}</div>}

          <div className="card" style={{border:'none',borderRadius:20,boxShadow:'0 6px 28px rgba(16,24,40,0.12)',padding:28}}>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="nombre">Nombre completo</label>
                <input
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Ana Pérez Soto"
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="correo">Correo electrónico</label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  autoComplete="email"
                />
                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="telefono">Teléfono (opcional)</label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  className="form-control"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                  autoComplete="tel"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <div className="form-text">Mínimo 8 caracteres, 1 mayúscula, 1 número. Usa un símbolo para mayor seguridad.</div>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                <div className="d-flex gap-2 mt-2 small">
                  <span className={`badge ${passwordChecks.length ? 'bg-success' : 'bg-light text-muted'}`}>8+ caracteres</span>
                  <span className={`badge ${passwordChecks.upper ? 'bg-success' : 'bg-light text-muted'}`}>Mayúscula</span>
                  <span className={`badge ${passwordChecks.number ? 'bg-success' : 'bg-light text-muted'}`}>Número</span>
                  <span className={`badge ${passwordChecks.symbol ? 'bg-success' : 'bg-light text-muted'}`}>Símbolo</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>

              <button className="btn btn-primary w-100" type="submit" disabled={submitting} style={{borderRadius:999,padding:'12px 0',fontWeight:'600',boxShadow:'0 4px 12px rgba(30,111,191,0.3)'}}>
                {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="text-muted small">¿Ya tienes cuenta? </span>
              <Link to="/login" className="small fw-semibold" style={{color:'var(--primary)'}}>Inicia sesión</Link>
            </div>
          </div>

          <div className="alert alert-info mt-4 small" role="alert">
            Protegemos tus datos con altos estándares de seguridad.
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useRouter } from 'next/router'
import jwtDecode from 'jwt-decode';
import styles from '../styles/Login.module.css'

interface DecodedToken {
  role: string;
  [key: string]: any;
}

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      })
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const decodedToken = jwtDecode(data.token) as DecodedToken;
        localStorage.setItem('name', decodedToken.name);
        localStorage.setItem('lastname', decodedToken.lastname);
        localStorage.setItem('contract_end_date', decodedToken.contract_end_date);
        if (decodedToken.role === 'owner') {
          router.push('/dashboard')
        } else if (decodedToken.role === 'tenant') {
          router.push('/user_dashboard')
        }
      } else {
        setError(data.message)
      }
    }

  return (
    <div className={`container py-5 ${styles['login-container']}`}>
      <div className={styles['login-form']}>
        <h1 className="h3 mb-3 fw-normal text-center">Por favor, inicia sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailInput" className="visually-hidden">Correo electrónico</label>
            <input type="email" id="emailInput" className={`form-control ${styles['form-input']}`} placeholder="Correo electrónico" required
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput" className="visually-hidden">Contraseña</label>
            <input type="password" id="passwordInput" className={`form-control ${styles['form-input']}`} placeholder="Contraseña" required
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <button className={`btn btn-lg btn-primary ${styles['login-button']}`} type="submit">Iniciar sesión</button>
        </form>
      </div>
    </div>
  )
}
import { useRouter } from 'next/router'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className={`container py-5 ${styles['dashboard-container']}`}>
      <h1 className="h3 mb-3 fw-normal text-center">Bienvenido a tu panel de control</h1>
      <button className={`btn btn-lg btn-primary ${styles['logout-button']}`} onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}
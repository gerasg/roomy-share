//dashboard.tsx
import { useRouter } from 'next/router'
import axios from 'axios'; // Asegúrate de instalar axios con npm install axios
import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const assignTasks = async () => {
    try {
      await axios.post('http://localhost:3001/assign_tasks');
      alert('Tareas asignadas con éxito');
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al asignar las tareas');
    }
  }


  return (
    <div className={`container py-5 ${styles['dashboard-container']}`}>
      <h1 className="h3 mb-3 fw-normal text-center">Bienvenido a tu panel de control</h1>
      <button className={`btn btn-lg btn-primary ${styles['logout-button']}`} onClick={handleLogout}>Cerrar sesión</button>
      <button className={`btn btn-lg btn-secondary ${styles['assign-tasks-button']}`} onClick={assignTasks}>Asignar tareas ahora</button>
    </div>
  )
}
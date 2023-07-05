import { useRouter } from 'next/router'
import styles from '../styles/Dashboard.module.css'
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch('http://localhost:3001/tenant_tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Error fetching tasks:', response.statusText);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className={`container py-5 ${styles['dashboard-container']}`}>
      <h1 className="h3 mb-3 fw-normal text-center">Bienvenido a tu panel de control</h1>
      <h1 className="h3 mb-3 fw-normal text-center">TENANT</h1>
      <button className={`btn btn-lg btn-primary ${styles['logout-button']}`} onClick={handleLogout}>Cerrar sesión</button>
      <div className="tasks">
        {tasks.map(task => (
          <div key={task.id}>
            <p>{task.task} - {task.day}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
// user_dashboard.tsx
import { useRouter } from 'next/router'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Row, Col, Table, Badge } from 'react-bootstrap';
import { HouseFill, FileEarmark, Cart, People, GraphUp, Puzzle } from 'react-bootstrap-icons';

export default function Dashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Verificar que estamos en el cliente antes de hacer la llamada al servidor
    if (typeof window !== 'undefined') {
      fetchTasks();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

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
      const fetchedTasks = await response.json();
      setTasks(fetchedTasks);
    } else {
      console.error('Error fetching tasks:', response.statusText);
    }
  };

  return (
    <div>
      <Navbar className="bg-dark">
        <Container fluid>
          <Navbar.Brand href="#" className="text-white">Roomy Share | Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Col xs={2} id="sidebar-wrapper">      
            <Nav className="flex-column">
              <Nav.Link href="#"><HouseFill /> Dashboard</Nav.Link>
              <Nav.Link href="#"><FileEarmark /> Orders</Nav.Link>
              <Nav.Link href="#"><Cart /> Products</Nav.Link>
              <Nav.Link href="#"><People /> Customers</Nav.Link>
              <Nav.Link href="#"><GraphUp /> Reports</Nav.Link>
              <Nav.Link href="#"><Puzzle /> Integrations</Nav.Link>
            </Nav>
          </Col>
          <Col xs={10} id="page-content-wrapper">
            <h1 className="h3 mb-3 fw-normal text-center">Bienvenido a tu panel de control</h1>
            <h1 className="h3 mb-3 fw-normal text-center">TENANT</h1>
            <div className="tasks">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Task</th>
                    <th>Responsable</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, i) => (
                    <tr key={i}>
                      <td>{new Date(task.day).toLocaleDateString()}</td>
                      <td>{task.task}</td>
                      <td>{task.name} {task.lastname}</td>
                      <td>{task.completed ? <Badge bg="success">Completado</Badge> : <Badge bg="danger">Pendiente</Badge>}</td>
                      <td>
                        {!task.completed && (
                          <Button onClick={() => handleMarkAsComplete(task)}>Marcar como completo</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )

  async function handleMarkAsComplete(task) {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const response = await fetch(`http://localhost:3001/tenant_tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ completed: true })
    });

    if (response.ok) {
      fetchTasks();
    } else {
      console.error('Error marking task as completed:', response.statusText);
    }
  }
}
// dashboard.tsx
import { useRouter } from 'next/router'
import axios from 'axios';
import styles from '../styles/Dashboard.module.css'
import { Navbar, Nav, Container, Button, Row, Col } from 'react-bootstrap';
import { HouseFill, FileEarmark, Cart, People, GraphUp, Puzzle } from 'react-bootstrap-icons';

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
    <div>
      <Navbar className="bg-dark">
        <Container fluid>
          <Navbar.Brand href="#" className="text-white">Roomy Share | Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button className="btn btn-primary" onClick={assignTasks}>Asignar tareas ahora</Button>
            <Button className="btn btn-danger ms-2" onClick={handleLogout}>Cerrar sesión</Button>
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
            <h1>MAMAHUEVO</h1>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
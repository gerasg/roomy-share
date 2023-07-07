// user_dashboard.tsx
import { useRouter } from 'next/router'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Row, Col } from 'react-bootstrap';
import { HouseFill, FileEarmark, Cart, People, GraphUp, Puzzle } from 'react-bootstrap-icons';
import { Chrono }  from 'react-chrono'; // import the Chrono component

export default function Dashboard() {
  const router = useRouter()
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    // Verificar que estamos en el cliente antes de hacer la llamada al servidor
    if (typeof window !== 'undefined') {
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    console.log('timelineData has been updated:', timelineData);
  }, [timelineData]); // This effect runs whenever timelineData changes  

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
      const tasks = await response.json();
    
      // Prepare the data for the Chrono component directly after fetching
      const data = tasks.map(task => ({
        title: task.task,
        cardSubtitle: task.completed ? 'Completed' : 'Pending',
        cardDetailedText: `Task Date: ${new Date(task.day).toLocaleDateString()}`,
      }));
    
      console.log('Formatted data:', data); // Confirm the data looks as expected
    
      // Check the length of the data array before setting it
      if (data.length > 0) {
        setTimelineData(data);
      } else {
        console.warn('Data array is empty');
      }
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
              {timelineData.length > 0 && <Chrono items={timelineData} mode="VERTICAL" />}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { HouseFill } from 'react-bootstrap-icons';
import styled from 'styled-components';

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #18191F;
  color: #FFFFFF;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const SideNav = styled.div`
  flex: 0 0 240px;
  background: #212431;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    flex: 0 0 auto;
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  color: #FFFFFF;
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  gap: 1rem;
  transition: 0.3s ease-in-out;

  &:hover {
    color: #1ABC9C;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    margin-bottom: 0;
  }
`;

const Card = styled.div`
  background: #2C2F47;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: #FFFFFF;

  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #353848;

  &:last-child {
    border-bottom: none;
  }
`;

const TableData = styled.td`
  padding: 1rem 0;
  color: #FFFFFF;

  &:first-child {
    padding-right: 2rem;
  }
`;

const Button = styled.button`
  background: #1ABC9C;
  border: none;
  padding: 0.75rem 1.5rem;
  color: #FFFFFF;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    background: #16A085;
  }
`;

const StyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchAdminTasks();
      fetchAdminPayments();
    }
  }, []);

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

  const fetchAdminTasks = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const response = await fetch('http://localhost:3001/admin_tasks', {
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

  const fetchAdminPayments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
  
    const response = await fetch('http://localhost:3001/admin_payments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  
    if (response.ok) {
      const fetchedPayments = await response.json();
      setPayments(fetchedPayments);
    } else {
      console.error('Error fetching payments:', response.statusText);
    }
  };  

  return (
    <DashboardWrapper>
      <SideNav>
        <NavItem href="/admin"><HouseFill /></NavItem>
      </SideNav>
      <MainContent>
        <Card>
          <h1>Bienvenido a tu panel de control</h1>
          <Button onClick={handleLogout}>Cerrar sesión</Button>
        </Card>
        <Card>
        <TableContainer>
          <Table>
              <thead>
                <TableRow>
                  <TableData>Fecha</TableData>
                  <TableData>Task</TableData>
                  <TableData>Status</TableData>
                </TableRow>
              </thead>
              <tbody>
              {tasks.map((task, i) => (
                  <TableRow key={i}>
                    <TableData>{new Date(task.day).toLocaleDateString()}</TableData>
                    <TableData>{task.task}</TableData>
                    <TableData>{task.completed ? <Badge bg="success">Completado</Badge> : <Badge bg="danger">Pendiente</Badge>}</TableData>
                  </TableRow>
                ))}
            </tbody>
          </Table>
        </TableContainer>

        </Card>
        <Card>
          <TableContainer>
            <Table>
              <thead>
                <TableRow>
                  <TableData>Fecha de pago</TableData>
                  <TableData>Cantidad pagada</TableData>
                  <TableData>Estado</TableData>
                </TableRow>
              </thead>
              <tbody>
                {payments.map((payment, i) => (
                  <TableRow key={i}>
                    <TableData>{new Date(payment.payment_date).toLocaleDateString()}</TableData>
                    <TableData>{payment.amount_paid}</TableData>
                    <TableData>
                      {payment.status === 'paid' 
                        ? <Badge bg="success">Pagado</Badge> 
                        : <Badge bg="danger">Pendiente</Badge>
                      }
                    </TableData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </Card>
      </MainContent>
    </DashboardWrapper>
  );
}

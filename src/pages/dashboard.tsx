import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { Badge } from 'react-bootstrap';
import { HouseFill, InfoCircle, BoxArrowInRight, Wallet2, PeopleFill, Wrench, ClipboardCheck } from 'react-bootstrap-icons';
import styled from 'styled-components';
import { useTable, useSortBy } from 'react-table';

export const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #18191F;
  color: #FFFFFF;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const TableContainer = styled.div`
  max-height: 400px; // Para 10 filas
  overflow-x: auto;
  overflow-y: auto; // Para permitir el desplazamiento vertical
`;

export const SideNav = styled.div`
  flex: 0 0 24px;
  background: #212431;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start; // Change this line
  justify-content: flex-start; // Add this line

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    flex: 0 0 auto;
  }
`;

export const MainContent = styled.div`
  flex-grow: 1;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const NavItem = styled.a`
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

export const Card = styled.div`
  background: #2C2F47;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: #FFFFFF;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); // Adding box-shadow for modern shadow effect.
  transition: transform 0.2s, box-shadow 0.2s; // Adding transition for smooth transform effect.

  &:hover {
    transform: scale(1.01); // Card grows a bit on hover.
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.19), 0 8px 8px rgba(0, 0, 0, 0.23); // Bigger shadow on hover.
  }

  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

export const CardTitle = styled.h2`
  color: #FFFFFF;
`;


export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #353848;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableData = styled.td`
  padding: 1rem 0;
  color: #FFFFFF;
  text-align: center;

  &:first-child {
    padding-right: 2rem;
  }
`;

export const TableHeader = styled.th`
  padding: 1rem 0;
  color: #FFFFFF;
  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid #FFFFFF;
  position: sticky;
  top: 0;
  background: #2C2F47; // Asegúrate de que este color de fondo no sea transparente
  z-index: 2; // Un z-index más alto para asegurarse de que esté sobre los otros elementos
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); // Añade una sombra para una línea divisoria más definida
  height: 90px; // Aumenta la altura si es necesario

  &:first-child {
    padding-right: 2rem;
  }

  &:before {
    content: "";
    display: block;
    position: absolute;
    top: -1px; // Un poco arriba para cubrir completamente el borde superior
    left: 0;
    right: 0;
    bottom: 0;
    background: #2C2F47; // El mismo color de fondo sólido
    z-index: -1; // Debajo del contenido del th pero por encima del tbody
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    height: 2px; // Altura de la sombra/borde inferior
    bottom: -2px; // Directamente debajo del borde inferior del th
    background: #2f3146; // El color de la sombra/borde
    z-index: 1; // Por encima del contenido del th
  }
`;

export const Button = styled.button`
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

export const StyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchAdminTasks();
      fetchAdminPayments();
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('lastname');
    localStorage.removeItem('contract_end_date');
    router.push('/login');
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
  
  const columnsTasks = useMemo(
    () => [
      {
        Header: "Fecha",
        accessor: "day",
        Cell: ({ value }) => new Date(value).toLocaleDateString('en-GB', { timeZone: 'Europe/Madrid' }),
      },
      {
        Header: "Task",
        accessor: "task"
      },
      {
        Header: "Status",
        accessor: "completed",
        Cell: ({ value }) => value ? <Badge bg="success">Completado</Badge> : <Badge bg="danger">Pendiente</Badge>
      },
    ],
    []
  );

  const columnsPayments = useMemo(
    () => [
      {
        Header: "Fecha de pago",
        accessor: "payment_date",
        Cell: ({ value }) => new Date(value).toLocaleDateString('en-GB', { timeZone: 'Europe/Madrid' }),
      },
      {
        Header: "Cantidad pagada",
        accessor: "amount_paid"
      },
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ value }) => value === 'paid' ? <Badge bg="success">Pagado</Badge> : <Badge bg="danger">Pendiente</Badge>
      },
    ],
    []
  );

  const {
    getTableProps: getTablePropsTasks,
    getTableBodyProps: getTableBodyPropsTasks,
    headerGroups: headerGroupsTasks,
    rows: rowsTasks,
    prepareRow: prepareRowTasks,
  } = useTable({ columns: columnsTasks, data: tasks }, useSortBy);

  const {
    getTableProps: getTablePropsPayments,
    getTableBodyProps: getTableBodyPropsPayments,
    headerGroups: headerGroupsPayments,
    rows: rowsPayments,
    prepareRow: prepareRowPayments,
  } = useTable({ columns: columnsPayments, data: payments }, useSortBy);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || role !== 'owner') {
      router.push('/error');
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // or any loading indicator you prefer
  }

  return (
    <DashboardWrapper>
      <SideNav>
        <NavItem href="/"><HouseFill /><span>Home</span></NavItem>
        <NavItem href="/wiki"><InfoCircle /><span>Wiki</span></NavItem>
        <NavItem href="/expenses"><Wallet2 /><span>Expenses</span></NavItem>
        <NavItem href="/tenants"><PeopleFill /><span>Tenants</span></NavItem>
        <NavItem href="/maintenance"><Wrench /><span>Maintenance</span></NavItem>
        <NavItem href="/tasks-dashboard"><ClipboardCheck /><span>Tasks</span></NavItem>
        <NavItem href="/" onClick={handleLogout}><BoxArrowInRight /><span>Logout</span></NavItem>
      </SideNav>
      <MainContent>
        <Card>
          <h1>Bienvenido a tu panel de control</h1>
        </Card>
        <Card>
        <CardTitle>Tasks</CardTitle>
        <TableContainer>
          <Table {...getTablePropsTasks()}>
            <thead>
            {headerGroupsTasks.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableHeader {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </TableHeader>
                ))}
              </TableRow>
            ))}
            </thead>
            <tbody {...getTableBodyPropsTasks()}>
              {rowsTasks.map((row) => {
                prepareRowTasks(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => <TableData {...cell.getCellProps()}>{cell.render('Cell')}</TableData>)}
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
      </TableContainer>
        </Card>
        <Card>
        <CardTitle>Payments</CardTitle>
        <TableContainer>
        <Table {...getTablePropsPayments()}>
          <thead>
            {headerGroupsPayments.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableHeader {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </TableHeader>
                ))}
              </TableRow>
            ))}
          </thead>
          <tbody {...getTableBodyPropsPayments()}>
            {rowsPayments.map((row) => {
              prepareRowPayments(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => <TableData {...cell.getCellProps()}>{cell.render('Cell')}</TableData>)}
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
        </Card>
      </MainContent>
    </DashboardWrapper>
  );
}

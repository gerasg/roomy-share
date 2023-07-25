// user_dashboard.tsx
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { Badge } from 'react-bootstrap';
import { HouseFill, InfoCircle, BoxArrowInRight, Info, ListTask, Cash } from 'react-bootstrap-icons';
import styled, { css, keyframes } from 'styled-components';
import { useTable, useSortBy } from 'react-table';

const StyledListTask = styled(ListTask)`
  margin-right: 10px;
`;

const StyledCash = styled(Cash)`
  margin-right: 10px;
`;

// Define la animación
const gradientAnimation = keyframes`
  0%{background-position:83% 0%}
  50%{background-position:18% 100%}
  100%{background-position:83% 0%}
`;

// Crea un mixin que utiliza la animación definida
const gradientBackground = css`
  background: linear-gradient(270deg, #00ffbd, #d974ff, #747dff, #ffb600);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 30s ease infinite;
`;

// Define el componente InfoCard usando el mixin
const InfoCard = styled.div`
  ${gradientBackground}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 15px;
  margin: 15px;
  width: calc((100% / 3) - 30px);
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  color: white;

  @media (max-width: 768px) {
    width: 100%;
  }

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }
`;

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
  max-height: 400px; // Para 10 filas
  overflow-x: auto;
  overflow-y: auto; // Para permitir el desplazamiento vertical
`;

const SideNav = styled.div`
  flex: 0 0 24px;
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
  text-align: center;

  &:first-child {
    padding-right: 2rem;
  }
`;

const TableHeader = styled.th`
  padding: 1rem 0;
  color: #FFFFFF;
  text-align: center;
  font-weight: bold; // This will make the font bold.
  border-bottom: 2px solid #FFFFFF;
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [userName, setUserName] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('lastname');
    localStorage.removeItem('contract_end_date');
    router.push('/login');
  }

  const nextPayment = useMemo(() => {
    if (payments.length > 0) {
      const lastPaymentDate = new Date(payments[payments.length - 1].payment_date);
      lastPaymentDate.setMonth(lastPaymentDate.getMonth() + 1);
      return lastPaymentDate;
    }
    return null;
  }, [payments]);

  const nextTask = useMemo(() => {
    if (tasks.length > 0) {
      return tasks.reduce((mostRecentTask, currentTask) => {
        const mostRecentDate = new Date(mostRecentTask.day);
        const currentDate = new Date(currentTask.day);
        return currentDate > mostRecentDate ? currentTask : mostRecentTask;
      }).day;
    }
    return null;
  }, [tasks]);
    
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('name');
      const lastname = localStorage.getItem('lastname');
      const contract_end_date = localStorage.getItem('contract_end_date');
      
      const user = { name, lastname, contract_end_date };
      
      if (user) {
        setUserName(user.name);
        setContractEndDate(user.contract_end_date);
      }
      fetchTasks();
      fetchPayments();
    }
  }, []);

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

  const handleMarkAsComplete = async (task) => {
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

  const fetchPayments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
  
    const response = await fetch('http://localhost:3001/payments', {
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
        Header: 'Fecha',
        accessor: 'day',
        Cell: ({ value }) => new Date(value).toLocaleDateString('en-GB', { timeZone: 'Europe/Madrid' }),
      },
      {
        Header: 'Task',
        accessor: 'task',
      },
      {
        Header: 'Status',
        accessor: 'completed',
        Cell: ({ value }) => (value ? <Badge bg="success">Completado</Badge> : <Badge bg="danger">Pendiente</Badge>)
      },
      {
        id: 'checkbox',
        accessor: '',
        Cell: ({ row }) => (
          <StyledCheckbox 
            type="checkbox" 
            checked={row.original.completed} 
            onChange={() => handleMarkAsComplete(row.original)} 
            disabled={row.original.completed} 
          />
        ),
      }
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

  const columnsPayments = useMemo(
    () => [
      {
        Header: 'Fecha de pago',
        accessor: 'payment_date',
        Cell: ({ value }) => new Date(value).toLocaleDateString('en-GB', { timeZone: 'Europe/Madrid' }),
      },
      {
        Header: 'Cantidad pagada',
        accessor: 'amount_paid',
      },
      {
        Header: 'Estado',
        accessor: 'status',
        Cell: ({ value }) => (value === 'paid' ? <Badge bg="success">Pagado</Badge> : <Badge bg="danger">Pendiente</Badge>)
      },
    ],
    []
  );
  
  const {
    getTableProps: getTablePropsPayments,
    getTableBodyProps: getTableBodyPropsPayments,
    headerGroups: headerGroupsPayments,
    rows: rowsPayments,
    prepareRow: prepareRowPayments,
  } = useTable({ columns: columnsPayments, data: payments }, useSortBy);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || role !== 'tenant') {
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
        <NavItem href="/"><HouseFill />Home</NavItem>
        <NavItem href="/wiki"><InfoCircle />Wiki</NavItem>
        <NavItem href="/" onClick={handleLogout}><BoxArrowInRight />Logout</NavItem>
      </SideNav>
      <MainContent>
        <h2>Bienvenido {userName}</h2>
        <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
          <InfoCard>
            <h4>Fin contrato</h4>
            <h3>{contractEndDate ? new Date(contractEndDate).toLocaleDateString('en-GB', { timeZone: 'Europe/Madrid' }) : 'Cargando...'}</h3>
          </InfoCard>
          <InfoCard>
            <h4>Próximo pago</h4>
            <h3>{nextPayment ? new Date(nextPayment).toLocaleDateString('en-GB', { timeZone: 'Europe/Madrid' }) : 'Cargando...'}</h3>
          </InfoCard>
          <InfoCard>
            <h4>Próxima tarea</h4>
            <h3>{nextTask ? new Date(nextTask).toLocaleDateString('en-GB', { timeZone: 'Europe/Madrid' }) : 'Cargando...'}</h3>
          </InfoCard>
        </div>
        <h2><StyledListTask />Tareas</h2>
        <Card>
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
        <h2><StyledCash />Pagos</h2>
        <Card>
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
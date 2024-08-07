import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
import { Badge } from 'react-bootstrap';
import { HouseFill, InfoCircle, BoxArrowInRight, Wallet2, PeopleFill, Wrench, ClipboardCheck } from 'react-bootstrap-icons';
import { DashboardWrapper, SideNav, MainContent, NavItem, Card, CardTitle, Table, TableRow, TableData, TableHeader, Button } from './dashboard';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const router = useRouter();

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
        { label: 'Rent', data: [], backgroundColor: 'rgba(255, 99, 132, 0.2)' },
        { label: 'Water', data: [], backgroundColor: 'rgba(54, 162, 235, 0.2)' },
        { label: 'Gas', data: [], backgroundColor: 'rgba(54, 192, 235, 0.2)' },
        { label: 'Electricity', data: [], backgroundColor: 'rgba(74, 162, 235, 0.2)' },
        { label: 'Internet', data: [], backgroundColor: 'rgba(54, 142, 135, 0.2)' },
        { label: 'Others', data: [], backgroundColor: 'rgba(34, 182, 135, 0.2)' },
        ]
    });

    // Define options for the chart
    const options = {
        scales: {
          x: {
            type: 'category',
            labels: Array.from({ length: 12 }, (_, i) => i + 1), // Months 1-12
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            max: 1000 // Set maximum value for Y-axis
          },
        },
    };      

    useEffect(() => {
        if (monthlyExpenses.length > 0) {
          // Define categories
          const categories = ['Rent', 'Water', 'Gas', 'Electricity', 'Internet', 'Others'];
      
          // Function to generate a random color
          const randomColor = () => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return `rgba(${r}, ${g}, ${b}, 0.2)`;
          };
      
          // Initialize datasets with empty data and random colors
          const datasets = categories.map(category => ({
            label: category,
            data: Array(12).fill(0), // Assuming 12 months
            backgroundColor: randomColor(),
          }));
      
          // Populate the datasets
          monthlyExpenses.forEach(expense => {
            const monthIndex = parseInt(expense.month) - 1; // Convert month to zero-based index
            const categoryIndex = categories.indexOf(expense.expense_type);
      
            if (categoryIndex !== -1) {
              datasets[categoryIndex].data[monthIndex] += parseFloat(expense.total_amount);
            }
          });
      
          // Update the chart data in state
          setChartData({
            labels: Array.from({ length: 12 }, (_, i) => i + 1), // Months 1-12
            datasets: datasets
          });
        }
      }, [monthlyExpenses]);
       

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/expenses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        setExpenses(response.data);
      } else {
        // Handle non-200 responses
        console.error('Failed to fetch expenses:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // Handle errors (e.g., network error, server error)
    }
  };
   
  const fetchMonthlyExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/monthly_expenses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        setMonthlyExpenses(response.data);
        // You might need to transform this data to fit the format expected by your chart library
      } else {
        // Handle non-200 responses
        console.error('Failed to fetch monthly expenses:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
      // Handle errors
    }
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Logic to submit new expense
  };
  

  if (!expenses) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardWrapper>
      <SideNav>
        {/* Same Sidebar as Dashboard */}
        <NavItem href="/"><HouseFill /><span>Home</span></NavItem>
        <NavItem href="/wiki"><InfoCircle /><span>Wiki</span></NavItem>
        <NavItem href="/expenses"><Wallet2 /><span>Expenses</span></NavItem>
        <NavItem href="/tenants"><PeopleFill /><span>Tenants</span></NavItem>
        <NavItem href="/maintenance"><Wrench /><span>Maintenance</span></NavItem>
        <NavItem href="/tasks-dashboard"><ClipboardCheck /><span>Tasks</span></NavItem>
        <NavItem href="/" onClick={() => router.push('/login')}><BoxArrowInRight /><span>Logout</span></NavItem>
      </SideNav>
      <MainContent>
        <Card>
          <CardTitle>Expenses Overview</CardTitle>
          <Bar data={chartData} options={options} />
        </Card>
        <Card>
          <CardTitle>All Expenses</CardTitle>
          <Table>
            {/* Table content */}
          </Table>
        </Card>
        <Card>
          <CardTitle>Add New Expense</CardTitle>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <Button type="submit">Add Expense</Button>
          </form>
        </Card>
      </MainContent>
    </DashboardWrapper>
  );
}
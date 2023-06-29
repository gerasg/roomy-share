import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Badge, Row, Col, Container, Form } from 'react-bootstrap';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import Footer from '../components/Footer'
import Header from '../components/Header'

export default function Booking() {
  const [rooms, setRooms] = useState([]);
  const [value, setValue] = useState([new Date(), new Date()]);
  const [bookingForm, setBookingForm] = useState({open: false, roomNumber: null});
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchRooms(value);
  }, []);

  const fetchRooms = (dateRange) => {
    if (!dateRange || dateRange.length !== 2 || !dateRange[0] || !dateRange[1]) {
        console.error("Invalid date range:", dateRange);
        setErrorMessage("Invalid date range");
        return;
    }

    axios.get('http://localhost:3001/available_rooms', {
      params: {
        startDate: dateRange[0].toISOString(),
        endDate: dateRange[1].toISOString()
      }
    })
      .then((response) => {
        setRooms(response.data);
        setErrorMessage(null); // reset error message
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("An error occurred while fetching rooms. Please try again.");
      });
  }

  const bookRoom = (roomNumber) => {
    axios.post('http://localhost:3001/booking', {
      startDate: value[0],
      endDate: value[1],
      roomNumber: roomNumber
    })
    .then((response) => {
      alert(response.data.message);
      setErrorMessage(null); // reset error message
    })
    .catch((error) => {
      console.error(error);
      setErrorMessage(error.response.data.message);
    });
  }

  const handleDateChange = (val) => {
    setValue(val);
    fetchRooms(val);
  };

  return (
    <div>
      <Header />
      <Container>
        <h1>Reserva una habitación</h1>
        <DateRangePicker onChange={handleDateChange} value={value} />
        {errorMessage && <div>{errorMessage}</div>} // render error message if present
        <Row xs={1} sm={2} md={4} className="g-4">
          {rooms.map(room => (
            <Col key={room.room_id}>
              <Card className="h-100">
                <Card.Img variant="top" src={`/images/room${room.room_number - 100}.jpg`} />
                <Card.Body>
                  <Card.Title>Habitación {room.room_number}</Card.Title>
                  <Card.Text>
                  <Badge bg={room.is_available ? 'success' : 'danger'}>
                    {room.is_available ? 'Libre' : 'Ocupado'}
                  </Badge>
                  </Card.Text>
                  <Button onClick={() => setBookingForm({open: true, roomNumber: room.room_number})} disabled={!!room.tenant_id}>Reservar</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {bookingForm.open &&
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control type="text" placeholder="Nombre completo" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>

            <Button variant="primary" onClick={() => {bookRoom(bookingForm.roomNumber); setBookingForm({open: false, roomNumber: null});}}>
              Confirmar Reserva
            </Button>
          </Form>
        }
      </Container>
      <Footer />
    </div>
  );
}
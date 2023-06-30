import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import { Card, Button, Badge, Row, Col, Container, Form, ProgressBar, Modal } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Footer from '../components/Footer'
import Header from '../components/Header'
import styles from '../styles/Booking.module.css'

export default function Booking() {
  const [rooms, setRooms] = useState([]);
  const [value, setValue] = useState([new Date(), new Date()]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({name: '', email: ''});
  const [showModal, setShowModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({open: false, roomNumber: null, roomName: ''});
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 960px)' }); 

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
    // Calcula la diferencia en días
    const differenceInDays = Math.floor((val[1].getTime() - val[0].getTime()) / (1000 * 60 * 60 * 24));
  
    // Comprueba si la diferencia es menor que 30 días
    if (differenceInDays < 30) {
      alert('La estancia mínima es de 1 mes. Por favor, selecciona un rango de fechas de al menos 30 días. Si deseas una estancia más corta, contáctanos directamente.');
      return;
    }
  
    setValue(val);
    fetchRooms(val);
    setStep(2);
  };

  const handleSelectRoom = (roomNumber) => {
    setBookingForm({open: true, roomNumber: roomNumber});
    setStep(3);
  };

  const handleSubmitForm = (formData) => {
    setBookingData(formData);
    setStep(4);
  };

  const handleConfirm = () => {
    bookRoom(bookingForm.roomNumber);
    setStep(5);
  };

  return (
    <div className={styles.mainContainer}>
      <Header />
      <Container className={styles.content}>
        <h1 className={styles.reserveRoomTitle}>Reserva una habitación</h1>
        <ProgressBar 
          className={styles.progressBar} 
          animated 
          now={(step/5)*100} 
          label={isTabletOrMobile ? `${step}/5` : `Paso ${step} de 5`} 
        />
        {step === 1 && (
          <div className={styles['date-picker']}>
            <Step1 value={value} onDateChange={handleDateChange} />
          </div>
        )}
        {step === 2 && (
          <div className={styles['room-cards']}>
            <Step2 rooms={rooms} onSelectRoom={handleSelectRoom} setStep={setStep} step={step} />
          </div>
        )}
        {step === 3 && (
          <Container>
            <Step3 
              onSubmitForm={handleSubmitForm} 
              roomNumber={bookingForm.roomNumber}
              setStep={setStep} 
              step={step} 
              setShowModal={setShowModal} 
              showModal={showModal} 
            />
          </Container>
        )}
        {step === 4 && (
          <Container>
            <Step4 
              bookingData={bookingForm}
              onConfirm={handleConfirm} 
              setStep={setStep} 
              step={step} 
            />
          </Container>
        )}
        {step === 5 && (
          <Step5 />
        )}
      </Container>
      <Footer />
    </div>
  );
}


function Step1({ value, onDateChange }) {
  return (
    <>
      <div className={styles.instructions}>
        <div className={styles.message1}>
          <p>👇 Por favor, elige las fechas en las que te gustaría entrar a vivir 👇</p>
        </div>
        <div className={styles.message2}>
          <p>Por favor, elige las fechas en las que te gustaría entrar a vivir</p>
          <div className={styles.emojiContainer}>
            <p className={styles.emoji}>👇</p>
          </div>
        </div>
      </div>
      <div className={styles.datePicker}>
        <Calendar onChange={onDateChange} value={value} selectRange={true} locale="en-US" />
      </div>
    </>
  );
}

function Step2({ rooms, onSelectRoom, setStep, step }) {
  return (
    <Row xs={1} sm={2} md={4} className="g-4">
      {rooms.map(room => (
        <Col key={room.room_id}>
          <div className={styles.roomCards}>
            <Card className="h-100">
              <Card.Img variant="top" src={`/images/room${room.room_number - 100}.jpg`} />
              <Card.Body>
                <Card.Title>Habitación {room.room_number}</Card.Title>
                <Card.Text>
                  <Badge bg={room.is_available ? 'success' : 'danger'}>
                    {room.is_available ? 'Libre' : 'Ocupado'}
                  </Badge>
                </Card.Text>
                <Button onClick={() => onSelectRoom(room.room_number)} disabled={!room.is_available}>Seleccionar</Button>
              </Card.Body>
            </Card>
          </div>
        </Col>
      ))}
    <Button className="mt-2 w-auto" onClick={() => setStep(step - 1)}>Volver</Button>
    </Row>
  );
}


function Step3({ onSubmitForm, roomNumber, setStep, step, setShowModal, showModal }) {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    room: roomNumber,
    acceptTerms: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      onSubmitForm(formData);
    }

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            minLength="2"
          />
          <Form.Control.Feedback type="invalid">Por favor, proporciona un nombre válido.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>Apellidos</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Apellidos"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">Por favor, proporciona apellidos válidos.</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
          <Form.Control.Feedback type="invalid">Por favor, proporciona un email válido.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            required
            type="tel"
            placeholder="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">Por favor, proporciona un número de teléfono válido.</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="validationCustom05">
        <Form.Label>Mensaje</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Mensaje"
          name="message"
          value={formData.message}
          onChange={handleChange}
          maxLength="500"
        />
        <Form.Control.Feedback type="invalid">Tu mensaje es demasiado largo.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="validationCustom06">
        <Form.Label>Habitación</Form.Label>
        <Form.Control plaintext readOnly value={`Habitación ${roomNumber}`} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          required
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          feedback="Debes aceptar antes de enviar."
          feedbackType="invalid"
          label={
            <>
              Acepto los{" "}
              <span onClick={() => setShowModal(true)} style={{ color: 'blue', cursor: 'pointer' }}>
                términos y condiciones
              </span>
            </>
          }
        />
      </Form.Group>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Términos y Condiciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Aquí es donde pones tus términos y condiciones */}
          <p>Tus términos y condiciones van aquí.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Button type="submit">Enviar formulario</Button>
      <Button className="mt-2 w-auto" onClick={() => setStep(step - 1)}>Volver</Button>
    </Form>
  );
}

function Step4({ bookingData, onConfirm, setStep, step }) {
  return (
    <div>
      <p>Nombre Completo: {bookingData.name}</p>
      <p>Email: {bookingData.email}</p>
      <Button variant="primary" onClick={onConfirm}>
        Confirmar
      </Button>
      <Button className="mt-2 w-auto" onClick={() => setStep(step - 1)}>Volver</Button>
    </div>
  );
}

function Step5() {
  return (
    <div>
      <p>Tu solicitud ha sido enviada. Serás redirigido en unos segundos...</p>
    </div>
  );
}
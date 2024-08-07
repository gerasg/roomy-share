import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import { Card, Button, Badge, Row, Col, Container, Form, ProgressBar, Modal, FloatingLabel } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from '../components/Header'
import styles from '../styles/Booking.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Booking() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [value, setValue] = useState([new Date(), new Date()]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    room: null,
    acceptTerms: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({open: false, roomNumber: null, roomName: ''});
  const [isTabletOrMobile, setTabletOrMobile] = useState(false);

  useEffect(() => {
    if (step === 5) {
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);
    }
  }, [step]);
  
  useEffect(() => {
    const isTabletOrMobileQuery = window.matchMedia('(max-width: 768px)');
    setTabletOrMobile(isTabletOrMobileQuery.matches);
  
    const listener = (e) => {
      setTabletOrMobile(e.matches);
    };
  
    // Change addListener to addEventListener
    isTabletOrMobileQuery.addEventListener('change', listener);
  
    // Cleanup after unmount
    return () => {
      // Change removeListener to removeEventListener
      isTabletOrMobileQuery.removeEventListener('change', listener);
    };
  }, []);
  
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
      alert(t('minimumStay'));
      return;
    }
  
    setValue(val);
    fetchRooms(val);
    setStep(2);
  };

  const handleSelectRoom = (roomNumber) => {
    setBookingData({ ...bookingData, room: roomNumber });
    setStep(3);
  };

  const handleSubmitForm = (formData) => {
    setBookingData({ ...formData });
    setBookingForm({ open: false, roomNumber: null, roomName: '' });
    setStep(4);
  };  

  const handleConfirm = () => {
    const formData = new FormData();
    formData.append('name', bookingData.name);
    formData.append('lastName', bookingData.lastName);
    formData.append('email', bookingData.email);
    formData.append('phone', bookingData.phone);
    formData.append('message', bookingData.message);
    formData.append('room', bookingData.room);
  
    axios.post('https://getform.io/f/89676701-e0f8-4332-a258-87ffbce4523b', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
      console.log(response);
      setStep(5);
    })
    .catch((error) => {
      console.log(error);
    });
  };
  
  return (
    <div className={styles.mainContainer}>
      <Header />
      <Container className={styles.content}>
        <h1 className={styles.reserveRoomTitle}>{t('bookARoom')}</h1>
        <ProgressBar 
          className={styles.progressBar} 
          animated 
          now={(step/5)*100} 
          label={
            isTabletOrMobile 
              ? `${step}/5` 
              : `${t('step')} ${step} ${t('of')} 5`
          } 
        />
        {step === 1 && (
          <div className={styles['date-picker']}>
            <Step1 value={value} onDateChange={handleDateChange} t={t}/>
          </div>
        )}
        {step === 2 && (
          <div className={styles['room-cards']}>
            <Step2 rooms={rooms} onSelectRoom={handleSelectRoom} setStep={setStep} step={step} t={t}/>
          </div>
        )}
        {step === 3 && (
          <Container>
            <Step3 
              onSubmitForm={handleSubmitForm} 
              bookingData={bookingData} 
              setBookingData={setBookingData} 
              setStep={setStep} 
              step={step} 
              setShowModal={setShowModal} 
              showModal={showModal}
              t={t}
              roomNumber={bookingForm.roomNumber}
            />
          </Container>
        )}
        {step === 4 && (
          <Container>
            <Step4 
              bookingData={bookingData}
              onConfirm={handleConfirm} 
              setStep={setStep} 
              step={step} 
              t={t}
            />
          </Container>
        )}
        {step === 5 && (
          <Step5 
          t={t}
          />
        )}
      </Container>
    </div>
  );
}



function Step1({ value, onDateChange, t }) {
  return (
    <>
      <div className={styles.instructions}>
        <div className={styles.message1}>
          <p>{t('selectDates')}</p>
          <div className={styles.emojiContainer}>
            <p className={styles.emoji}>👇</p>
          </div>
        </div>
        <div className={styles.message2}>
          <p>{t('selectDates')}</p>
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

function Step2({ rooms, onSelectRoom, setStep, step, t }) {
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
                  {room.is_available ? t('free') : t('occupied')}
                  </Badge>
                </Card.Text>
                <Button onClick={() => onSelectRoom(room.room_number)} disabled={!room.is_available}>{t('select')} </Button>
              </Card.Body>
            </Card>
          </div>
        </Col>
      ))}
      <div className={`mt-2 w-auto ${styles.stepTwoReturnButton}`}>
        <Button className="me-3 w-auto" onClick={() => setStep(step - 1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"></path>
          </svg> {t('back')} 
        </Button>
      </div>      
    </Row>
  );
}


function Step3({ onSubmitForm, bookingData, setBookingData, setStep, step, setShowModal, showModal, t }) {
  const [validated, setValidated] = useState(false);
  const [privacyPolicyShow, setPrivacyPolicyShow] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handlePrivacyPolicyClose = () => setPrivacyPolicyShow(false);
  const handleShow = () => setShowModal(true);
  const handlePrivacyPolicyShow = () => setPrivacyPolicyShow(true);

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
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
      onSubmitForm(bookingData);
    }

    setValidated(true);
  };

  useEffect(() => {
    setBookingData(prevBookingData => ({
      ...prevBookingData,
      room: bookingData.room,
    }));
  }, [bookingData.room]);

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group className="mb-3" controlId="validationCustom06">
            <Form.Label style={{whiteSpace: 'nowrap'}} className="d-flex align-items-center mb-0 col-md-2 col-sm-9">
                {t('selectedRoom')} : 
                <Badge bg='secondary' className="ml-3">
                    {bookingData.room}
                </Badge>
            </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom01" className="mb-3">
        <FloatingLabel
          controlId="floatingInput"
          label={t('firstName')} 
        >
          <Form.Control 
            type="text" 
            placeholder={t('firstName')}
            name="name"
            required
            value={bookingData.name}
            onChange={handleChange}
            minLength="2"
          />
        </FloatingLabel>
          <Form.Control.Feedback type="invalid">Por favor, proporciona un nombre válido.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="validationCustom02">
        <FloatingLabel
            controlId="floatingInput"
            label={t('lastName')}
            className="mb-3"
          >
            <Form.Control
              required
              type="text"
              placeholder={t('lastName')}
              name="lastName"
              value={bookingData.lastName}
              onChange={handleChange}
            />
          </FloatingLabel>
          <Form.Control.Feedback type="invalid">Por favor, proporciona apellidos válidos.</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
            <FloatingLabel
              controlId="floatingInput"
              label={t('email')}
              className="mb-3"
            >
            <Form.Control
              required
              type="email"
              placeholder={t('email')}
              name="email"
              value={bookingData.email}
              onChange={handleChange}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
          </FloatingLabel>
          <Form.Control.Feedback type="invalid">Por favor, proporciona un email válido.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <FloatingLabel
            controlId="floatingInput"
            label={t('phoneNumber')}
            className="mb-3"
          >
            <Form.Control
              required
              type="tel"
              placeholder={t('phoneNumber')}
              name="phone"
              value={bookingData.phone}
              onChange={handleChange}
              pattern="[0-9]{9,}"
            />
          </FloatingLabel>
          <Form.Control.Feedback type="invalid">Por favor, proporciona un número de teléfono válido.</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="validationCustom05">
        <Form.Control
          as="textarea"
          placeholder={t('message')}
          name="message"
          value={bookingData.message}
          onChange={handleChange}
          maxLength="500"
        />
        <Form.Control.Feedback type="invalid">Tu mensaje es demasiado largo.</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Check
          required
          label={
            <>
              Acepto los {" "}
              <a href="#" onClick={(e) => { e.preventDefault(); handleShow(); }}>
                Términos y Condiciones
              </a>
              {" "} y la {" "}
              <a href="#" onClick={(e) => { e.preventDefault(); handlePrivacyPolicyShow(); }}>
                Política de Privacidad
              </a>
            </>
          }
          feedback="Debes aceptar antes de enviar."
          feedbackType="invalid"
        />
      </Form.Group>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Términos y Condiciones</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable">
          <h4>Acuerdo de consulta de reservas</h4>
          <p>Al enviar una consulta de reserva a través de nuestro sitio web, usted ("el Usuario") acepta estos términos y condiciones.</p>

          <h5>1. Proceso de consulta</h5>
          <p>El envío de una consulta de reserva a través de nuestro sitio web no garantiza que la habitación esté reservada para el Usuario. La reserva está sujeta a la disponibilidad de la habitación y a la revisión de la información proporcionada por el Usuario. Una vez enviada la consulta, el propietario revisará la consulta y se pondrá en contacto con el Usuario para confirmar la disponibilidad y la aceptación de la reserva.</p>

          <h5>2. Responsabilidades del Usuario</h5>
          <p>El Usuario garantiza que toda la información proporcionada en la consulta es veraz y precisa. El Usuario es responsable de cualquier error o inexactitud en la información proporcionada.</p>

          <h5>3. Confirmación de la reserva</h5>
          <p>Si la reserva es aceptada por el propietario, el Usuario recibirá una confirmación de la reserva. La reserva no se considerará confirmada hasta que el Usuario reciba esta confirmación.</p>

          <h5>4. Cancelación y cambios</h5>
          <p>Las solicitudes de cancelación o cambios son posibles a través del formulario de contacto.</p>

          <h5>5. Privacidad</h5>
          <p>El propietario respeta la privacidad de los Usuarios y maneja sus datos personales de acuerdo con nuestra Política de Privacidad.</p>

          <h5>6. Limitación de responsabilidad</h5>
          <p>En la medida máxima permitida por la ley, el propietario no será responsable de ninguna pérdida, daño, costo o gasto incurrido en relación con cualquier consulta de reserva hecha a través de nuestro sitio web.</p>

          <h5>7. Ley aplicable</h5>
          <p>Estos términos y condiciones se rigen por las leyes del país donde se encuentra el hotel.</p>

          <h5>8. Modificación de los términos</h5>
          <p>El propietario se reserva el derecho de modificar estos términos y condiciones en cualquier momento sin previo aviso.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={privacyPolicyShow} onHide={handlePrivacyPolicyClose} scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title>Política de Privacidad</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scrollable">
        <h4>Política de Privacidad</h4>
        <p>Al utilizar nuestro sitio web y enviar una consulta de reserva, usted acepta nuestra Política de Privacidad.</p>

        <h5>1. Recopilación de datos</h5>
        <p>Recopilamos información que usted proporciona directamente a nosotros a través de la consulta de reserva. Esto incluye su nombre, correo electrónico, número de teléfono y cualquier otro detalle proporcionado en el formulario de consulta.</p>

        <h5>2. Uso de datos</h5>
        <p>Utilizamos la información recopilada para procesar su consulta de reserva y ponernos en contacto con usted. No compartimos su información personal con terceros sin su consentimiento explícito, a menos que sea necesario para cumplir con la ley o una orden judicial.</p>

        <h5>3. Seguridad de los datos</h5>
        <p>Implementamos medidas de seguridad para proteger su información personal. Sin embargo, ninguna medida de seguridad es 100% segura y, por lo tanto, no podemos garantizar la seguridad total de su información personal.</p>

        <h5>4. Cookies y tecnologías de seguimiento</h5>
        <p>Nuestro sitio web puede utilizar cookies y otras tecnologías de seguimiento para mejorar su experiencia de usuario.</p>

        <h5>5. Cambios a esta política</h5>
        <p>Nos reservamos el derecho de cambiar esta política de privacidad en cualquier momento sin previo aviso. Cualquier cambio se publicará en nuestro sitio web.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePrivacyPolicyClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Button className="me-3 w-auto" onClick={() => setStep(step - 1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"></path>
        </svg> {t('back')} 
      </Button>
      <Button type="submit">{t('sendForm')}</Button>
    </Form>
  );
}

function Step4({ bookingData, onConfirm, setStep, step, t }) {
  return (
    <div className="d-flex flex-column align-items-center text-center">
      <h2>{t('bookingSummary')} </h2>

      <p><strong>{t('firstName')} :</strong> {bookingData.name}</p>
      <p><strong>{t('lastName')} :</strong> {bookingData.lastName}</p>
      <p><strong>{t('email')} :</strong> {bookingData.email}</p>
      <p><strong>{t('phoneNumber')} :</strong> {bookingData.phone}</p>
      <p><strong>{t('message')} :</strong> {bookingData.message}</p>
      <p><strong>{t('room')} :</strong> {bookingData.room}</p>

      <div className="d-flex justify-content-center mt-4">
        <Button className="me-3 w-auto" onClick={() => setStep(step - 1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"></path>
          </svg> {t('back')}
        </Button>
        <Button variant="primary" onClick={onConfirm}>{t('confirm')}</Button>
      </div>
    </div>
  );
}

function Step5({ t }) {
  return (
    <div className="d-flex justify-content-center align-items-center text-center" style={{height: '100vh'}}>
      <p>{t('requestSent')}</p>
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'footer']),
    },
  }
}
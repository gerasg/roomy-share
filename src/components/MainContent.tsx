import { Carousel, Row, Col, Button, Image, Form, Card } from 'react-bootstrap'
import { FaCity, FaTemperatureLow, FaUmbrellaBeach } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import styles from '../styles/MainContent.module.css'
import Link from 'next/link'
import axios from 'axios';

const handleSubmit = (event) => {
  event.preventDefault();
  
  const name = event.target.elements['contactForm.Name'].value;
  const lastName = event.target.elements['contactForm.LastName'].value;
  const email = event.target.elements['contactForm.Email'].value;
  const phone = event.target.elements['contactForm.Phone'].value;
  const message = event.target.elements['contactForm.Message'].value;
  
  const formData = new FormData();
  formData.append('name', name);
  formData.append('lastName', lastName);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('message', message);

  axios.post('https://getform.io/f/89676701-e0f8-4332-a258-87ffbce4523b', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  .then((response) => {
    console.log(response);
    // Aquí puedes añadir cualquier lógica posterior al envío exitoso
  })
  .catch((error) => {
    console.log(error);
  });
};

export default function MainContent() {
  const { t } = useTranslation();
  return (
    <main className={`${styles.mainContent} d-flex flex-column justify-content-center align-items-center`}>
      <div className={styles.customContainer}>
        <Carousel fade className="mb-0" interval={30000}>
        <Carousel.Item>
          <Image src="/images/carrusel1.jpg" fluid className={styles.carouselImage} />
          <Carousel.Caption className={styles.carouselCaption}>
            <h3>{t('welcome')}</h3>
            <Link href="/booking">
              <Button variant="primary">{t('bookNow')}</Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <Image src="/images/carrusel2.jpg" fluid className={styles.carouselImage} />
            <Carousel.Caption className={styles.carouselCaption}>
            <h3>Bienvenido a Roomy Share</h3>
            <Link href="/booking">
                <Button variant="primary">{t('bookNow')}</Button>
            </Link>
            </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Row className={`${styles.featureRow} mb-4 justify-content-center`}>
        <Col xs={12} md={3} className={`text-center ${styles.cardContainer}`}>
            <Card className={`h-100 ${styles.card}`}>
              <Card.Body className={styles.cardBody}>
                <FaCity size={48} className={styles.cardIcon} />
                <Card.Title>En el centro de la ciudad</Card.Title>
                <Card.Text>Lorem ipsum dolor sit amet...</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={3} className={`text-center ${styles.cardContainer}`}>
            <Card className={`h-100 ${styles.card}`}>
              <Card.Body className={styles.cardBody}>
                <FaTemperatureLow size={48} className={styles.cardIcon} />
                <Card.Title>Aire acondicionado en toda la casa</Card.Title>
                <Card.Text>Lorem ipsum dolor sit amet...</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={3} className={`text-center ${styles.cardContainer}`}>
            <Card className={`h-100 ${styles.card}`}>
              <Card.Body className={styles.cardBody}>
                <FaUmbrellaBeach size={48} className={styles.cardIcon} />
                <Card.Title>Playa a 3 minutos andando</Card.Title>
                <Card.Text>Lorem ipsum dolor sit amet...</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <hr style={{marginTop: 0}} />
        <Row className={`${styles.masonrySection} h-50`}>
            <Col md={6}>
                <div className={`${styles.masonry}`}>
                {/* Tus imágenes aquí, deben ser 6 */}
                {['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg'].map((image, i) => (
                    <div key={i} className={`${styles.masonryItem}`}>
                    <Image src={`/images/${image}`} fluid className={`${styles.masonryImage}`} />
                    </div>
                ))}
                </div>
            </Col>
            <Col md={6} className={`m-0 p-0 ${styles.galleryCol}`}>
                <Image src="/images/grand-image.jpg" fluid className={`${styles.galleryImage}`} />
                <Link href="/gallery"><Button className={`${styles.galleryButton}`}>Ir a la Galería →</Button></Link>
            </Col>
        </Row>
        <hr style={{marginBottom: 0}} />

        <Row className={`${styles.contactSection} justify-content-center align-items-center`}>
          <Col xs={12} sm={8} md={6}>
              <div className={`${styles.contactBox}`}>
              <h3 className="text-center mb-3 text-uppercase">CONTACTAR</h3>
              <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="contactForm.Name">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" placeholder="Tu nombre" required/>
                  </Form.Group>
                  <Form.Group controlId="contactForm.LastName">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control type="text" placeholder="Tus apellidos" required/>
                  </Form.Group>
                  <Form.Group controlId="contactForm.Email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Tu correo electrónico" required/>
                  </Form.Group>
                  <Form.Group controlId="contactForm.Phone">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control type="tel" placeholder="Tu número de teléfono" required/>
                  </Form.Group>
                  <Form.Group controlId="contactForm.Message">
                    <Form.Label>Mensaje</Form.Label>
                    <Form.Control as="textarea" placeholder="Tu mensaje" required maxLength={500}/>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-2 w-20">Enviar</Button>
              </Form>
              </div>
          </Col>
        </Row>
      </div>
    </main>
  )
}
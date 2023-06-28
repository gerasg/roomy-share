import { Carousel, Row, Col, Button, Image, Form, Card } from 'react-bootstrap'
import { FaCity, FaTemperatureLow, FaUmbrellaBeach } from 'react-icons/fa'
import styles from '../styles/MainContent.module.css'
import Link from 'next/link'

export default function MainContent() {
  return (
    <main className={`${styles.mainContent} d-flex flex-column justify-content-center align-items-center`}>
      <div className={styles.customContainer}>
        <Carousel fade className="mb-0" interval={30000}>
        <Carousel.Item>
          <Image src="/images/carrusel1.jpg" fluid className={styles.carouselImage} />
          <Carousel.Caption className={styles.carouselCaption}>
            <h3>Bienvenido a Roomy Share</h3>
            <Link href="/booking">
              <Button variant="primary">¡Haz tu reserva ahora!</Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <Image src="/images/carrusel2.jpg" fluid className={styles.carouselImage} />
            <Carousel.Caption className={styles.carouselCaption}>
            <h3>Bienvenido a Roomy Share</h3>
            <Link href="/booking">
                <Button variant="primary">¡Haz tu reserva ahora!</Button>
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
            <Col md={6} className={`${styles.galleryCol}`}>
                <Image src="/images/grand-image.jpg" fluid className={`${styles.galleryImage}`} />
                <Link href="/gallery"><Button className={`${styles.galleryButton}`}>Ir a la Galería →</Button></Link>
            </Col>
        </Row>
        <hr />

        <Row className={`${styles.contactSection} justify-content-center align-items-center`}>
            <Col xs={12} sm={8} md={6}>
                <div className={`${styles.contactBox}`}>
                <h3 className="text-center mb-3">Contáctanos</h3>
                <Form>
                    <Form.Group controlId="contactForm.Email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Tu correo electrónico" />
                    </Form.Group>
                    <Form.Group controlId="contactForm.Message">
                    <Form.Label>Mensaje</Form.Label>
                    <Form.Control as="textarea" placeholder="Tu mensaje" />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">Enviar</Button>
                </Form>
                </div>
            </Col>
        </Row>
      </div>
    </main>
  )
}
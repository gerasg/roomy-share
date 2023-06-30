import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaEnvelope, FaBook, FaImage, FaQuestion, FaUser } from 'react-icons/fa'
import { useRouter } from 'next/router'
import styles from '../styles/Header.module.css'

export default function Header() {
  const router = useRouter()
  const { pathname } = router;

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/" className={styles.logo}>Roomy Share</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/" className={`${pathname === '/' ? styles.active : ''}`}><FaHome /> Inicio</Nav.Link>
            <Nav.Link href="/contact" className={`${pathname === '/contact' ? styles.active : ''}`}><FaEnvelope /> Contacto</Nav.Link>
            <Nav.Link href="/booking" className={`${pathname === '/booking' ? styles.active : ''}`}><FaBook /> Reserva</Nav.Link>
            <Nav.Link href="/gallery" className={`${pathname === '/gallery' ? styles.active : ''}`}><FaImage /> Galería</Nav.Link>
            <Nav.Link href="/faq" className={`${pathname === '/faq' ? styles.active : ''}`}><FaQuestion /> FAQ</Nav.Link>
            <Nav.Link href="/login" className={`${pathname === '/login' ? styles.active : ''}`}><FaUser /> Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
import { Navbar, Nav, Container } from 'react-bootstrap';
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
          <Nav className={`ml-auto ${styles.uppercaseLinks} ${styles.mobileCenter}`}>
            <Nav.Link href="/" className={`${pathname === '/' ? styles.active : ''}`}>Inicio</Nav.Link>
            <Nav.Link href="/booking" className={`${pathname === '/booking' ? styles.active : ''}`}>Reserva</Nav.Link>
            <Nav.Link href="/gallery" className={`${pathname === '/gallery' ? styles.active : ''}`}>Galería</Nav.Link>
            <Nav.Link href="/faq" className={`${pathname === '/faq' ? styles.active : ''}`}>FAQ</Nav.Link>
            <Nav.Link href="/login" className={`${pathname === '/login' ? styles.active : ''}`}>Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
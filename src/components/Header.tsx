import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { i18n as i18nextInstance } from 'next-i18next';
import styles from '../styles/Header.module.css';

export default function Header() {
  const { t, i18n } = useTranslation('common');
  const [language, setLanguage] = useState('EN');
  const router = useRouter();
  const { pathname } = router;

  // Change the state when i18n.language changes
  useEffect(() => {
    if (i18n && i18n.language) {
      setLanguage(i18n.language.toUpperCase());
    }
  }, [i18n]);

  const changeLanguage = (lng) => {
    lng = lng.toLowerCase();  // Convert the language to lowercase before passing it to i18n
    setLanguage(lng.toUpperCase());  // Keep this uppercase for the display
    // Remove the locale prefix from the current path
    const currentPath = pathname.startsWith(`/${i18n.language}`) 
      ? pathname.slice(i18n.language.length + 1)
      : pathname;
    // Push the new locale and current path
    router.push(currentPath, undefined, { locale: lng });
};


  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/" className={styles.logo}>Roomy Share</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`ml-auto ${styles.uppercaseLinks} ${styles.mobileCenter}`}>
            <Nav.Link href="/" className={`${pathname === '/' ? styles.active : ''}`}>{t('home')}</Nav.Link>
            <Nav.Link href="/booking" className={`${pathname === '/booking' ? styles.active : ''}`}>{t('booking')}</Nav.Link>
            <Nav.Link href="/gallery" className={`${pathname === '/gallery' ? styles.active : ''}`}>{t('gallery')}</Nav.Link>
            <Nav.Link href="/faq" className={`${pathname === '/faq' ? styles.active : ''}`}>{t('faq')}</Nav.Link>
            <Nav.Link href="/login" className={`${pathname === '/login' ? styles.active : ''}`}>{t('login')}</Nav.Link>
            <NavDropdown title={i18n && i18n.language ? i18n.language.toUpperCase() : 'EN'} id="basic-nav-dropdown" onSelect={changeLanguage}>
              <NavDropdown.Item eventKey="en">EN</NavDropdown.Item>
              <NavDropdown.Item eventKey="es">ES</NavDropdown.Item>
              <NavDropdown.Item eventKey="ja">日本語</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
import { FaHome, FaEnvelope, FaBook, FaImage, FaQuestion, FaUser } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/Header.module.css'

export default function Header() {
  const router = useRouter()

  return (
    <header className={`${styles.headerContainer} bg-light`}>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-3">
            <h1 className={`${styles.logo} text-primary`}>Roomy Share</h1>
          </div>
          <div className="col-md-9">
            <nav className="d-flex justify-content-around">
              <NavLink href="/" label="Inicio" Icon={FaHome} activeRoute={router.pathname} />
              <NavLink href="/contact" label="Contacto" Icon={FaEnvelope} activeRoute={router.pathname} />
              <NavLink href="/booking" label="Reserva" Icon={FaBook} activeRoute={router.pathname} />
              <NavLink href="/gallery" label="Galería" Icon={FaImage} activeRoute={router.pathname} />
              <NavLink href="/faq" label="FAQ" Icon={FaQuestion} activeRoute={router.pathname} />
              <NavLink href="/login" label="Login" Icon={FaUser} activeRoute={router.pathname} />
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, label, Icon, activeRoute }) {
  const isActive = activeRoute === href
  return (
    <Link legacyBehavior href={href}>
      <a className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Icon />
          <span style={{marginLeft: '0.5rem'}}>{label}</span>
        </div>
      </a>
    </Link>
  )
}
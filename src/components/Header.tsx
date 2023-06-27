import Link from 'next/link'
import styles from '../styles/Header.module.css'

export default function Header() {
  return (
    <header className={`${styles.headerContainer} bg-light`}>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-3">
            <h1 className={`${styles.logo} text-primary`}>Roomy Share</h1>
          </div>
          <div className="col-md-9">
            <nav className="d-flex justify-content-around">
              <Link href="/" className="text-dark">
                Inicio
              </Link>
              <Link href="/contact" className="text-dark">
                Contacto
              </Link>
              <Link href="/booking" className="text-dark">
                Reserva
              </Link>
              <Link href="/gallery" className="text-dark">
                Galería
              </Link>
              <Link href="/faq" className="text-dark">
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
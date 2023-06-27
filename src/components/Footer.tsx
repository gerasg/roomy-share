import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={`${styles.footerContainer} bg-light`}>
      <div className="container d-flex justify-content-center align-items-center">
        <p className="text-center">© {new Date().getFullYear()} Roomy Share. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
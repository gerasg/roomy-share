import styles from '../styles/MainContent.module.css'

export default function MainContent() {
  return (
    <main className={`${styles.mainContent} d-flex justify-content-center align-items-center`}>
      <div className="container">
        <h1 className="text-center">Bienvenido a Roomy Share</h1>
        <p className="text-center">Encuentra y reserva habitaciones de alquiler en Badalona, Barcelona</p>
      </div>
    </main>
  )
}
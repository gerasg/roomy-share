import 'bootstrap/dist/css/bootstrap.css'
import '../styles/Dashboard.css'  // <--- Aquí importamos los estilos de Dashboard
import type { AppProps } from 'next/app'
import Footer from '../components/Footer'
import styles from '../styles/App.module.css'  
import '../styles/Faq.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.site}>
      <div className={styles.siteContent}>
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  )
}

export default MyApp
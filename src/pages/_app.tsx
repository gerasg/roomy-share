import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import Footer from '../components/Footer'
import styles from '../styles/App.module.css'  
import '../styles/Faq.css'
import { appWithTranslation } from 'next-i18next'
import { SSRProvider } from 'react-bootstrap'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
    <div className={styles.site}>
      <div className={styles.siteContent}>
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
    </SSRProvider>
  )
}

export default appWithTranslation(MyApp)
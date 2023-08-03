import Header from '../components/Header'
import MainContent from '../components/MainContent'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../styles/Home.module.css'

const Home = () => {
  return (
    <div className={styles.container}>
      <Header />
      <MainContent />
    </div>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'footer']),
    },
  }
}

export default Home;
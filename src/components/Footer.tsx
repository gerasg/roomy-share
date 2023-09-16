import styles from '../styles/Footer.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={`${styles.footerContainer} bg-light`}>
      <div className="container d-flex justify-content-center align-items-center">
        <p className="text-center">© {new Date().getFullYear()} Roomy Share. {t('copyRight')}.</p>
      </div>
    </footer>
  )
}
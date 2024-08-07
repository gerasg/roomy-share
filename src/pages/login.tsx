import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { jwtDecode } from 'jwt-decode';
import styles from '../styles/Login.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface DecodedToken {
  role: string;
  [key: string]: any;
}

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { locale } = router;
    const { t } = useTranslation('login');

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token) as DecodedToken;
        const role = decodedToken.role;
        if (role === 'owner') {
          router.push('/dashboard')
        } else if (role === 'tenant') {
          router.push('/user_dashboard')
        }
      }
      setIsLoading(false);
    }, [locale]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      })
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const decodedToken = jwtDecode(data.token) as DecodedToken;
        localStorage.setItem('name', decodedToken.name);
        localStorage.setItem('lastname', decodedToken.lastname);
        localStorage.setItem('contract_end_date', decodedToken.contract_end_date);
        localStorage.setItem('role', decodedToken.role);
        if (decodedToken.role === 'owner') {
          router.push('/dashboard')
        } else if (decodedToken.role === 'tenant') {
          router.push('/user_dashboard')
        }
      } else {
        setError(data.message)
      }
    }

    if(isLoading) {
      return <div className={styles['loading']}>{t('loading')}</div>
    }

    return (
      <div className={`${styles['login-page']}`}>
        {isLoading && <div className={styles['loading']}>{t('loading')}</div>}
        <div className={`container py-5 ${styles['login-container']}`}>
            <div className={styles['login-form']}>
              <h1 className="h3 mb-3 fw-normal text-center">{t('loginTitle')}</h1>
              <form onSubmit={handleSubmit}>
                <div className={`form-group ${styles['input-group']}`}>
                  <label htmlFor="emailInput" className="visually-hidden">{t('email')}</label>
                  <input type="email" id="emailInput" className={`form-control ${styles['form-input']}`} placeholder={t('emailPlaceholder')} required
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className={`form-group ${styles['input-group']}`}>
                  <label htmlFor="passwordInput" className="visually-hidden">{t('password')}</label>
                  <input type="password" id="passwordInput" className={`form-control ${styles['form-input']}`} placeholder={t('passwordPlaceholder')} required
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <button className={`btn btn-lg ${styles['login-button']}`} type="submit">{t('signIn')}</button>
              </form>
            </div>
        </div>
      </div>
    ) 
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common', 'footer', 'login']),
    },
  }
}
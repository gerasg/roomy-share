// error.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Error.module.css'; // add your own style file

export default function Error() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'owner') {
      router.push('/dashboard');
    } else if (role === 'tenant') {
      router.push('/user_dashboard');
    } else {
      router.push('/login'); // If there's no role, user is not logged in. So, redirect to login
    }
  }, []);

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>401 - Unauthorized</h1>
      <p className={styles.errorMessage}>You do not have access to this page.</p>
    </div>
  );
}
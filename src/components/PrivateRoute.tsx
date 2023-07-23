import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PrivateRoute = (Component) => {
  return () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const fetchAuthStatus = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:3001/verifyToken', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          router.push('/login');
          return;
        }

        setIsAuthenticated(true);
      }

      fetchAuthStatus();
    }, []);

    if (isAuthenticated) {
      return <Component />;
    }

    return null;
  }
}

export default PrivateRoute;
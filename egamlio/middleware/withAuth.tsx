import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      // Check if the token exists in localStorage or a cookie
      const token = localStorage.getItem('accessToken');

      // If the token is missing or invalid, redirect to the login page
      if (!token) {
        router.replace('/login');
      }
      // You can also add additional checks here, such as token expiration or validity
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
import React, { useEffect, useState } from 'react';
import { auth } from "../firebase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false);
            } else {
                console.log('Unauthorized');
                setLoading(false);
                navigate('/signin'); // Redirects to login if not authenticated
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    if (loading) return <p>Loading...</p>; // Show loading indicator while checking auth state

    return <>{children}</>; // Render children if authenticated
};

export default AuthRoute;

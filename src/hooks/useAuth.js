// Custom hook for authentication logic

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    return { logout };
};


// hooks/useAuthFetch.js
// Custom hook for API calls with automatic auth handling

import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useAuthFetch = () => {
    const navigate = useNavigate();

    const authFetch = useCallback(async (url, options = {}) => {
        const token = localStorage.getItem('token');

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        // eslint-disable-next-line no-useless-catch
        try {
            const response = await fetch(url, config);

            // Check for authentication errors
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }

            return response;
        } catch (error) {
            throw error;
        }
    }, [navigate]);

    return authFetch;
};
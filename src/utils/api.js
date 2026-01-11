// Centralized API utility with automatic token handling

export const handleApiError = (error, navigate) => {
    if (error.status === 401 || error.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('token');
        navigate('/login', {replace: true});
        return true;
    }
    return false;
};

// Custom fetch wrapper with automatic auth handling
export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            ...(token && {'Authorization': `Bearer ${token}`})
        }
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = new Error('API request failed');
        error.status = response.status;
        error.response = response;
        throw error;
    }

    return response;
};
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

// Check if error is due to expired/invalid token
export const isAuthError = (error) => {
    return error.status === 401 || error.status === 403;
};
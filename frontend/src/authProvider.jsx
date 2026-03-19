import { createContext, useState, useContext, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    // Decode JWT to get user info and role
    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    };

    // Check if user is admin
    const isAdmin = useMemo(() => {
        if (!token) return false;
        const decoded = decodeToken(token);
        return decoded?.roles?.includes('ROLE_ADMIN') || false;
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/rest/auth/login', {
                email: username,
                password: password
            });

            const { token: newToken, email } = response.data;

            // Save token
            setToken(newToken);
            localStorage.setItem('token', newToken);

            // Set default auth header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            // Decode and set user info
            const decoded = decodeToken(newToken);
            setUser({ email, roles: decoded.roles });

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    // Set auth header on initial load if token exists
    if (token && !axios.defaults.headers.common['Authorization']) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const decoded = decodeToken(token);
        if (decoded && !user) {
            setUser({ email: decoded.sub, roles: decoded.roles });
        }
    }

    const contextValue = useMemo(
        () => ({
            token,
            user,
            isAdmin,
            login,
            logout
        }),
        [token, user, isAdmin]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
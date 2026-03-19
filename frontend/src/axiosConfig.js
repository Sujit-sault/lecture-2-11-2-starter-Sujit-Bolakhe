import axios from 'axios';

// Response Interceptor to catch 401/403 errors
axios.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // Check if it's a 401 or 403 error
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Clear token from localStorage
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];

            // Redirect to login with expired parameter
            window.location.href = '/login?expired=true';
        }

        return Promise.reject(error);
    }
);

export default axios;
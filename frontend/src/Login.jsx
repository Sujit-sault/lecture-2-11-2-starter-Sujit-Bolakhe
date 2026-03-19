import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './authProvider';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const expired = searchParams.get('expired');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Login</h2>

            {expired && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    borderRadius: '4px'
                }}>
                    ⚠️ Your session has expired. Please log in again.
                </div>
            )}

            {error && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Login
                </button>
            </form>

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p>Test accounts:</p>
                <p>Admin: admin / admin</p>
                <p>User: user / user</p>
            </div>
        </div>
    );
}

export default Login;
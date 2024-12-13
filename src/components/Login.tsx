import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.scss';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>(''); // To store error message
    const [loading, setLoading] = useState<boolean>(false); // To manage loading state
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading when form is submitted

        try {
            // Fetch data from db.json
            const usersResponse = await fetch('http://localhost:3000/users');
            const users = await usersResponse.json();

            // Check if the entered email and password match any user
            const user = users.find(
                (user: { email: string, password: string }) =>
                    user.email === email && user.password === password
            );

            if (user) {
                // If user is found, redirect to dashboard
                navigate('/admin/dashboard');
            } else {
                // If user is not found, show error message
                setErrorMessage('Wrong email or password. Please try again.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
        } finally {
            setLoading(false); // Stop loading after the authentication process
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error message if any */}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {loading && (
                <div className="spinner">
                    <div className="loading-spinner"></div>
                </div>
            )}
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X } from 'lucide-react'; // Using Lucide icons
import Modal from '../Modal';
import '../Modal.css'; // Reusing Modal CSS
import '../../pages/Auth.css'; // Reusing Auth Page CSS for forms

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, isAuthLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(username, password);
            if (user) {
                onClose(); // Close modal on success
                // Navigate based on role
                if (user.roles && user.roles.includes('ROLE_ADMIN')) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Invalid credentials.');
            } else {
                setError('Login failed. Try again.');
            }
        }
    };

    return (
        <Modal title="Login" isOpen={isOpen} onClose={onClose}>
            <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: 0 }}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isAuthLoading}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className="password-input-wrapper" style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isAuthLoading}
                            style={{ width: '100%', paddingRight: '40px' }}
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" className="auth-button" disabled={isAuthLoading}>
                    {isAuthLoading ? 'Logging In...' : 'Log In'}
                </button>
            </form>

            <div className="auth-switch-link" style={{ marginTop: '1rem', textAlign: 'center' }}>
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                >
                    Register here
                </button>
            </div>
        </Modal>
    );
};

export default LoginModal;

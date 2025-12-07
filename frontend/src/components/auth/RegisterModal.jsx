import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import Modal from '../Modal';
import '../Modal.css';
import '../../pages/Auth.css';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, password);
            onClose(); // Close modal on success (automatically logs in usually, or redirects)
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError('Username taken.');
            } else {
                setError('Registration failed.');
            }
        }
    };

    return (
        <Modal title="Create Account" isOpen={isOpen} onClose={onClose}>
            <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: 0 }}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
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

                <button type="submit" className="auth-button">
                    Register
                </button>
            </form>

            <div className="auth-switch-link" style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                >
                    Log in here
                </button>
            </div>
        </Modal>
    );
};

export default RegisterModal;

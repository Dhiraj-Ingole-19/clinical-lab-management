import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { User, MapPin, Phone, Calendar, Camera } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, login } = useAuth(); // login used here to update context state if needed, though simple fetch might be enough
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: 'Male',
        address: '',
        phoneNumber: '',
        // profilePhoto: '' // UI Only
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await authApi.getCurrentUser();
                const u = res.data;
                setFormData({
                    fullName: u.fullName || '',
                    age: u.age || '',
                    gender: u.gender || 'Male',
                    address: u.address || '',
                    phoneNumber: u.phoneNumber || ''
                });
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await authApi.updateProfile({
                ...formData,
                age: parseInt(formData.age)
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Optionally update global auth context if it stores these fields
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-state">Loading profile...</div>;

    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <p>Manage your personal information</p>
            </div>

            <div className="profile-content">
                {/* Photo Section (UI Only) */}
                <div className="profile-photo-section">
                    <div className="photo-placeholder">
                        <User size={64} className="text-gray-400" />
                        <button className="photo-upload-btn">
                            <Camera size={16} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Profile Photo (Coming Soon)</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="profile-form">
                    {message.text && (
                        <div className={`alert ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="form-group">
                        <label><User size={16} /> Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label><Calendar size={16} /> Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Age"
                            />
                        </div>
                        <div className="form-group">
                            <label><User size={16} /> Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label><Phone size={16} /> Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Mobile number"
                        />
                    </div>

                    <div className="form-group">
                        <label><MapPin size={16} /> Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your full address"
                            rows="3"
                        />
                    </div>

                    <button type="submit" className="save-btn" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;

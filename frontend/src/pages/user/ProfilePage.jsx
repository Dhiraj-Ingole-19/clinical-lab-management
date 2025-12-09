import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { User, MapPin, Phone, Calendar, Camera, Edit2, Save, X } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: 'Male',
        address: '',
        phoneNumber: '',
    });
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await authApi.getCurrentUser();
                const u = res.data;
                const userData = {
                    fullName: u.fullName || '',
                    age: u.age || '',
                    gender: u.gender || 'Male',
                    address: u.address || '',
                    phoneNumber: u.phoneNumber || ''
                };
                setFormData(userData);
                setOriginalData(userData);
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

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await authApi.updateProfile({ // Use existing authApi
                ...formData,
                age: parseInt(formData.age)
            });
            setOriginalData(formData);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
                    <div className="absolute top-4 right-4 animate-in fade-in duration-300">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                            >
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                            >
                                <X size={16} /> Cancel
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <div className="w-20 h-20 rounded-full bg-white p-1">
                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <User size={40} />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{formData.fullName || 'User'}</h1>
                            <p className="text-blue-100 opacity-90">{formData.phoneNumber || 'No phone added'}</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-6 md:p-8">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                                <div className={`flex items-center border rounded-xl px-4 py-3 bg-gray-50 transition-colors ${isEditing ? 'border-blue-200 bg-white focus-within:ring-2 ring-blue-100' : 'border-gray-100'}`}>
                                    <User size={18} className="text-gray-400 mr-3" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        disabled={!isEditing}
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="bg-transparent w-full outline-none text-gray-800 disabled:text-gray-500"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                                <div className={`flex items-center border rounded-xl px-4 py-3 bg-gray-50 transition-colors ${isEditing ? 'border-blue-200 bg-white focus-within:ring-2 ring-blue-100' : 'border-gray-100'}`}>
                                    <Phone size={18} className="text-gray-400 mr-3" />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        disabled={!isEditing}
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="bg-transparent w-full outline-none text-gray-800 disabled:text-gray-500"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Age</label>
                                <div className={`flex items-center border rounded-xl px-4 py-3 bg-gray-50 transition-colors ${isEditing ? 'border-blue-200 bg-white focus-within:ring-2 ring-blue-100' : 'border-gray-100'}`}>
                                    <Calendar size={18} className="text-gray-400 mr-3" />
                                    <input
                                        type="number"
                                        name="age"
                                        disabled={!isEditing}
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="bg-transparent w-full outline-none text-gray-800 disabled:text-gray-500"
                                        placeholder="Age"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Gender</label>
                                <div className={`flex items-center border rounded-xl px-4 py-3 bg-gray-50 transition-colors ${isEditing ? 'border-blue-200 bg-white focus-within:ring-2 ring-blue-100' : 'border-gray-100'}`}>
                                    <User size={18} className="text-gray-400 mr-3" />
                                    <select
                                        name="gender"
                                        disabled={!isEditing}
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="bg-transparent w-full outline-none text-gray-800 disabled:text-gray-500 appearance-none bg-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Address</label>
                            <div className={`flex items-start border rounded-xl px-4 py-3 bg-gray-50 transition-colors ${isEditing ? 'border-blue-200 bg-white focus-within:ring-2 ring-blue-100' : 'border-gray-100'}`}>
                                <MapPin size={18} className="text-gray-400 mr-3 mt-1" />
                                <textarea
                                    name="address"
                                    disabled={!isEditing}
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your full address"
                                    rows="3"
                                    className="bg-transparent w-full outline-none text-gray-800 disabled:text-gray-500 resize-none"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="pt-4 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

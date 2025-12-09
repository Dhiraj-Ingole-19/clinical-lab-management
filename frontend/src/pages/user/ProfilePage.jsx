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

                {/* Form Section - Clean List Style */}
                <div className="px-6 py-6 pb-24 md:pb-8"> {/* Added padding-bottom for mobile sticky button */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section: Personal Info */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-1">Personal Information</h3>
                            <div className="bg-gray-50 rounded-2xl p-1 space-y-1">
                                <div className={`flex items-center p-3 rounded-xl transition-colors ${isEditing ? 'bg-white shadow-sm' : ''}`}>
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mr-4">
                                        <User size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            disabled={!isEditing}
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none text-gray-900 font-medium disabled:text-gray-600 placeholder:text-gray-300"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-1">
                                    <div className={`flex items-center p-3 rounded-xl transition-colors ${isEditing ? 'bg-white shadow-sm' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mr-4">
                                            <Calendar size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                disabled={!isEditing}
                                                value={formData.age}
                                                onChange={handleChange}
                                                className="w-full bg-transparent outline-none text-gray-900 font-medium disabled:text-gray-600 placeholder:text-gray-300"
                                                placeholder="00"
                                            />
                                        </div>
                                    </div>
                                    <div className={`flex items-center p-3 rounded-xl transition-colors ${isEditing ? 'bg-white shadow-sm' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mr-4">
                                            <User size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Gender</label>
                                            <select
                                                name="gender"
                                                disabled={!isEditing}
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full bg-transparent outline-none text-gray-900 font-medium disabled:text-gray-600 appearance-none bg-none"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Contact Details */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-1">Contact Details</h3>
                            <div className="bg-gray-50 rounded-2xl p-1 space-y-1">
                                <div className={`flex items-center p-3 rounded-xl transition-colors ${isEditing ? 'bg-white shadow-sm' : ''}`}>
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mr-4">
                                        <Phone size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            disabled={!isEditing}
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none text-gray-900 font-medium disabled:text-gray-600 placeholder:text-gray-300"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>

                                <div className={`flex items-start p-3 rounded-xl transition-colors ${isEditing ? 'bg-white shadow-sm' : ''}`}>
                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mr-4">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Address</label>
                                        <textarea
                                            name="address"
                                            disabled={!isEditing}
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Enter full address"
                                            rows="2"
                                            className="w-full bg-transparent outline-none text-gray-900 font-medium disabled:text-gray-600 placeholder:text-gray-300 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions - Sticky Bottom Bar */}
                        {isEditing && (
                            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 md:static md:bg-transparent md:border-none md:shadow-none md:p-0 md:flex md:justify-end">
                                <div className="max-w-2xl mx-auto flex gap-3 md:mx-0">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="flex-1 md:flex-none md:w-32 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-[2] md:flex-none md:w-48 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

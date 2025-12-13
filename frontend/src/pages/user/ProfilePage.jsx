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
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">

                {/* 1. Gradient Header Profile Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 pt-10 pb-10 text-white relative">
                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/30 p-1 bg-white/10 backdrop-blur-sm">
                                <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400">
                                    {/* Placeholder Avatar Image or Icon */}
                                    <User size={48} className="text-slate-300" />
                                </div>
                            </div>
                            <button className="absolute bottom-1 right-1 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors border-2 border-transparent hover:border-blue-100">
                                <Camera size={16} />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold tracking-tight mb-1">{formData.fullName || 'User Name'}</h1>
                            <p className="text-blue-100 font-medium text-lg mb-3">{formData.phoneNumber || '9876543210'}</p>

                            {/* Badges */}
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">Patient</span>
                                <span className="bg-green-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1.5 text-green-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Active
                                </span>
                            </div>
                        </div>

                        {/* Edit Button (Absolute Top Right) */}
                        <div className="absolute top-0 right-0 md:static md:self-start">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/20 shadow-lg"
                                >
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Form Section */}
                <div className="p-8">

                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                        <User className="text-blue-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-medium animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.type === 'success' ? <div className="w-2 h-2 rounded-full bg-green-500" /> : <X size={16} />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
                                <div className={`flex items-center bg-gray-50 border border-transparent rounded-xl px-4 py-3 transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50/50 ${!isEditing ? 'opacity-75' : ''}`}>
                                    <User size={18} className="text-slate-400 mr-3 shrink-0" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        disabled={!isEditing}
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full bg-transparent outline-none text-slate-900 font-semibold placeholder:text-slate-300"
                                        placeholder="Shubhangi Chopade"
                                    />
                                </div>
                            </div>

                            {/* Email Address (Read Only usually, but let's add field for UI completion if needed, or stick to logic. User logic has age/gender/phone. Let's map Email to Phone or just Phone) */}
                            {/* The design has Email, but our backend might not. Let's stick to Phone for now as per previous code, or just label it Primary Contact */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Phone Number</label>
                                <div className={`flex items-center bg-gray-50 border border-transparent rounded-xl px-4 py-3 transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50/50 ${!isEditing ? 'opacity-75' : ''}`}>
                                    <Phone size={18} className="text-slate-400 mr-3 shrink-0" />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        disabled={!isEditing}
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full bg-transparent outline-none text-slate-900 font-semibold placeholder:text-slate-300"
                                        placeholder="+91 7875409028"
                                    />
                                </div>
                            </div>

                            {/* Age */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Age</label>
                                <div className={`flex items-center bg-gray-50 border border-transparent rounded-xl px-4 py-3 transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50/50 ${!isEditing ? 'opacity-75' : ''}`}>
                                    <Calendar size={18} className="text-slate-400 mr-3 shrink-0" />
                                    <input
                                        type="number"
                                        name="age"
                                        disabled={!isEditing}
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full bg-transparent outline-none text-slate-900 font-semibold placeholder:text-slate-300"
                                        placeholder="28"
                                    />
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Gender</label>
                                <div className={`flex items-center bg-gray-50 border border-transparent rounded-xl px-4 py-3 transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50/50 ${!isEditing ? 'opacity-75' : ''}`}>
                                    <User size={18} className="text-slate-400 mr-3 shrink-0" />
                                    <select
                                        name="gender"
                                        disabled={!isEditing}
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full bg-transparent outline-none text-slate-900 font-semibold appearance-none cursor-pointer"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address - Full Width */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Address</label>
                                <div className={`flex items-start bg-gray-50 border border-transparent rounded-xl px-4 py-3 transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50/50 ${!isEditing ? 'opacity-75' : ''}`}>
                                    <MapPin size={18} className="text-slate-400 mr-3 mt-1 shrink-0" />
                                    <textarea
                                        name="address"
                                        disabled={!isEditing}
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full bg-transparent outline-none text-slate-900 font-semibold placeholder:text-slate-300 resize-none"
                                        placeholder="Enter your full address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                                >
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

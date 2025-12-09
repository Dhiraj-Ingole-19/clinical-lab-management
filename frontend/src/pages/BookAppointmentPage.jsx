import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { labApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Home, Building2, User, Users, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import './BookAppointmentPage.css';

const BookAppointmentPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get logged-in user details
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeTests, setActiveTests] = useState([]);

    // Form State
    const [bookingType, setBookingType] = useState('SELF'); // SELF or FAMILY
    const [visitType, setVisitType] = useState('LAB'); // LAB or HOME

    const [patientDetails, setPatientDetails] = useState({
        name: '',
        age: '',
        gender: 'Male',
        mobile: ''
    });

    const [selectedTests, setSelectedTests] = useState([]);
    const [collectionAddress, setCollectionAddress] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await labApi.getAllTests();
                const active = res.data.filter(t => t.active);
                setActiveTests(active);
            } catch (err) {
                console.error("Failed to load tests", err);
            }
        };
        fetchTests();
    }, []);

    // Auto-fill logic for SELF
    useEffect(() => {
        if (bookingType === 'SELF' && user) {
            setPatientDetails({
                name: user.fullName || '',
                age: user.age || '',
                gender: user.gender || 'Male',
                mobile: user.phoneNumber || ''
            });
        } else if (bookingType === 'FAMILY') {
            // Clear fields for new family entry
            setPatientDetails({ name: '', age: '', gender: 'Male', mobile: '' });
        }
    }, [bookingType, user]);

    const handlePatientChange = (e) => {
        setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });
    };

    const validateStep1 = () => {
        if (!patientDetails.name || !patientDetails.age || !patientDetails.mobile) return false;
        return true;
    };

    const toggleTest = (testId) => {
        if (selectedTests.includes(testId)) {
            setSelectedTests(selectedTests.filter(id => id !== testId));
        } else {
            setSelectedTests([...selectedTests, testId]);
        }
    };

    const calculateTotal = () => {
        let total = 0;
        selectedTests.forEach(id => {
            const test = activeTests.find(t => t.id === id);
            if (test) total += test.price;
        });
        if (visitType === 'HOME') total += 100;
        return total;
    };

    const handleSubmit = async () => {
        // Final Validation
        if (visitType === 'HOME' && !collectionAddress.trim()) {
            alert("Please enter a collection address for Home Visit.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                testIds: selectedTests,
                appointmentTime: appointmentTime || new Date().toISOString(),
                isHomeVisit: visitType === 'HOME',
                collectionAddress: visitType === 'HOME' ? collectionAddress : null,
                // Always send the actual details from patientDetails state
                patientName: patientDetails.name,
                patientAge: parseInt(patientDetails.age),
                patientGender: patientDetails.gender,
                patientMobile: patientDetails.mobile,
            };

            await labApi.bookAppointment(payload);
            alert('Appointment Booked Successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error("Booking failed", error);
            alert('Booking Failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h1>

            {/* Progress Bar */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors duration-300 ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {s}
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {step === 1 && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <User className="text-blue-600" size={20} /> Patient Details
                        </h2>

                        {/* Who is this for? */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setBookingType('SELF')}
                                className={`flex-1 py-3 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 transition-all ${bookingType === 'SELF' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-100 text-gray-600'}`}
                            >
                                <User size={18} /> For Self
                            </button>
                            <button
                                onClick={() => setBookingType('FAMILY')}
                                className={`flex-1 py-3 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 transition-all ${bookingType === 'FAMILY' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-100 text-gray-600'}`}
                            >
                                <Users size={18} /> Family Member
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={patientDetails.name}
                                    onChange={handlePatientChange}
                                    disabled={bookingType === 'SELF'} // Lock name if Self to ensure consistency? Or allow edit? Req said "Auto-fill", implies editable but usually Self is locked to profile. Let's keep it editable but auto-filled for better UX if they want to correct it.
                                    className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    placeholder="Patient Name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={patientDetails.age}
                                        onChange={handlePatientChange}
                                        className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                        placeholder="Years"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={patientDetails.gender}
                                        onChange={handlePatientChange}
                                        className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={patientDetails.mobile}
                                    onChange={handlePatientChange}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    placeholder="10-digit number"
                                />
                            </div>
                        </div>

                        <button
                            disabled={!validateStep1()}
                            onClick={() => setStep(2)}
                            className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                        >
                            Select Tests <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold mb-4">Select Lab Tests</h2>
                        <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {activeTests.map(test => (
                                <div
                                    key={test.id}
                                    onClick={() => toggleTest(test.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedTests.includes(test.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-100'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${selectedTests.includes(test.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                            {selectedTests.includes(test.id) && <CheckCircle size={14} className="text-white" />}
                                        </div>
                                        <span className={`font-medium ${selectedTests.includes(test.id) ? 'text-gray-900' : 'text-gray-600'}`}>{test.testName}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">₹{test.price}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between py-4 border-t border-gray-100 mb-4">
                            <span className="text-gray-500 font-medium">Total Estimate</span>
                            <span className="text-2xl font-bold text-gray-900">₹{calculateTotal()}</span>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all">Back</button>
                            <button
                                disabled={selectedTests.length === 0}
                                onClick={() => setStep(3)}
                                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                Review & Confirm
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold mb-6">Visit Details</h2>

                        {/* Visit Type Toggle */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => setVisitType('LAB')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${visitType === 'LAB' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                            >
                                <Building2 size={24} />
                                <span className="font-bold text-sm">Lab Visit</span>
                            </button>
                            <button
                                onClick={() => setVisitType('HOME')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${visitType === 'HOME' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                            >
                                <Home size={24} />
                                <span className="font-bold text-sm">Home Collection</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {visitType === 'HOME' && (
                                <div className="animate-in slide-in-from-top-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Collection Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        placeholder="Enter full address including landmark..."
                                        value={collectionAddress}
                                        onChange={(e) => setCollectionAddress(e.target.value)}
                                        className="w-full p-3 bg-yellow-50/50 rounded-xl border-2 border-yellow-100 focus:border-yellow-400 outline-none transition-all placeholder:text-gray-400 text-gray-700 resize-none h-24"
                                    />
                                    <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1"><CheckCircle size={10} /> +₹100 Convenience fee applied</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preferred Time</label>
                                <input
                                    type="datetime-local"
                                    value={appointmentTime}
                                    min={new Date().toISOString().slice(0, 16)}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Patient</span>
                                    <span className="font-semibold text-gray-900">{patientDetails.name}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tests ({selectedTests.length})</span>
                                    {/* Ideally calculate subtotal here */}
                                    <span className="font-semibold text-gray-900">-</span>
                                </div>
                                {visitType === 'HOME' && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Home Collection</span>
                                        <span className="font-semibold">+₹100</span>
                                    </div>
                                )}
                                <div className="pt-2 mt-2 border-t border-dashed border-gray-200 flex justify-between items-center text-lg font-bold text-gray-900">
                                    <span>Total Pay</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all">Back</button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !appointmentTime || (visitType === 'HOME' && !collectionAddress)}
                                className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                {loading ? 'Booking...' : 'Confirm Appointment'}
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-4">Payment will be collected at the time of service.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookAppointmentPage;

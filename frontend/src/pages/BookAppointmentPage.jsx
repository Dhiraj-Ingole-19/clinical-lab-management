import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { labApi } from '../services/api';
import './BookAppointmentPage.css'; // Assuming you might want to add styles later

const BookAppointmentPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeTests, setActiveTests] = useState([]);

    // Form State
    const [bookingType, setBookingType] = useState('SELF'); // SELF or FAMILY
    const [patientDetails, setPatientDetails] = useState({
        name: '',
        age: '',
        gender: 'Male',
        mobile: ''
    });
    const [selectedTests, setSelectedTests] = useState([]);
    const [isHomeVisit, setIsHomeVisit] = useState(false);
    const [collectionAddress, setCollectionAddress] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    useEffect(() => {
        // Fetch active tests for Step 2
        const fetchTests = async () => {
            try {
                const res = await labApi.getAllTests();
                // Filter active tests if the API returns all
                const active = res.data.filter(t => t.active);
                setActiveTests(active);
            } catch (err) {
                console.error("Failed to load tests", err);
            }
        };
        fetchTests();
    }, []);

    // --- Step 1: Patient Details ---
    const handlePatientChange = (e) => {
        setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });
    };

    const validateStep1 = () => {
        if (bookingType === 'FAMILY') {
            if (!patientDetails.name || !patientDetails.age || !patientDetails.mobile) return false;
        }
        return true;
    };

    // --- Step 2: Select Tests ---
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
        if (isHomeVisit) total += 100;
        return total;
    };

    // --- Submit ---
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                testIds: selectedTests,
                appointmentTime: appointmentTime || new Date().toISOString(), // Default to now if not picked
                isHomeVisit,
                collectionAddress: isHomeVisit ? collectionAddress : null,
                // If SELF, backend might use user profile, but we send these if provided
                patientName: bookingType === 'FAMILY' ? patientDetails.name : null,
                patientAge: bookingType === 'FAMILY' ? parseInt(patientDetails.age) : null,
                patientGender: bookingType === 'FAMILY' ? patientDetails.gender : null,
                patientMobile: bookingType === 'FAMILY' ? patientDetails.mobile : null,
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

    // --- Render Steps ---
    return (
        <div className="page-container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Book a Test</h1>

            {/* Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <span style={{ fontWeight: step >= 1 ? 'bold' : 'normal' }}>1. Patient</span>
                <span style={{ fontWeight: step >= 2 ? 'bold' : 'normal' }}>2. Tests</span>
                <span style={{ fontWeight: step >= 3 ? 'bold' : 'normal' }}>3. Visit & Confirm</span>
            </div>

            {step === 1 && (
                <div className="step-content">
                    <h3>Who is this for?</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <button
                            onClick={() => setBookingType('SELF')}
                            style={{ padding: '10px 20px', marginRight: '10px', background: bookingType === 'SELF' ? '#007bff' : '#eee', color: bookingType === 'SELF' ? '#fff' : '#000', border: 'none', borderRadius: '5px' }}
                        >
                            Self
                        </button>
                        <button
                            onClick={() => setBookingType('FAMILY')}
                            style={{ padding: '10px 20px', background: bookingType === 'FAMILY' ? '#007bff' : '#eee', color: bookingType === 'FAMILY' ? '#fff' : '#000', border: 'none', borderRadius: '5px' }}
                        >
                            Family Member
                        </button>
                    </div>

                    {bookingType === 'FAMILY' && (
                        <div className="family-form">
                            <input type="text" name="name" placeholder="Patient Name" value={patientDetails.name} onChange={handlePatientChange} style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }} />
                            <input type="number" name="age" placeholder="Age" value={patientDetails.age} onChange={handlePatientChange} style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }} />
                            <select name="gender" value={patientDetails.gender} onChange={handlePatientChange} style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <input type="tel" name="mobile" placeholder="Mobile Number" value={patientDetails.mobile} onChange={handlePatientChange} style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }} />
                        </div>
                    )}

                    <button
                        disabled={!validateStep1()}
                        onClick={() => setStep(2)}
                        style={{ marginTop: '1rem', padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', width: '100%' }}
                    >
                        Next: Select Tests
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="step-content">
                    <h3>Select Tests</h3>
                    <div className="test-list" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', marginBottom: '1rem' }}>
                        {activeTests.map(test => (
                            <div key={test.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedTests.includes(test.id)}
                                        onChange={() => toggleTest(test.id)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    {test.testName}
                                </label>
                                <span>₹{test.price}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Current Total: ₹{calculateTotal()}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setStep(1)} style={{ flex: 1, padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px' }}>Back</button>
                        <button
                            disabled={selectedTests.length === 0}
                            onClick={() => setStep(3)}
                            style={{ flex: 1, padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}
                        >
                            Next: Visit Details
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="step-content">
                    <h3>Visit Details</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <input
                                type="checkbox"
                                checked={isHomeVisit}
                                onChange={(e) => setIsHomeVisit(e.target.checked)}
                            />
                            Opt for Home Visit (+₹100)
                        </label>
                    </div>

                    {isHomeVisit && (
                        <textarea
                            placeholder="Enter full address for collection..."
                            value={collectionAddress}
                            onChange={(e) => setCollectionAddress(e.target.value)}
                            style={{ width: '100%', height: '80px', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <label>Preferred Date/Time</label>
                        <input
                            type="datetime-local"
                            value={appointmentTime}
                            min={new Date().toISOString().slice(0, 16)} // Disable past dates
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            style={{ display: 'block', width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
                        />
                    </div>

                    {/* Summary Section before Confirmation */}
                    <div className="summary-card" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '1rem', marginTop: '2rem' }}>
                        <h4 style={{ marginBottom: '0.5rem', textTransform: 'uppercase', color: '#666', fontSize: '0.85rem' }}>Booking Summary</h4>
                        <p><strong>Patient:</strong> {bookingType === 'SELF' ? 'Self' : patientDetails.name}</p>
                        <p><strong>Tests:</strong> {selectedTests.length} selected</p>
                        <p><strong>Total Amount:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>₹{calculateTotal()}</span></p>
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>* Payment to be collected during visit/collection.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setStep(2)} style={{ flex: 1, padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px' }}>Back</button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !appointmentTime}
                            style={{ flex: 1, padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}
                        >
                            {loading ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookAppointmentPage;

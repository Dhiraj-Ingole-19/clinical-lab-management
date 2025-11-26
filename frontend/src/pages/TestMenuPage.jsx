import React, { useEffect, useState } from 'react';
import { labApi } from '../services/api';

const TestMenuPage = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await labApi.getAllTests();
                setTests(response.data);
            } catch (error) {
                console.error("Failed to fetch tests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading Rate Card...</div>;

    return (
        <div className="page-container" style={{ padding: '2rem' }}>
            <h1>Lab Test Rate Card</h1>
            <table className="rate-card-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Test Name</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Category</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Description</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Price (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    {tests.map(test => (
                        <tr key={test.id}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{test.testName}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{test.category}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{test.description}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>₹{test.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TestMenuPage;

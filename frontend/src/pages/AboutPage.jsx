import React from 'react';

const AboutPage = () => {
    return (
        <div className="page-container" style={{ padding: '2rem' }}>
            <h1>About Chopade Clinical Lab</h1>
            <p>
                Established in 2010, Chopade Clinical Laboratory has been a trusted name in diagnostic services.
                We are committed to providing accurate and timely reports to help you make informed health decisions.
            </p>

            <h2 style={{ marginTop: '2rem' }}>Our Mission</h2>
            <p>To provide affordable and high-quality diagnostic services to every patient.</p>

            <h2 style={{ marginTop: '2rem' }}>Our Equipment</h2>
            <ul>
                <li>Fully Automated Biochemistry Analyzer</li>
                <li>3-Part Hematology Analyzer</li>
                <li>Electrolyte Analyzer</li>
                <li>Hormone Analyzer (CLIA)</li>
            </ul>
        </div>
    );
};

export default AboutPage;

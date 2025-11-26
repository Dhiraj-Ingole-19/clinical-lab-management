import React from 'react';

const ContactPage = () => {
    return (
        <div className="page-container" style={{ padding: '2rem' }}>
            <h1>Contact Us</h1>

            <div className="contact-details" style={{ marginTop: '2rem' }}>
                <h3>Address</h3>
                <p>Shop No. 4, Main Market Road, Near City Hospital, Pune - 411001</p>

                <h3>Phone</h3>
                <p>+91 98765 43210</p>
                <p>+91 020 1234 5678</p>

                <h3>Email</h3>
                <p>contact@chopadelab.com</p>
            </div>

            <div className="map-container" style={{ marginTop: '2rem' }}>
                <h3>Find Us on Google Maps</h3>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.0!2d73.8!3d18.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMwJzAwLjAiTiA3M8KwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Google Maps"
                ></iframe>
            </div>
        </div>
    );
};

export default ContactPage;

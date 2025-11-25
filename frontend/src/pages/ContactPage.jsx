import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Phone, Mail, Linkedin, MapPin } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="modern-layout">
            <Navbar />
            <div className="content-wrapper" style={{ flexDirection: 'column' }}>
                <main className="page-content" style={{ marginLeft: 0, padding: 0 }}>

                    {/* Hero Section */}
                    <section style={{
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        padding: '3rem 2rem',
                        textAlign: 'center'
                    }}>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}
                        >
                            Get in Touch
                        </motion.h1>
                        <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            We are here to help you with any questions or support you need.
                        </p>
                    </section>

                    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                        {/* Contact Details */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-panel"
                            style={{ padding: '2rem' }}
                        >
                            <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.5rem' }}>Contact Information</h2>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#e0f2fe', padding: '0.8rem', borderRadius: '50%' }}>
                                    <Phone size={24} color="var(--color-primary)" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--color-gray-dark)' }}>Phone</h4>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>+91 9834411080</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#e0f2fe', padding: '0.8rem', borderRadius: '50%' }}>
                                    <Mail size={24} color="var(--color-primary)" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--color-gray-dark)' }}>Email</h4>
                                    <a href="mailto:dhirajingole19@gmail.com" style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-primary)', textDecoration: 'none' }}>dhirajingole19@gmail.com</a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#e0f2fe', padding: '0.8rem', borderRadius: '50%' }}>
                                    <Linkedin size={24} color="var(--color-primary)" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--color-gray-dark)' }}>LinkedIn</h4>
                                    <a href="https://www.linkedin.com/in/dhiraj-ingole/" target="_blank" rel="noopener noreferrer" style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-primary)', textDecoration: 'none' }}>
                                        View Profile
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#e0f2fe', padding: '0.8rem', borderRadius: '50%' }}>
                                    <MapPin size={24} color="var(--color-primary)" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--color-gray-dark)' }}>Location</h4>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>Digital Banking HQ, India</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* QR Code Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-panel"
                            style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <h2 style={{ marginBottom: '1rem' }}>Scan to Install App</h2>
                            <p style={{ marginBottom: '1.5rem', color: 'var(--color-gray-dark)' }}>
                                Experience the best of digital banking on your mobile device. Scan the QR code below to install our PWA instantly.
                            </p>
                            <div style={{
                                background: 'white',
                                padding: '1rem',
                                borderRadius: '16px',
                                boxShadow: 'var(--shadow-md)',
                                display: 'inline-block'
                            }}>
                                <img src="/digibank_qr.png" alt="Scan to Install DigiBank" style={{ width: '200px', height: '200px' }} />
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-gray)' }}>
                                Compatible with iOS and Android
                            </p>
                        </motion.div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default ContactPage;

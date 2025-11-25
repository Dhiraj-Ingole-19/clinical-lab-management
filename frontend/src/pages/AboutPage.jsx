import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Users, Smartphone, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="modern-layout">
            <Navbar />

            <div className="content-wrapper" style={{ flexDirection: 'column' }}>
                <main className="page-content" style={{ marginLeft: 0, padding: 0 }}>

                    {/* Hero Section */}
                    <section style={{
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        padding: '4rem 2rem',
                        textAlign: 'center'
                    }}>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}
                        >
                            Revolutionizing Digital Banking
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 2rem' }}
                        >
                            The Digital Bank is a next-generation financial platform designed for speed, security, and simplicity.
                            We combine cutting-edge technology with user-centric design to provide the best online banking experience.
                        </motion.p>
                        <Link to="/register" className="btn" style={{
                            background: 'white',
                            color: 'var(--color-primary)',
                            fontWeight: 'bold',
                            padding: '1rem 2rem',
                            borderRadius: '30px'
                        }}>
                            Join the Revolution
                        </Link>
                    </section>

                    {/* Mission & Vision */}
                    <section style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Our Mission</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-gray-dark)' }}>
                            To democratize access to financial services through technology. We believe that banking should be accessible, transparent, and free from hidden fees.
                            Our Progressive Web App (PWA) ensures that you can access your funds anytime, anywhere, on any device, without the need for heavy app downloads.
                        </p>
                    </section>

                    {/* QR Code Section - SEO Boost for PWA */}
                    <section style={{ background: '#f8fafc', padding: '4rem 2rem' }}>
                        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '4rem' }}>
                            <div style={{ flex: '1 1 300px' }}>
                                <h2 style={{ marginBottom: '1.5rem' }}>Bank on the Go with our PWA</h2>
                                <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                                    <strong>No App Store Needed:</strong> Install our app directly from your browser. It's lightweight, fast, and secure.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Zap size={20} color="var(--color-warning)" /> Instant Load Times
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Smartphone size={20} color="var(--color-primary)" /> Works on iOS & Android
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Lock size={20} color="var(--color-success)" /> Biometric Security Ready
                                    </li>
                                </ul>
                            </div>
                            <div style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                boxShadow: 'var(--shadow-lg)',
                                textAlign: 'center'
                            }}>
                                <img src="/digibank_qr.png" alt="Scan QR Code to Install Digital Bank App" style={{ width: '220px', height: '220px' }} />
                                <p style={{ marginTop: '1rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Scan to Install</p>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why Choose The Digital Bank?</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            <FeatureCard
                                icon={<ShieldCheck size={40} color="var(--color-success)" />}
                                title="Bank-Grade Security"
                                description="We use 256-bit encryption and advanced fraud detection systems to keep your money safe."
                            />
                            <FeatureCard
                                icon={<Globe size={40} color="var(--color-primary)" />}
                                title="Global Accessibility"
                                description="Manage your account from any corner of the globe. Our platform is built for the modern traveler."
                            />
                            <FeatureCard
                                icon={<Users size={40} color="#ff9a9e" />}
                                title="Customer-Centric Support"
                                description="Our dedicated support team is available 24/7 via phone, email, and chat to assist you."
                            />
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-panel"
        style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}
    >
        <div style={{ marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
        <p>{description}</p>
    </motion.div>
);

export default AboutPage;

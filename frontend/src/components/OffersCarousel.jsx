import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Landmark, TrendingUp } from 'lucide-react';
import './OffersCarousel.css';

const offers = [
    {
        id: 1,
        title: 'High Yield Savings',
        description: 'Earn up to 7.5% p.a. on your savings with our new FD schemes.',
        icon: <TrendingUp size={32} />,
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 2,
        title: 'Instant Personal Loans',
        description: 'Get approved in minutes with low interest rates starting at 10%.',
        icon: <Landmark size={32} />,
        color: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)'
    },
    {
        id: 3,
        title: 'Premium Credit Cards',
        description: 'Lifetime free credit cards with exclusive airport lounge access.',
        icon: <CreditCard size={32} />,
        color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)'
    }
];

const OffersCarousel = () => {
    return (
        <div className="offers-carousel-container">
            <h2>Exclusive Offers for You</h2>
            <div className="offers-scroll-area">
                {offers.map((offer) => (
                    <motion.div
                        key={offer.id}
                        className="offer-card"
                        style={{ background: offer.color }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="offer-icon">{offer.icon}</div>
                        <h3 className="offer-title">{offer.title}</h3>
                        <p className="offer-description">{offer.description}</p>
                        <button className="btn-offer">Learn More</button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default OffersCarousel;

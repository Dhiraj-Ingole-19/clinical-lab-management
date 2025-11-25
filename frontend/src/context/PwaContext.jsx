import React, { createContext, useContext, useState, useEffect } from 'react';

const PwaContext = createContext();

export const PwaProvider = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIosDevice);
        if (isIosDevice) console.log('Device detected as iOS');

        // Capture install event (Android/Desktop)
        const handler = (e) => {
            console.log('Global PWA Context: beforeinstallprompt captured!', e);
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <PwaContext.Provider value={{ deferredPrompt, isIOS, installApp }}>
            {children}
        </PwaContext.Provider>
    );
};

export const usePwa = () => useContext(PwaContext);

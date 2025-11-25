import React, { useEffect } from 'react';
import { Download } from 'lucide-react';
import { usePwa } from '../context/PwaContext';

const InstallApp = () => {
    const { deferredPrompt, isIOS, installApp } = usePwa();

    useEffect(() => {
        console.log('InstallApp component - Prompt available:', !!deferredPrompt, 'Is iOS:', isIOS);
    }, [deferredPrompt, isIOS]);

    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return null;
    }

    // iOS Instruction
    if (isIOS) {
        return (
            <div className="glass-panel" style={{ padding: '0.75rem', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                📲 Install App: Tap <strong>Share</strong> then <strong>Add to Home Screen</strong>.
            </div>
        );
    }

    // Android / Desktop Button
    if (!deferredPrompt) {
        console.log('InstallApp: No prompt available yet');
        return null;
    }

    console.log('InstallApp: Rendering install button!');
    return (
        <button onClick={installApp} className="btn btn-success" style={{ width: '100%', marginBottom: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
            <Download size={18} /> Install DigiBank App
        </button>
    );
};

export default InstallApp;

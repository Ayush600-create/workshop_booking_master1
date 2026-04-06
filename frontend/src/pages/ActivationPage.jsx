import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaEnvelopeOpenText, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const ActivationPage = () => {
  const [status, setStatus] = useState('loading'); // loading, success, expired, verified
  const location = useLocation();

  useEffect(() => {
    // Simulated activation logic - in a real app, this would call the API with the key
    const query = new URLSearchParams(location.search);
    const key = query.get('key');
    
    if (key) {
      setTimeout(() => setStatus('success'), 1500);
    } else {
      setStatus('awaiting');
    }
  }, [location]);

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center' }}>
        {status === 'awaiting' && (
          <>
            <FaEnvelopeOpenText size={64} style={{ color: 'var(--accent)', marginBottom: '24px' }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Activation Awaiting</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              An activation link has been sent to your email. Please check your inbox and verify your account.
              The link expires in <strong>24 hours</strong>.
            </p>
            <Link to="/login" className="btn btn-primary">Back to Login</Link>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle size={64} style={{ color: 'var(--success)', marginBottom: '24px' }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Account Activated</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Your account has been successfully verified. You can now access all features.
            </p>
            <Link to="/login" className="btn btn-primary">Sign In Now</Link>
          </>
        )}

        {status === 'loading' && (
          <div>Verifying your activation key...</div>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;

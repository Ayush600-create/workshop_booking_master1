import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
      <div className="spinner" style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(99, 102, 241, 0.1)',
        borderLeftColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

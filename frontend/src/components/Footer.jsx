import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: '#f1f5f9', color: 'var(--text-muted)', padding: '40px 0', marginTop: 'auto' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Developed by FOSSEE group, IIT Bombay</p>
        <p style={{ fontSize: '0.8rem' }}>&copy; {new Date().getFullYear()} Free/Libre and Open Source Software for Education</p>
      </div>
    </footer>
  );
};

export default Footer;

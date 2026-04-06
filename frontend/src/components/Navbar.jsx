import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaPlus, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
          FOSSEE <span style={{ color: 'var(--accent)' }}>Workshops</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/types" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>Workshop Types</Link>
          
          {user ? (
            <>
              <Link to={user.is_instructor ? "/dashboard" : "/status"} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>
                <FaTachometerAlt style={{ marginRight: '6px' }} /> Dashboard
              </Link>
              {!user.is_instructor && (
                <Link to="/propose" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <FaPlus style={{ marginRight: '4px' }} /> Propose
                </Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                  <FaUserCircle size={24} />
                  <span style={{ fontSize: '0.9rem' }}>{user.full_name}</span>
                </Link>
                <button onClick={handleLogout} style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', padding: '5px' }}>
                  <FaSignOutAlt />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

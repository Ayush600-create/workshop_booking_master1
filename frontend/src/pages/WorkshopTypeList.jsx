import React, { useState, useEffect } from 'react';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBook, FaClock, FaExternalLinkAlt } from 'react-icons/fa';

const WorkshopTypeList = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get('/workshop-types/');
        setTypes(res.data.types || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Explore Workshop Types</h1>
        <p style={{ color: 'var(--text-muted)' }}>Choose from our range of specialized training programs.</p>
      </header>

      {types.length === 0 ? (
          <div className="glass-card animate-fade-in" style={{ padding: '60px', textAlign: 'center' }}>
            <FaBook size={64} style={{ color: 'var(--accent)', opacity: 0.2, marginBottom: '24px' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No workshop types available</h2>
            <p style={{ color: 'var(--text-muted)' }}>Check back later for new programs!</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 grid-cols-3">
            {types.map(type => (
              <div key={type.id} className="glass-card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>{type.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                   <FaClock /> <span>{type.duration} Day(s)</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', flex: 1 }}>{type.description}</p>
                <Link to={`/types/${type.id}`} className="btn" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', fontWeight: 600 }}>
                  View Details <FaExternalLinkAlt size={12} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default WorkshopTypeList;

import React, { useState, useEffect } from 'react';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaChalkboardTeacher, FaHistory } from 'react-icons/fa';

const DashboardCoordinator = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await api.get('/workshops/');
        setWorkshops(res.data.my_workshops || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Welcome, {user?.first_name}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your proposed workshops and track their status.</p>
      </header>

      {workshops.length === 0 ? (
        <div className="glass-card animate-fade-in" style={{ padding: '60px', textAlign: 'center' }}>
          <FaCalendarAlt size={64} style={{ color: 'var(--accent)', opacity: 0.2, marginBottom: '24px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No workshops yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Information related to your workshops will be shown here.</p>
          <Link to="/propose" className="btn btn-primary">Propose Your First Workshop</Link>
        </div>
      ) : (
        <div className="grid">
          <div className="glass-card animate-fade-in" style={{ padding: '32px', overflowX: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaHistory style={{ color: 'var(--accent)' }} /> Your Workshop Status
            </h2>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 16px' }}>Workshop Name</th>
                  <th style={{ padding: '12px 16px' }}>Instructor</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}></th>
                </tr>
              </thead>
              <tbody>
                {workshops.map(w => (
                  <tr key={w.id} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{w.workshop_type}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaChalkboardTeacher style={{ color: 'var(--accent)', opacity: 0.5 }} />
                        {w.instructor_name}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>{new Date(w.date).toLocaleDateString()}</td>
                    <td style={{ padding: '16px' }}><StatusBadge status={w.status} /></td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <Link to={`/workshops/${w.id}`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCoordinator;

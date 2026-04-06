import React, { useState, useEffect } from 'react';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaInbox, FaUsers } from 'react-icons/fa';

const DashboardInstructor = () => {
  const [data, setData] = useState({ accepted: [], proposed: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWorkshops = async () => {
    try {
      const res = await api.get('/workshops/');
      setData({ accepted: res.data.accepted || [], proposed: res.data.proposed || [] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleAccept = async (id) => {
    if (!window.confirm('Once accepted you cannot reject, you have to personally contact the Coordinator if the workshop is to be cancelled. Are you sure you want to accept the workshop?')) return;
    try {
      await api.post(`/workshops/${id}/accept/`);
      fetchWorkshops();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Welcome, {user?.first_name}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Sign up for new workshops and manage your schedule.</p>
      </header>

      <div className="grid">
        <section className="glass-card animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaInbox style={{ color: 'var(--accent)' }} /> Proposed Workshops
          </h2>
          {data.proposed.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No new proposals available.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {data.proposed.map(w => (
                <div key={w.id} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{w.workshop_type}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{w.institute} • {w.coordinator_name}</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{new Date(w.date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleAccept(w.id)} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Accept</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-card animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaCheck style={{ color: 'var(--success)' }} /> My Upcoming Workshops
          </h2>
          {data.accepted.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>You haven't accepted any workshops yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {data.accepted.map(w => (
                <div key={w.id} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{w.workshop_type}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{w.institute} • {w.coordinator_name}</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{new Date(w.date).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/workshops/${w.id}`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>Details</Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardInstructor;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import FormField from '../components/FormField';
import { FaPaperPlane, FaInfoCircle } from 'react-icons/fa';

const ProposeWorkshop = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ workshop_type: '', date: '', tnc_accepted: false });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get('/workshop-types/');
        setTypes(res.data.types.map(t => ({ value: t.id, label: t.name })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tnc_accepted) {
      setError('You must accept the terms and conditions.');
      return;
    }
    setError('');
    try {
      const res = await api.post('/workshops/propose/', formData);
      if (res.data.success) {
        navigate('/status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '40px' }}>
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent)' }}>
            <FaPaperPlane size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Propose a Workshop</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select a workshop type and a date that works for you.</p>
        </header>

        <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <FaInfoCircle style={{ color: 'var(--accent)', marginTop: '2px' }} />
          <p>Before proposing, please check about the workshop in the <strong>Workshop Types</strong> section.</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Workshop Type"
            name="workshop_type"
            type="select"
            options={types}
            value={formData.workshop_type}
            onChange={handleChange}
            required
          />
          
          <FormField
            label="Workshop Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <input 
              type="checkbox" 
              id="tnc_accepted" 
              name="tnc_accepted" 
              checked={formData.tnc_accepted}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '3px' }}
            />
            <label htmlFor="tnc_accepted" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              I accept the <a href="#" style={{ fontWeight: 600 }}>terms and conditions</a> for this workshop.
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '8px' }}
          >
            Submit Proposal
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProposeWorkshop;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import FormField from '../components/FormField';
import { FaUserPlus } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    institute: '',
    department: 'computer engineering',
    location: '',
    title: 'Mr',
    position: 'coordinator',
    state: 'IN-MH',
    how_did_you_hear_about_us: 'Google'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/register/', formData);
      if (res.data.success) {
        navigate('/activation');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0];
        setError(`Error: ${firstError}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '700px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent)' }}>
            <FaUserPlus size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the FOSSEE workshop community</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2" style={{ gap: '0 20px' }}>
          <FormField 
            label="Title" 
            name="title" 
            type="select" 
            options={[
              {value: 'Mr', label: 'Mr.'}, {value: 'Mrs', label: 'Mrs.'}, {value: 'Miss', label: 'Ms.'}, 
              {value: 'Doctor', label: 'Dr.'}, {value: 'Professor', label: 'Prof.'}
            ]} 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
          <FormField 
            label="Position" 
            name="position" 
            type="select" 
            options={[{value: 'coordinator', label: 'Coordinator'}, {value: 'instructor', label: 'Instructor'}]} 
            value={formData.position} 
            onChange={handleChange} 
            required 
          />
          
          <FormField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
          <FormField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
          <FormField label="Username" name="username" value={formData.username} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <FormField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          <FormField label="Confirm Password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} required />
          <FormField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
          <FormField label="Institute" name="institute" value={formData.institute} onChange={handleChange} required />
          <FormField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Mumbai" required />
          <FormField 
            label="State" 
            name="state" 
            type="select" 
            options={[
              {value: 'IN-MH', label: 'Maharashtra'}, {value: 'IN-DL', label: 'Delhi'}, 
              {value: 'IN-KA', label: 'Karnataka'}, {value: 'IN-TN', label: 'Tamil Nadu'}
            ]} 
            value={formData.state} 
            onChange={handleChange} 
            required 
          />
          
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

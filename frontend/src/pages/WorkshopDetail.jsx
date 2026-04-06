import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { FaCalendarAlt, FaUserTie, FaBuilding, FaComments, FaArrowLeft } from 'react-icons/fa';

const WorkshopDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/workshops/${id}/`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api.post(`/workshops/${id}/comment/`, { comment, public: true });
      setComment('');
      fetchDetail();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="container" style={{ padding: '40px' }}>Workshop not found.</div>;

  const { detail, comments } = data;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 600 }}>
        <FaArrowLeft /> Back to Dashboard
      </Link>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '32px', alignItems: 'start' }}>
        <main>
          <div className="glass-card animate-fade-in" style={{ padding: '40px', marginBottom: '32px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{detail.name}</h1>
              <StatusBadge status={detail.status} />
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem', lineHeight: '1.7' }}>
              {detail.description || 'No description provided for this workshop type.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <FaCalendarAlt style={{ color: 'var(--accent)', marginTop: '4px' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</span>
                  <span style={{ fontWeight: 600 }}>{new Date(detail.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <FaUserTie style={{ color: 'var(--accent)', marginTop: '4px' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coordinator</span>
                  <span style={{ fontWeight: 600 }}>{detail.coordinator}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <FaBuilding style={{ color: 'var(--accent)', marginTop: '4px' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Instructor</span>
                  <span style={{ fontWeight: 600 }}>{detail.instructor}</span>
                </div>
              </div>
            </div>
          </div>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaComments style={{ color: 'var(--accent)' }} /> Discussion ({comments.length})
            </h2>
            
            <form onSubmit={handlePostComment} style={{ marginBottom: '32px' }}>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts or ask a question..."
                className="input-control"
                style={{ height: '120px', resize: 'vertical', display: 'block', marginBottom: '16px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ display: 'block', marginLeft: 'auto' }}>Post Comment</button>
            </form>

            <div style={{ display: 'grid', gap: '16px' }}>
              {comments.map((c, i) => (
                <div key={i} className="animate-fade-in" style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{c.author}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(c.date).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>{c.text}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside>
          <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Actions</h3>
             <button className="btn" style={{ width: '100%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', justifyContent: 'center' }}>
               Download Materials
             </button>
             <p style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
               Materials are only available once the workshop is accepted.
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WorkshopDetail;

import React from 'react';

const StatusBadge = ({ status }) => {
  const getColors = () => {
    switch (status?.toLowerCase()) {
      case 'accepted': return { bg: '#d1fae5', text: '#065f46' };
      case 'pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'deleted': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const colors = getColors();

  return (
    <span style={{
      backgroundColor: colors.bg,
      color: colors.text,
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;

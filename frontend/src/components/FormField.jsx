import React from 'react';

const FormField = ({ label, name, type = 'text', value, onChange, placeholder, options, required }) => {
  return (
    <div className="input-group">
      <label htmlFor={name}>{label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="input-control"
          required={required}
        >
          <option value="">Select an option</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-control"
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;

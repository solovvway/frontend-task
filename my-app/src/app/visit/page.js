'use client';

import { useState } from 'react';

export default function VisitPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/navigate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    fontFamily: 'monospace',
    resize: 'vertical',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: loading ? '#ccc' : '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
  };

  const resultStyle = {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    border: '1px solid #ddd',
  };

  const errorStyle = {
    ...resultStyle,
    backgroundColor: '#fee',
    borderColor: '#fcc',
    color: '#c00',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>Visit URL</h1>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          <span>URL *</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            style={inputStyle}
          />
          <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            The bot will visit this URL with pre-configured cookies
          </small>
        </label>

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = '#0051cc';
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = '#0070f3';
          }}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>

      {error && (
        <div style={errorStyle}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={resultStyle}>
          <strong>Success!</strong>
          <pre style={{ marginTop: '1rem', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
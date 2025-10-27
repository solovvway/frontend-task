'use client';

import { config } from 'process';
import { useState, useEffect } from 'react';

export default function Home() {
  const [time, setTime] = useState('');
  const [serverType, setServerType] = useState('production server');

  useEffect(() => {
    // Set initial time only on client
    setTime(new Date().toLocaleTimeString());
    
    // Set server type from config

// const form = document.createElement('form');
// form.id = 'config';
// form.innerHTML = `<input name="debug" value="http://217.19.4.141:8000" />`;
// document.body.appendChild(form);
// const form = document.createElement('form');
// form.id = 'config';
// form.innerHTML = `<input name="debug" value="http://217.19.4.141:8000" />`;
// document.body.appendChild(form);
    // Update time every second
  const interval = setInterval(() => {
    setTime(new Date().toLocaleTimeString());

    if (window.config && window.config.debug) {
      setServerType('debug server');

      const supportcookie = document.cookie.split(';').some(c => 
        c.trim().startsWith('debug=')
      );

      if (supportcookie) {
        console.log('Config debug mode is ON');

        fetch(window.location.origin + '/api/debug', {
          credentials: 'include'
        })
          .then(response => response.json())
          .then(data => {
            // Найти существующий debug-элемент или создать новый
            let debugDiv = document.getElementById('debug-output');
            if (!debugDiv) {
              debugDiv = document.createElement('div');
              debugDiv.id = 'debug-output';
              debugDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #f0f0f0;
                border: 1px solid #ccc;
                padding: 10px;
                font-family: monospace;
                font-size: 12px;
                max-height: 80vh;
                overflow: auto;
                z-index: 10000;
              `;
              document.body.appendChild(debugDiv);
            }

            // Отобразить данные в читаемом формате
            debugDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          })
          .catch(err => {
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
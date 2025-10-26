'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import React from 'react';

function AboutPageContent() {
  React.useEffect(() => {
    try {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const sessionCookie = cookies.find(c => c.startsWith('sessionid='));
      if (sessionCookie) {
        const sessionid = sessionCookie.split('=')[1];
        localStorage.setItem('sessionid', sessionid);
        console.log('[mobile-cookie-to-header] sessionid saved to localStorage');
      } else {
        console.warn('sessionid cookie not found');
      }
    } catch (err) {
      console.error('Error processing cookie:', err);
    }
  }, []);

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: 1.6,
    padding: '1rem',
    fontFamily: 'system-ui, sans-serif',
  };

  const paragraphStyle = {
    margin: '0 0 1rem 0',
  };

  return (
    <div style={containerStyle}>
      <p style={paragraphStyle}>Welcome to our About page!</p>
      <p style={paragraphStyle}>
        We’re passionate about building secure, user-friendly web experiences. This site demonstrates modern web development practices—with a strong focus on safety, performance, and clean code.
      </p>
      <p style={paragraphStyle}>
        Feel free to explore, and always remember: never trust user input! 😊
      </p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutPageContent />
    </Suspense>
  );
}
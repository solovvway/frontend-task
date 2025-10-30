'use client';

import Link from 'next/link';

export default function Header() {
  const pages = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/posts', label: 'Posts' },
    { path: '/visit', label: 'Visit' },
  ];

  return (
    <header style={{ background: '#222', color: 'white', padding: '10px' }}>
      <nav>
        {pages.map(({ path, label }) => (
          <Link
            key={path}
            href={path}
            style={{
              margin: '0 10px',
              background: 'red',
              color: 'white',
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
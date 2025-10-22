'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { Suspense } from "react";
import React from 'react';
import { useSearchParams } from 'next/navigation';

// function Footer() {
//   const searchParams = useSearchParams();
//   const name = searchParams.get('name') || 'img';
//   const src = searchParams.get('src') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/400px-Yandex_icon.svg.png';

//   const element = React.createElement(name, { src, alt: 'powered by', className: 'inline-block h-5 w-5 ml-1' }, null);
//   console.log('createElement result:', element);

//   return (
//     <footer className="text-center text-sm text-gray-500 py-4">
//       from {element} with love
//     </footer>
//   );
// }

function Footer() {
  const [iconData, setIconData] = React.useState({
    name: 'img',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/400px-Yandex_icon.svg.png',
  });

  React.useEffect(() => {
    const handleB2BPartnerIcon = (event) => {
      const { name, src } = event.detail || {};
      setIconData({
        name: name || 'img',
        src: src || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/400px-Yandex_icon.svg.png',
      });
    };

    window.addEventListener('b2bPartnerIcon', handleB2BPartnerIcon);
    return () => window.removeEventListener('b2bPartnerIcon', handleB2BPartnerIcon);
  }, []);

  const element = React.createElement(iconData.name, {
    src: iconData.src,
    alt: 'powered by',
    className: 'inline-block h-5 w-5 ml-1',
  }, null);

  return (
    <footer className="text-center text-sm text-gray-500 py-4">
      from {element} with love
    </footer>
  );
}
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Suspense fallback={<footer>Loading...</footer>}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
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
  const handleMessage = (event) => {
    // 1. Проверяем, что event.origin соответствует нужному шаблону
    let isValidOrigin = false;
    try {
      // Извлекаем хостнейм из event.origin
      const url = new URL(event.origin);
      const hostname = url.hostname;
      
      // Проверяем, что хостнейм заканчивается на "ya.d.x.lo.d.net" 
      // (с учетом поддоменов, например: sub.ya.d.x.lo.d.net)
      const domainRegex = /\.ya.d.x.lo.d.net$/i;
      isValidOrigin = (
        hostname === 'ya.d.x.lo.d.net' || 
        domainRegex.test(hostname)
      );
    } catch (e) {
      // Блокируем сообщения с некорректным origin
      isValidOrigin = false;
    }

    // 2. Прерываем обработку, если origin не соответствует
    if (!isValidOrigin) {
      console.warn(`Blocked message from unauthorized origin: ${event.origin}`);
      return;
    }

    // 3. Обрабатываем только разрешенные сообщения
    if (event.data?.type === 'SET_B2B_PARTNER_ICON') {
      const { name, src } = event.data.payload || {};
      setIconData({
        name: name || 'img',
        src: src || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/400px-Yandex_icon.svg.png',

      });
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
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
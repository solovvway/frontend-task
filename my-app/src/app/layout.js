'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { Suspense } from "react";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
function createElementsFromJson(json) {
  if (!json) return null;

  // Рекурсивная функция для создания элемента
  const createElementRecursive = (item) => {
    if (typeof item === 'string') {
      return item; // Простой текст как children
    }

    if (!item || !item.type) {
      console.warn('Invalid JSON item:', item);
      return null; // Пропускаем некорректные элементы
    }

    // Whitelist для type, чтобы избежать XSS
    const allowedTypes = ['img', 'span', 'div', 'p']; // Добавьте 'div' и другие по необходимости
    if (!allowedTypes.includes(item.type)) {
      console.warn(`Type "${item.type}" not allowed. Skipping.`);
      return null;
    }

    // Обработка пропсов: преобразование строковых "on*" в функции
    const props = {};
    for (const [key, value] of Object.entries(item.props || {})) {
      let propKey = key;
      let propValue = value;

      if (typeof value === 'string' && key.toLowerCase().startsWith('on')) {
        // Преобразование в camelCase (React-style, e.g., "onfilterchange" → "onFilterchange")
        propKey = key.toLowerCase().replace(/^on(\w)/, (_, letter) => 'on' + letter.toUpperCase());

        // Стриппинг "javascript:" для совместимости с inline-handlers
        let code = value.trim();
        if (code.toLowerCase().startsWith('javascript:')) {
          code = code.slice(11).trim();
        }

        try {
          // Создаём функцию из строки (опасно! Только для теста)
          propValue = new Function(code);
          console.warn(`Converted "${key}" to function: ${code}`);
        } catch (error) {
          console.error(`Error converting "${key}" to function: ${code}`, error);
          continue; // Пропускаем некорректный проп, чтобы избежать ошибок рендеринга
        }
      } else {
        propValue = value;
      }

      props[propKey] = propValue;
    }

    // Обработка children с защитой от #62
    let children = null;
    if (item.children) {
      if (Array.isArray(item.children)) {
        children = item.children.map(createElementRecursive);
      } else if (typeof item.children === 'object' && item.children !== null) {
        // Если children — объект, конвертируем в строку (fallback, чтобы избежать #62)
        console.warn('Children is an object; converting to JSON string to avoid error #62.');
        children = JSON.stringify(item.children);
      } else {
        children = createElementRecursive(item.children);
      }
    }

    return React.createElement(item.type, props, children);
  };

  // Если json — массив, создаём массив элементов; иначе — одиночный
  return Array.isArray(json)
    ? json.map(createElementRecursive)
    : createElementRecursive(json);
}

function Footer() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'img';
  const src = searchParams.get('src') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/400px-Yandex_icon.svg.png';
  const childrenJsonStr = searchParams.get('childrenJson');

  let children = null;
  if (childrenJsonStr) {
    try {
      const json = JSON.parse(childrenJsonStr);
      children = createElementsFromJson(json);
    } catch (error) {
      console.error('Error parsing childrenJson:', error);
      children = null; 
    }
  }

  const props = { src, alt: 'powered by', className: 'inline-block h-5 w-5 ml-1' };
  const element = React.createElement(name, props, children);
  console.log('createElement result:', element);

  return (
    <footer className="text-center text-sm text-gray-500 py-4">
      from {element} with love
    </footer>
  );
}

// function Footer() {
//   const [iconData, setIconData] = React.useState({
//     name: 'img',
//     src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/400px-Yandex_icon.svg.png',
//   });

//   React.useEffect(() => {
//     const handleMessage = (event) => {
//       let isValidOrigin = false;
//       try {
//         const url = new URL(event.origin);
//         const hostname = url.hostname;
//         const domainRegex = /\.ya.d.x.lo.d.net$/i;
//         isValidOrigin = (
//           hostname === 'ya.d.x.lo.d.net' || 
//           domainRegex.test(hostname)
//         );
//       } catch (e) {
//         isValidOrigin = false;
//       }

//       if (!isValidOrigin) {
//         console.warn(`Blocked message from unauthorized origin: ${event.origin}`);
//         return;
//       }

//       if (event.data?.type === 'SET_B2B_PARTNER_ICON') {
//         const { name, src } = event.data.payload || {};
//         setIconData({
//           name: name || 'img',
//           src: src || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/400px-Yandex_icon.svg.png',
//         });
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   const element = React.createElement(iconData.name, {
//     src: iconData.src,
//     alt: 'powered by',
//     className: 'inline-block h-5 w-5 ml-1',
//   }, null);

//   return (
//     <footer className="text-center text-sm text-gray-500 py-4">
//       from {element} with love
//     </footer>
//   );
// }

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
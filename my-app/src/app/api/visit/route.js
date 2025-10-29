import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate that URL is same origin
    const requestOrigin = new URL(url).origin;
    const expectedOrigin = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000';
    
    if (requestOrigin !== expectedOrigin) {
      return NextResponse.json(
        { error: 'URL must be same origin' },
        { status: 400 }
      );
    }

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set cookies before navigation
    const cookies = [
      {
        name: 'sessionid',
        value: process.env.FLAG || 'test-flag',
        domain: new URL(url).hostname,
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
      },
      {
        name: 'debug',
        value: process.env.DEBUG_SECRET_VALUE || 'test-debug',
        domain: new URL(url).hostname,
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
      }
    ];

    await page.setCookie(...cookies);

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 10000
    });

    // Wait a bit for any JavaScript to execute
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Close browser
    await browser.close();

    return NextResponse.json({
      success: true,
      message: 'Puppeteer visited the URL with cookies set'
    });

  } catch (error) {
    console.error('Error visiting URL:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to visit URL' },
      { status: 500 }
    );
  }
}
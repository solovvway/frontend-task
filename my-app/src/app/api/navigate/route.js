import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { url } = body;
    const wait = 10; // Fixed wait time

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Get environment variables
    const authToken = process.env.BROBOT_SECRET;
    const debugSecretValue = process.env.DEBUG_SECRET_VALUE;
    const flagValue = process.env.FLAG;
    const cookieDomain = process.env.COOKIE_DOMAIN || parsedUrl.hostname;
    
    if (!authToken) {
      console.error('BROBOT_SECRET environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error: missing authentication token' },
        { status: 500 }
      );
    }

    // Auto-generate cookies from environment variables
    const cookies = [];
    
    // Add debug cookie if DEBUG_SECRET_VALUE is set
    if (debugSecretValue) {
      cookies.push({
        name: 'debug',
        value: debugSecretValue,
        url: url,
        domain: cookieDomain,
        expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      });
    }
    
    // Add flag cookie if FLAG is set
    if (flagValue) {
      cookies.push({
        name: 'flag',
        value: flagValue,
        url: url,
        domain: cookieDomain,
        expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      });
    }

    console.log('Auto-generated cookies:', cookies);

    // Prepare the payload for the backend API
    const payload = {
      url,
      cookies,
      wait: parseInt(wait) || 10,
    };

    // Make the request to the backend API
    const backendUrl = 'https://brobot.yactf.ru/api/navigate';
    
    console.log('Sending request to backend:', {
      url: backendUrl,
      payload: JSON.stringify(payload, null, 2),
    });

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': authToken,
      },
      body: JSON.stringify(payload),
    });

    // Get response text first to handle both JSON and non-JSON responses
    const responseText = await response.text();
    
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Backend response body:', responseText);

    // Try to parse as JSON, fallback to text
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (err) {
      responseData = { message: responseText };
    }

    // Return the backend response
    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Backend request failed',
          status: response.status,
          statusText: response.statusText,
          details: responseData,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      status: response.status,
      data: responseData,
    });

  } catch (error) {
    console.error('Error in navigate API:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
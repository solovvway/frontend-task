import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = await cookies();
  const debugCookie = cookieStore.get('debug');
  const debugSecret = process.env.DEBUG_SECRET_VALUE;
  
  if (debugCookie?.value === debugSecret) {
    const headers = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    const headersString = JSON.stringify(headers);
    const encodedHeaders = btoa(headersString);
    return NextResponse.json({ success: true, headers: encodedHeaders });
  }
  
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
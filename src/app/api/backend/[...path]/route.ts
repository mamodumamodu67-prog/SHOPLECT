import { NextRequest, NextResponse } from 'next/server';

const backend = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

type Context = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, { params }: Context) {
  if (!backend) return NextResponse.json({ message: 'Backend API is not configured' }, { status: 503 });
  const { path } = await params;
  const target = `${backend}/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
  const headers = new Headers();
  const authorization = request.headers.get('authorization');
  const contentType = request.headers.get('content-type');
  if (authorization) headers.set('authorization', authorization);
  if (contentType) headers.set('content-type', contentType);
  headers.set('accept', 'application/json');
  const response = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
  });
  const body = await response.arrayBuffer();
  return new NextResponse(body, { status: response.status, headers: { 'content-type': response.headers.get('content-type') || 'application/json' } });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

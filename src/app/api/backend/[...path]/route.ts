import { NextRequest, NextResponse } from 'next/server';

const API_BASE =
  process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxy(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const upstreamUrl = new URL(`/api/v1/${path.join('/')}`, API_BASE);
  upstreamUrl.search = req.nextUrl.search;

  const headers = new Headers();
  const accept = req.headers.get('accept');
  const contentType = req.headers.get('content-type');
  const authorization = req.headers.get('authorization');

  if (accept) headers.set('accept', accept);
  if (contentType) headers.set('content-type', contentType);
  if (authorization) headers.set('authorization', authorization);

  const hasBody = !['GET', 'HEAD'].includes(req.method);
  let upstream: Response;

  try {
    upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      cache: 'no-store',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach backend API';

    return NextResponse.json(
      {
        success: false,
        message: 'Backend API is not reachable from admin server.',
        error: message,
      },
      { status: 502 },
    );
  }

  const body = await upstream.text();
  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get('content-type');

  if (upstreamContentType) responseHeaders.set('content-type', upstreamContentType);
  responseHeaders.set('cache-control', 'no-store');

  return new NextResponse(body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

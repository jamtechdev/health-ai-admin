import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    const body = await res.json();
    return NextResponse.json({
      reachable: res.ok,
      healthy: body?.success === true,
      upstreamStatus: res.status,
      ...body,
    });
  } catch {
    return NextResponse.json(
      {
        reachable: false,
        healthy: false,
        success: false,
        message: 'API unreachable',
        version: 'v1',
        code: 503,
        data: { database: false, redis: false },
      },
    );
  }
}

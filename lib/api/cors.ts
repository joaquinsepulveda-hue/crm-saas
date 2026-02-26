import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

/** Wrap a JSON response with CORS headers */
export function apiResponse(body: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(body, {
    ...init,
    headers: { ...CORS_HEADERS, ...(init?.headers ?? {}) },
  });
}

/** Handle OPTIONS preflight for CORS */
export function handleOptions(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.delete('x-frame-options')
  response.headers.set('Content-Security-Policy', 'frame-ancestors *;')
  return response
}

export const config = {
  matcher: '/:path*',
}

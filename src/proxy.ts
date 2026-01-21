import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy.ts - Next.js 16 replacement for middleware
 * Provides secure network boundaries for API routes
 */
export default function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // M-Pesa webhook secure boundary
    if (pathname.startsWith('/api/webhooks/mpesa')) {
        // Verify M-Pesa signature/IP whitelist here
        const mpesaIp = req.headers.get('x-forwarded-for');

        // TODO: Add M-Pesa IP whitelist validation
        // const allowedIps = process.env.MPESA_ALLOWED_IPS?.split(',') || [];
        // if (!mpesaIp || !allowedIps.includes(mpesaIp)) {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        // }

        console.log('[Proxy] M-Pesa webhook request from:', mpesaIp);
    }

    // Contract API boundary - ensure wallet is connected
    if (pathname.startsWith('/api/jobs') || pathname.startsWith('/api/reputation')) {
        const walletAddress = req.headers.get('x-wallet-address');

        if (!walletAddress && req.method !== 'GET') {
            return NextResponse.json(
                { error: 'Wallet connection required' },
                { status: 401 }
            );
        }

        console.log('[Proxy] Contract API request from wallet:', walletAddress);
    }

    // IPFS upload boundary - rate limiting
    if (pathname.startsWith('/api/ipfs/upload')) {
        // TODO: Implement rate limiting
        console.log('[Proxy] IPFS upload request');
    }

    // Continue to the actual route handler
    return NextResponse.next();
}

/**
 * Matcher configuration - specify which routes this proxy applies to
 */
export const config = {
    matcher: [
        '/api/webhooks/:path*',
        '/api/jobs/:path*',
        '/api/reputation/:path*',
        '/api/ipfs/:path*',
    ],
};

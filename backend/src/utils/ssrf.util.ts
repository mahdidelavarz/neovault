import { promises as dns } from 'dns';

/**
 * Checks whether an IPv4 address falls in a private / reserved range.
 * Also handles IPv4-mapped IPv6 (::ffff:a.b.c.d).
 */
function isPrivateIp(ip: string): boolean {
    // IPv6 loopback / unspecified
    if (ip === '::1' || ip === '::' || ip === '0:0:0:0:0:0:0:1') return true;

    // Strip IPv6 brackets if present
    ip = ip.replace(/^\[|\]$/g, '');

    // IPv4-mapped IPv6  ::ffff:a.b.c.d
    const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
    if (mapped) ip = mapped[1];

    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return false;

    const [a, b] = parts;
    return (
        a === 10 ||                                   // 10.0.0.0/8
        (a === 172 && b >= 16 && b <= 31) ||          // 172.16.0.0/12
        (a === 192 && b === 168) ||                   // 192.168.0.0/16
        a === 127 ||                                  // 127.0.0.0/8  loopback
        (a === 169 && b === 254) ||                   // 169.254.0.0/16  link-local / AWS IMDS
        a === 0 ||                                    // 0.0.0.0/8
        (a === 100 && b >= 64 && b <= 127)            // 100.64.0.0/10  carrier-grade NAT
    );
}

/**
 * Synchronous guard for a hostname taken from a redirect target. DNS resolution
 * isn't possible here (redirect hooks are sync), so this blocks the obvious cases:
 * localhost and literal private / link-local IPs (e.g. the 169.254.169.254 metadata
 * endpoint). The initial hop still gets the full DNS-based check in validateRequestUrl.
 */
export function isPrivateHostname(hostname: string): boolean {
    const h = (hostname || '').toLowerCase().replace(/^\[|\]$/g, '');
    if (!h || h === 'localhost' || h === '0.0.0.0') return true;
    return isPrivateIp(h);
}

/**
 * Validates that a URL is safe to proxy.
 * Throws a descriptive Error if the URL is invalid or targets a private/internal address.
 */
export async function validateRequestUrl(rawUrl: string): Promise<void> {
    let parsed: URL;
    try {
        parsed = new URL(rawUrl);
    } catch {
        throw new Error('Invalid URL format.');
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error(
            `URL scheme "${parsed.protocol}" is not allowed. Only http and https are permitted.`
        );
    }

    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

    if (hostname === 'localhost' || hostname === '0.0.0.0') {
        throw new Error('Requests to localhost are not permitted.');
    }

    // Resolve hostname → IP and block private ranges
    let address: string;
    try {
        // Prefer IPv4; fall back to IPv6
        try {
            const r = await dns.lookup(hostname, { family: 4 });
            address = r.address;
        } catch {
            const r = await dns.lookup(hostname, { family: 6 });
            address = r.address;
        }
    } catch {
        throw new Error(`Could not resolve hostname "${hostname}".`);
    }

    if (isPrivateIp(address)) {
        throw new Error(
            'Requests to private, internal, or link-local IP addresses are not permitted.'
        );
    }
}

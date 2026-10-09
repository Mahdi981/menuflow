import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MenuFlow — Restaurant Ordering Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1C7E84 0%, #145B60 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 35,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            border: '3px solid rgba(255,255,255,0.3)',
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16 L22 26" />
              <path d="M18 16 L18 24 C18 26 20 28 22 28" />
              <path d="M26 16 L26 24 C26 26 24 28 22 28" />
              <path d="M22 28 L22 50" />
              <path d="M42 16 L42 50" />
              <path d="M42 16 C45 19 45 24 42 28" />
            </g>
            <circle cx="32" cy="42" r="3" fill="#C9A227" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-3px',
            marginBottom: 20,
            lineHeight: 1,
          }}
        >
          MenuFlow
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Your restaurant, online in minutes
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            color: 'rgba(255,255,255,0.75)',
            fontSize: 26,
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#C9A227',
            }}
          />
          menu-restaurant.store
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
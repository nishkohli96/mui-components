import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* Static social-preview card — same wordmark gradient as the homepage. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0E14'
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 700,
            backgroundImage:
              'linear-gradient(90deg, #2196F3 0%, #1AACD8 50%, #0BD1A8 100%)',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          MUI-Components
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#9CA3AF', marginTop: 16 }}>
          Form-library-independent Material UI components
        </div>
      </div>
    ),
    size
  );
}

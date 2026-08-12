import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = (searchParams.get('n') || 'HH GOA BUILDER').toUpperCase();
    const role = (searchParams.get('r') || 'FULL STACK DEVELOPER').toUpperCase();
    const stack = (searchParams.get('s') || 'REACT • NODE • AI').toUpperCase();
    const title = (searchParams.get('t') || 'THE BUILDER').toUpperCase();

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#111a15',
            padding: '40px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Header Band */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '90px',
              backgroundColor: '#f2ecdf',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 50px',
            }}
          >
            <div style={{ color: '#111a15', fontSize: '26px', fontWeight: 'bold', letterSpacing: '2px' }}>
              HH GOA 2026
            </div>
            <div
              style={{
                backgroundColor: '#c9f24b',
                color: '#111a15',
                borderRadius: '20px',
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '1px',
              }}
            >
              BUILDER IDENTITY / 001
            </div>
          </div>

          {/* Bottom Left Coral Wedge */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '320px',
              height: '220px',
              backgroundColor: '#f25c3a',
            }}
          />

          {/* Top Right Lime Circle */}
          <div
            style={{
              position: 'absolute',
              top: '120px',
              right: '50px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              backgroundColor: '#c9f24b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111a15',
              fontSize: '36px',
              fontWeight: 'bold',
            }}
          >
            HH
          </div>

          {/* Main Content Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '110px',
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            {/* Center Arch graphic */}
            <div
              style={{
                width: '160px',
                height: '180px',
                borderTopLeftRadius: '80px',
                borderTopRightRadius: '80px',
                backgroundColor: '#c9f24b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111a15',
                fontSize: '42px',
                fontWeight: 'bold',
                border: '6px solid #f25c3a',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              HH
            </div>

            {/* Builder Name */}
            <div
              style={{
                color: '#f2ecdf',
                fontSize: '48px',
                fontWeight: 'bold',
                marginTop: '20px',
                letterSpacing: '1px',
              }}
            >
              {name}
            </div>

            {/* Divider */}
            <div
              style={{
                width: '80px',
                height: '5px',
                backgroundColor: '#c9f24b',
                marginTop: '12px',
                marginBottom: '12px',
              }}
            />

            {/* Title Badge */}
            <div
              style={{
                color: '#c9f24b',
                fontSize: '26px',
                fontWeight: 'bold',
                letterSpacing: '3px',
              }}
            >
              {title}
            </div>

            {/* Role & Stack */}
            <div
              style={{
                color: 'rgba(242, 236, 223, 0.75)',
                fontSize: '18px',
                marginTop: '8px',
                letterSpacing: '1px',
              }}
            >
              {role} · {stack}
            </div>
          </div>

          {/* Footer Pill */}
          <div
            style={{
              backgroundColor: '#c9f24b',
              color: '#111a15',
              padding: '10px 32px',
              borderRadius: '30px',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '10px',
              letterSpacing: '1px',
              zIndex: 10,
            }}
          >
            #FrameInGoa
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    return new Response(`Failed to generate the OG image`, {
      status: 500,
    });
  }
}

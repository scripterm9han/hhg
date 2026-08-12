import { ImageResponse } from '@vercel/og';
import React from 'react';

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
      React.createElement(
        'div',
        {
          style: {
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
          },
        },
        // Header band
        React.createElement(
          'div',
          {
            style: {
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
            },
          },
          React.createElement('div', { style: { color: '#111a15', fontSize: '26px', fontWeight: 'bold' } }, 'HH GOA 2026'),
          React.createElement('div', { style: { backgroundColor: '#c9f24b', color: '#111a15', borderRadius: '20px', padding: '8px 20px', fontSize: '14px', fontWeight: 'bold' } }, 'BUILDER IDENTITY / 001')
        ),
        // Bottom left coral wedge
        React.createElement('div', {
          style: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '320px',
            height: '220px',
            backgroundColor: '#f25c3a',
          },
        }),
        // Top right lime circle
        React.createElement(
          'div',
          {
            style: {
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
            },
          },
          'HH'
        ),
        // Main content
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '110px',
              textAlign: 'center',
              zIndex: 10,
            },
          },
          React.createElement(
            'div',
            {
              style: {
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
              },
            },
            'HH'
          ),
          React.createElement('div', { style: { color: '#f2ecdf', fontSize: '48px', fontWeight: 'bold', marginTop: '20px' } }, name),
          React.createElement('div', { style: { width: '80px', height: '5px', backgroundColor: '#c9f24b', marginTop: '12px', marginBottom: '12px' } }),
          React.createElement('div', { style: { color: '#c9f24b', fontSize: '26px', fontWeight: 'bold', letterSpacing: '3px' } }, title),
          React.createElement('div', { style: { color: 'rgba(242, 236, 223, 0.75)', fontSize: '18px', marginTop: '8px' } }, `${role} · ${stack}`)
        ),
        // Footer pill
        React.createElement(
          'div',
          {
            style: {
              backgroundColor: '#c9f24b',
              color: '#111a15',
              padding: '10px 32px',
              borderRadius: '30px',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '10px',
              zIndex: 10,
            },
          },
          '#FrameInGoa'
        )
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate the OG image`, {
      status: 500,
    });
  }
}

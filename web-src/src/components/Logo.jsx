// Vector redesign of the wordmark (was a flat PNG with an opaque grey background
// baked in - it showed as a grey "sticker" on the navy header). This is transparent
// by construction, crisp at any size, and recolourable via `color` so the same
// mark works in navy on the light auth screens and in white on the navy header.
import React from 'react';

const Logo = ({ color = '#0B2E86', width = 220, style, className }) => (
  <svg
    viewBox="0 0 400 130"
    width={width}
    className={className}
    style={{ display: 'block', ...style }}
    role="img"
    aria-label="Aathma Bandhu"
  >
    <line x1="40" y1="58" x2="163" y2="58" stroke={color} strokeWidth="1.5" />
    <line x1="237" y1="58" x2="360" y2="58" stroke={color} strokeWidth="1.5" />
    <path
      d="M177,72 L184,49 L193,60 L200,40 L207,60 L216,49 L223,72 Z"
      fill={color}
    />
    <circle cx="184" cy="49" r="3" fill={color} />
    <circle cx="200" cy="40" r="3.5" fill={color} />
    <circle cx="216" cy="49" r="3" fill={color} />
    <text
      x="200"
      y="108"
      textAnchor="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontSize="34"
      letterSpacing="4"
      fill={color}
    >
      AATHMA BANDHU
    </text>
  </svg>
);

export default Logo;

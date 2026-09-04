import React from 'react';

interface Props {
  className?: string;
}

export const HeroIllustration: React.FC<Props> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-sm mx-auto overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-56 h-36 bg-amber-500/20 dark:bg-amber-500/15 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="w-32 h-24 bg-yellow-400/25 dark:bg-amber-400/20 rounded-full blur-2xl opacity-60" />
      </div>

      <svg
        viewBox="0 0 400 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
        aria-hidden="true"
      >
        <defs>
          {/* Volumetric Celestial Light Rays */}
          <linearGradient id="celestialRay1" x1="200" y1="0" x2="160" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="celestialRay2" x1="200" y1="0" x2="240" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="celestialCenter" x1="200" y1="0" x2="200" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </linearGradient>

          {/* Book Parchment Shading */}
          <linearGradient id="leftPageGrad" x1="80" y1="120" x2="195" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDFBF7" />
            <stop offset="65%" stopColor="#F5EDE0" />
            <stop offset="100%" stopColor="#E2D4BF" />
          </linearGradient>

          <linearGradient id="rightPageGrad" x1="320" y1="120" x2="205" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDFBF7" />
            <stop offset="65%" stopColor="#F5EDE0" />
            <stop offset="100%" stopColor="#E2D4BF" />
          </linearGradient>

          {/* Gold Leaf Edges */}
          <linearGradient id="goldEdge" x1="60" y1="180" x2="340" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Cover Spine Shadow */}
          <linearGradient id="coverBase" x1="50" y1="170" x2="350" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Volumetric Light Cone from above */}
        <polygon points="200,0 130,195 270,195" fill="url(#celestialCenter)" />
        <polygon points="195,0 90,195 180,195" fill="url(#celestialRay1)" />
        <polygon points="205,0 220,195 310,195" fill="url(#celestialRay2)" />

        {/* 2. Ambient Floating Light Orbs/Particles */}
        <circle cx="160" cy="55" r="2.5" fill="#FDE68A" opacity="0.8" />
        <circle cx="230" cy="40" r="3" fill="#FBBF24" opacity="0.9" />
        <circle cx="140" cy="95" r="2" fill="#FCD34D" opacity="0.7" />
        <circle cx="255" cy="85" r="2.5" fill="#FDE68A" opacity="0.75" />
        <circle cx="190" cy="70" r="3.5" fill="#FEF3C7" opacity="0.85" />
        <circle cx="215" cy="110" r="2" fill="#F59E0B" opacity="0.9" />

        {/* 3. Base Leather/Bound Cover Foundation */}
        <path
          d="M 68 184 C 110 186, 175 190, 200 196 C 225 190, 290 186, 332 184 C 336 184, 340 186, 340 190 C 334 198, 280 206, 200 206 C 120 206, 66 198, 60 190 C 60 186, 64 184, 68 184 Z"
          fill="url(#coverBase)"
          stroke="#78350F"
          strokeWidth="1.5"
        />

        {/* 4. Gilded Page Block Edge */}
        <path
          d="M 72 178 C 115 180, 175 184, 200 191 C 225 184, 285 180, 328 178 L 332 184 C 290 186, 225 190, 200 196 C 175 190, 110 186, 68 184 Z"
          fill="url(#goldEdge)"
          opacity="0.9"
        />

        {/* 5. Left Open Manuscript Page (Curved contour) */}
        <path
          d="M 200 187 C 175 178, 110 166, 75 160 C 72 159, 70 157, 71 154 C 75 130, 80 110, 88 95 C 120 102, 170 118, 200 132 Z"
          fill="url(#leftPageGrad)"
          stroke="#D4AF37"
          strokeWidth="1"
        />

        {/* Left Page Scripture Lines (Elegant abstract manuscript lines) */}
        <g opacity="0.35" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round">
          <line x1="95" y1="112" x2="185" y2="128" />
          <line x1="93" y1="122" x2="185" y2="137" />
          <line x1="90" y1="132" x2="185" y2="147" />
          <line x1="88" y1="142" x2="183" y2="157" />
          <line x1="85" y1="152" x2="160" y2="165" />
        </g>

        {/* Left Page Illuminated Initial Letter Emblem */}
        <rect x="92" y="103" width="14" height="14" rx="3" fill="#D97706" opacity="0.4" />
        <text x="95" y="114" fill="#78350F" fontSize="10" fontFamily="serif" fontWeight="bold">I</text>

        {/* 6. Right Open Manuscript Page (Curved contour) */}
        <path
          d="M 200 187 C 225 178, 290 166, 325 160 C 328 159, 330 157, 329 154 C 325 130, 320 110, 312 95 C 280 102, 230 118, 200 132 Z"
          fill="url(#rightPageGrad)"
          stroke="#D4AF37"
          strokeWidth="1"
        />

        {/* Right Page Scripture Lines */}
        <g opacity="0.35" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round">
          <line x1="215" y1="128" x2="305" y2="112" />
          <line x1="215" y1="137" x2="307" y2="122" />
          <line x1="215" y1="147" x2="310" y2="132" />
          <line x1="217" y1="157" x2="312" y2="142" />
          <line x1="218" y1="167" x2="285" y2="154" />
        </g>

        {/* Center Spine Crease */}
        <path
          d="M 200 132 L 200 189"
          stroke="#78350F"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Ribbon Bookmark draped across the book */}
        <path
          d="M 200 132 C 196 150, 192 180, 185 204 C 183 209, 188 213, 192 210 L 196 206 L 200 210 C 204 207, 202 202, 200 196 Z"
          fill="#B91C1C"
          stroke="#991B1B"
          strokeWidth="0.8"
        />

        {/* Sacred Aureole / Golden Radial Halo Behind Book */}
        <circle cx="200" cy="120" r="48" stroke="url(#goldEdge)" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.5" filter="url(#goldGlow)" />
      </svg>
    </div>
  );
};

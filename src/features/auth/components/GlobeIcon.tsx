export const GlobeIcon = ({ size = 64 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Globe base circle */}
      <circle cx="32" cy="32" r="22" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" fill="none" />

      {/* Latitude lines */}
      <ellipse cx="32" cy="32" rx="22" ry="8" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <ellipse cx="32" cy="32" rx="22" ry="15" stroke="white" strokeWidth="1" strokeOpacity="0.25" fill="none" />

      {/* Vertical meridian */}
      <ellipse cx="32" cy="32" rx="9" ry="22" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none" />

      {/* Horizontal axis line */}
      <line x1="10" y1="32" x2="54" y2="32" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      {/* Vertical axis line */}
      <line x1="32" y1="10" x2="32" y2="54" stroke="white" strokeWidth="1" strokeOpacity="0.3" />

      {/* Orbit ring 1 — rotates */}
      <g className="animate-spin-slow" style={{ transformOrigin: '32px 32px' }}>
        <ellipse
          cx="32" cy="32" rx="30" ry="10"
          stroke="white" strokeWidth="1.2" strokeOpacity="0.7" fill="none"
          strokeDasharray="4 2"
        />
        {/* Node on orbit 1 */}
        <circle cx="62" cy="32" r="3" fill="white" opacity="0.9" />
        <circle cx="2"  cy="32" r="2" fill="white" opacity="0.5" />
      </g>

      {/* Orbit ring 2 — rotates reverse, tilted */}
      <g className="animate-spin-reverse" style={{ transformOrigin: '32px 32px', transform: 'rotate(60deg)' }}>
        <ellipse
          cx="32" cy="32" rx="30" ry="10"
          stroke="white" strokeWidth="1.2" strokeOpacity="0.5" fill="none"
          strokeDasharray="3 3"
        />
        <circle cx="62" cy="32" r="2.5" fill="white" opacity="0.8" />
        <circle cx="2"  cy="32" r="1.8" fill="white" opacity="0.4" />
      </g>

      {/* Orbit ring 3 — medium speed */}
      <g className="animate-spin-medium" style={{ transformOrigin: '32px 32px', transform: 'rotate(-45deg)' }}>
        <ellipse
          cx="32" cy="32" rx="28" ry="9"
          stroke="white" strokeWidth="1" strokeOpacity="0.35" fill="none"
          strokeDasharray="5 3"
        />
        <circle cx="60" cy="32" r="2" fill="white" opacity="0.7" />
      </g>

      {/* Center dot */}
      <circle cx="32" cy="32" r="2.5" fill="white" opacity="0.8" />

      {/* Pulsing connection dots on globe surface */}
      <circle cx="32" cy="14" r="2" fill="white" opacity="0.7" className="animate-pulse-dot" />
      <circle cx="46" cy="24" r="1.8" fill="white" opacity="0.6" style={{ animationDelay: '0.5s' }} className="animate-pulse-dot" />
      <circle cx="20" cy="42" r="1.8" fill="white" opacity="0.6" style={{ animationDelay: '1s' }} className="animate-pulse-dot" />
      <circle cx="42" cy="44" r="1.5" fill="white" opacity="0.5" style={{ animationDelay: '1.5s' }} className="animate-pulse-dot" />

      {/* Connection lines between dots */}
      <line x1="32" y1="14" x2="46" y2="24" stroke="white" strokeWidth="0.8" strokeOpacity="0.35" />
      <line x1="46" y1="24" x2="42" y2="44" stroke="white" strokeWidth="0.8" strokeOpacity="0.35" />
      <line x1="32" y1="14" x2="20" y2="42" stroke="white" strokeWidth="0.8" strokeOpacity="0.25" />
    </svg>
  );
};

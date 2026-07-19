/**
 * Brand hero art: a student reading on a stack of books, drawn in a single
 * flat brand-green so it sits inside the cream hero panel. Decorative only.
 */
export function ReaderIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 340"
      fill="none"
      role="presentation"
      aria-hidden="true"
      className={className}
    >
      <g className="text-primary" fill="currentColor">
        {/* Stack of books */}
        <g>
          <rect x="70" y="300" width="210" height="30" rx="6" />
          <rect x="90" y="272" width="180" height="30" rx="6" opacity="0.85" />
          <rect x="110" y="244" width="150" height="30" rx="6" />
          {/* page edges */}
          <rect x="82" y="308" width="14" height="14" rx="3" fill="var(--background)" opacity="0.9" />
          <rect x="100" y="280" width="14" height="14" rx="3" fill="var(--background)" opacity="0.9" />
          <rect x="120" y="252" width="14" height="14" rx="3" fill="var(--background)" opacity="0.9" />
        </g>

        {/* Seated figure */}
        {/* leg */}
        <path d="M150 244c-6-18-4-40 8-52l40 8c6 22 2 40-6 50l-42-6z" />
        {/* torso */}
        <path d="M176 120c26-6 48 10 52 40 3 22-2 44-10 58l-58-10c-6-30-8-78 16-88z" />
        {/* arm holding book */}
        <path d="M158 175c-14 6-24 20-26 40l30 8c8-16 16-26 24-30l-28-18z" />
        {/* head */}
        <circle cx="205" cy="96" r="30" />
        {/* hair sweep */}
        <path d="M178 92c-2-24 16-40 38-38 10 1 18 7 22 16-14-8-30-6-42 4-8 6-14 12-18 18z" />
        {/* glasses */}
        <circle cx="197" cy="98" r="9" fill="none" stroke="var(--background)" strokeWidth="4" />
        <circle cx="221" cy="98" r="9" fill="none" stroke="var(--background)" strokeWidth="4" />
        <path d="M206 98h6" stroke="var(--background)" strokeWidth="4" />

        {/* open book being read */}
        <g>
          <path
            d="M92 196c22-10 44-10 66 0v58c-22-10-44-10-66 0v-58z"
            fill="var(--background)"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <path d="M125 198v54" stroke="currentColor" strokeWidth="6" />
          <path d="M104 214h14M104 226h14M137 214h14M137 226h14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        </g>
      </g>
    </svg>
  );
}

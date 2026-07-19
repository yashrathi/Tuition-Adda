/**
 * Playful mascot for the "write a review" banner: an open book with
 * sunglasses, walking and waving. Drawn in white so it reads on the green
 * banner; facial details use the banner's own color so they look cut-in.
 * Decorative only.
 */
export function WalkingBook({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 260"
      fill="none"
      role="presentation"
      aria-hidden="true"
      className={className}
    >
      {/* limbs — white, behind the book */}
      <g
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      >
        {/* legs mid-stride */}
        <path d="M108 196 L90 238" />
        <path d="M132 198 L146 240" />
        {/* arms — right one raised, waving */}
        <path d="M78 150 L56 176" />
        <path d="M168 140 L198 108" />
      </g>
      {/* shoes + hands */}
      <g fill="currentColor">
        <ellipse cx="84" cy="240" rx="15" ry="8" transform="rotate(-12 84 240)" />
        <ellipse cx="152" cy="242" rx="15" ry="8" transform="rotate(14 152 242)" />
        <circle cx="53" cy="178" r="8" />
        <circle cx="201" cy="105" r="9" />
      </g>

      {/* open book */}
      <g transform="rotate(-6 120 140)">
        {/* fanned pages peeking above the spine */}
        <path d="M120 104 L104 82 Q116 76 122 86 Z" fill="currentColor" />
        <path d="M120 104 L138 84 Q126 76 120 88 Z" fill="currentColor" />

        {/* two page panels */}
        <path
          d="M120 104 L74 108 Q58 111 58 134 L62 160 L120 170 Z"
          fill="currentColor"
        />
        <path
          d="M120 104 L166 108 Q182 111 182 134 L178 160 L120 170 Z"
          fill="currentColor"
        />

        {/* spine + page lines, in the banner color */}
        <g stroke="var(--primary)" strokeWidth="4" strokeLinecap="round">
          <path d="M120 106 L120 168" />
          <path d="M74 124 L104 122 M72 138 L104 136" opacity="0.9" />
          <path d="M136 122 L166 124 M136 136 L168 138" opacity="0.9" />
        </g>

        {/* sunglasses + smile */}
        <g fill="var(--primary)">
          <rect x="88" y="126" width="26" height="16" rx="7" />
          <rect x="126" y="126" width="26" height="16" rx="7" />
          <rect x="112" y="131" width="16" height="4" rx="2" />
        </g>
        <path
          d="M108 152 Q120 160 132 152"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

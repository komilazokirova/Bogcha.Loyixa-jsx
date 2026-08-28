export default function HeaderPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 80"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Osmon fon */}
      <rect width="800" height="80" fill="#EAF6FD" />

      {/* Bulutlar */}
      <g opacity="0.8">
        <ellipse cx="90" cy="18" rx="20" ry="11" fill="#ffffff" />
        <ellipse cx="105" cy="14" rx="15" ry="9" fill="#ffffff" />
        <ellipse cx="75" cy="14" rx="13" ry="8" fill="#ffffff" />
      </g>
      <g opacity="0.6">
        <ellipse cx="420" cy="12" rx="16" ry="9" fill="#ffffff" />
        <ellipse cx="432" cy="9" rx="12" ry="7" fill="#ffffff" />
      </g>
      <g opacity="0.7">
        <ellipse cx="680" cy="20" rx="18" ry="10" fill="#ffffff" />
        <ellipse cx="694" cy="16" rx="13" ry="8" fill="#ffffff" />
      </g>

      {/* Issiq havo shari 1 */}
      <g transform="translate(180,10)">
        <path d="M0,0 C-10,0 -14,14 0,20 C14,14 10,0 0,0 Z" fill="#FF7AA8" opacity="0.9" />
        <rect x="-3" y="19" width="6" height="4" rx="1" fill="#8B5E3C" />
        <line x1="0" y1="19" x2="0" y2="23" stroke="#8B5E3C" strokeWidth="0.6" />
      </g>

      {/* Issiq havo shari 2 */}
      <g transform="translate(600,8)">
        <path d="M0,0 C-11,0 -15,15 0,22 C15,15 11,0 0,0 Z" fill="#FDBA31" opacity="0.9" />
        <rect x="-3" y="21" width="6" height="4" rx="1" fill="#8B5E3C" />
        <line x1="0" y1="21" x2="0" y2="25" stroke="#8B5E3C" strokeWidth="0.6" />
      </g>

      {/* Sharlar (balloon) */}
      <g transform="translate(250,20)">
        <ellipse rx="4" ry="5" fill="#4FB6E8" />
        <line x1="0" y1="5" x2="0" y2="14" stroke="#999" strokeWidth="0.4" />
      </g>
      <g transform="translate(540,14)">
        <ellipse rx="4" ry="5" fill="#6FCF97" />
        <line x1="0" y1="5" x2="0" y2="14" stroke="#999" strokeWidth="0.4" />
      </g>

      {/* Yerdagi yashil chiziq */}
      <path d="M0,80 C200,68 600,68 800,80 L800,80 L0,80 Z" fill="#B7E4B0" opacity="0.5" />
    </svg>
  );
}
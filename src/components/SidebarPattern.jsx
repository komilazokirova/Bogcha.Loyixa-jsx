export default function SidebarPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 260 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Osmon fon */}
      <rect width="260" height="900" fill="#EAF6FD" />

      {/* Bulutlar - turli balandliklarda */}
      <g opacity="0.75">
        <ellipse cx="70" cy="60" rx="22" ry="12" fill="#ffffff" />
        <ellipse cx="86" cy="55" rx="16" ry="9" fill="#ffffff" />
        <ellipse cx="52" cy="55" rx="14" ry="8" fill="#ffffff" />
      </g>
      <g opacity="0.6">
        <ellipse cx="190" cy="220" rx="18" ry="10" fill="#ffffff" />
        <ellipse cx="203" cy="216" rx="13" ry="8" fill="#ffffff" />
      </g>
      <g opacity="0.7">
        <ellipse cx="60" cy="420" rx="20" ry="11" fill="#ffffff" />
        <ellipse cx="74" cy="416" rx="14" ry="8" fill="#ffffff" />
      </g>
      <g opacity="0.5">
        <ellipse cx="180" cy="600" rx="16" ry="9" fill="#ffffff" />
        <ellipse cx="192" cy="596" rx="11" ry="7" fill="#ffffff" />
      </g>

      {/* Issiq havo shari */}
      <g transform="translate(200,120)">
        <path d="M0,0 C-12,0 -16,16 0,24 C16,16 12,0 0,0 Z" fill="#FF7AA8" opacity="0.85" />
        <rect x="-3.5" y="23" width="7" height="5" rx="1" fill="#8B5E3C" />
        <line x1="0" y1="23" x2="0" y2="28" stroke="#8B5E3C" strokeWidth="0.6" />
      </g>

      {/* Ikkinchi shar */}
      <g transform="translate(50,320)">
        <path d="M0,0 C-11,0 -15,15 0,22 C15,15 11,0 0,0 Z" fill="#FDBA31" opacity="0.85" />
        <rect x="-3" y="21" width="6" height="4" rx="1" fill="#8B5E3C" />
        <line x1="0" y1="21" x2="0" y2="26" stroke="#8B5E3C" strokeWidth="0.6" />
      </g>

      {/* Kichik sharlar (balloon) */}
      <g transform="translate(130,180)">
        <ellipse rx="4" ry="5" fill="#4FB6E8" />
        <line x1="0" y1="5" x2="0" y2="14" stroke="#999" strokeWidth="0.4" />
      </g>
      <g transform="translate(90,480)">
        <ellipse rx="4" ry="5" fill="#6FCF97" />
        <line x1="0" y1="5" x2="0" y2="14" stroke="#999" strokeWidth="0.4" />
      </g>
      <g transform="translate(170,700)">
        <ellipse rx="3.5" ry="4.5" fill="#FF7AA8" />
        <line x1="0" y1="4.5" x2="0" y2="12" stroke="#999" strokeWidth="0.4" />
      </g>

      {/* Pastda yumshoq yashil o't */}
      <path d="M0,900 C80,880 180,880 260,900 L260,900 L0,900 Z" fill="#B7E4B0" opacity="0.6" />
    </svg>
  );
}
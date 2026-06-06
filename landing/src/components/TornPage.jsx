const TORN = `M0 308 L10 313 L20 307 L32 312 L44 306 L56 311
  L68 305 L80 310 L92 304 L104 310 L116 305 L128 311
  L140 305 L152 310 L164 304 L176 309 L188 303 L200 309
  L212 304 L224 310 L236 305 L248 311 L260 306 L272 311
  L280 307 L280 0 L0 0 Z`;

const TORN_SHADOW = `M0 308 L10 313 L20 307 L32 312 L44 306 L56 311
  L68 305 L80 310 L92 304 L104 310 L116 305 L128 311
  L140 305 L152 310 L164 304 L176 309 L188 303 L200 309
  L212 304 L224 310 L236 305 L248 311 L260 306 L272 311
  L280 307 L280 326 L0 326 Z`;

const F = "'Plus Jakarta Sans', sans-serif";
const INK  = "oklch(0.26 0.012 160)";
const INK2 = "oklch(0.60 0.010 160)";
const RED  = "oklch(0.52 0.19 22)";
const LINE = "oklch(0.90 0.005 130)";

export function TornPage() {
  return (
    <div style={{
      transform: "rotate(-2.5deg)",
      filter: "drop-shadow(0 28px 52px oklch(0.24 0.012 160 / 0.22))",
      display: "inline-block",
    }}>
      <svg width="284" height="330" viewBox="0 0 284 330" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="torn-clip"><path d={TORN} /></clipPath>
        </defs>

        <g clipPath="url(#torn-clip)">
          {/* Page */}
          <rect width="284" height="340" fill="oklch(0.982 0.009 88)" />

          {/* Spiral strip */}
          <rect x="0" y="0" width="30" height="340" fill="oklch(0.93 0.011 88)" />
          <line x1="30" y1="0" x2="30" y2="340" stroke="oklch(0.84 0.012 88)" strokeWidth="1" />

          {/* Spiral holes */}
          {[32, 68, 104, 140, 176, 212, 248, 284].map((y) => (
            <g key={y}>
              <circle cx="15" cy={y} r="8.5" fill="oklch(0.975 0.006 95)" stroke="oklch(0.80 0.012 88)" strokeWidth="1.5" />
              <circle cx="15" cy={y} r="2.8" fill="oklch(0.86 0.010 88)" />
            </g>
          ))}

          {/* Header bar */}
          <rect x="30" y="0" width="254" height="44" fill="oklch(0.31 0.086 158)" />
          <text x="157" y="26" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily={F} letterSpacing="0.10em">REKOD HAFAZAN</text>
          <text x="157" y="38" textAnchor="middle" fill="oklch(0.76 0.042 158)" fontSize="8.5" fontFamily={F}>Darjah 4 Ulum • Jun 2024</text>

          {/* Column headers */}
          <rect x="30" y="44" width="254" height="20" fill="oklch(0.945 0.009 88)" />
          <text x="42"  y="58" fill={INK2} fontSize="7.5" fontWeight="700" fontFamily={F} letterSpacing="0.07em">NAMA PELAJAR</text>
          <text x="168" y="58" fill={INK2} fontSize="7.5" fontWeight="700" fontFamily={F} letterSpacing="0.07em">M/S</text>
          <text x="204" y="58" fill={INK2} fontSize="7.5" fontWeight="700" fontFamily={F} letterSpacing="0.07em">GRED</text>
          <line x1="30" y1="64" x2="284" y2="64" stroke="oklch(0.83 0.008 130)" strokeWidth="0.8" />

          {/* Row 1 — normal */}
          <text x="42"  y="79" fill={INK} fontSize="9.5" fontFamily={F}>Ahmad Syafiq</text>
          <text x="168" y="79" fill={INK} fontSize="9.5" fontFamily={F}>212</text>
          <text x="204" y="79" fill={INK} fontSize="9.5" fontFamily={F}>Mumtaz</text>
          <line x1="30" y1="85" x2="284" y2="85" stroke={LINE} strokeWidth="0.5" />

          {/* Row 2 — crossed out, hilang */}
          <text x="42"  y="99" fill={INK2} fontSize="9.5" fontFamily={F}>Nurul Izzah bt. Ahmad</text>
          <text x="168" y="99" fill={INK2} fontSize="9.5" fontFamily={F}>???</text>
          <text x="204" y="99" fill={INK2} fontSize="9.5" fontFamily={F}>—</text>
          <line x1="34" y1="96" x2="278" y2="96" stroke={RED} strokeWidth="1.6" />
          <text x="208" y="108" fill={RED} fontSize="8" fontFamily={F} fontStyle="italic">hilang?</text>
          <line x1="30" y1="105" x2="284" y2="105" stroke={LINE} strokeWidth="0.5" />

          {/* Row 3 — correction */}
          <text x="42"  y="119" fill={INK} fontSize="9.5" fontFamily={F}>Muhammad Irfan</text>
          <text x="168" y="119" fill={RED}  fontSize="9.5" fontFamily={F}>167</text>
          <line x1="166" y1="116" x2="182" y2="116" stroke={RED} strokeWidth="1.2" />
          <text x="184" y="119" fill={INK} fontSize="9.5" fontFamily={F}>168</text>
          <text x="204" y="119" fill={INK} fontSize="9.5" fontFamily={F}>Jayyid</text>
          <line x1="30" y1="125" x2="284" y2="125" stroke={LINE} strokeWidth="0.5" />

          {/* Row 4 */}
          <text x="42"  y="139" fill={INK} fontSize="9.5" fontFamily={F}>Siti Hajar Aminah</text>
          <text x="168" y="139" fill={INK} fontSize="9.5" fontFamily={F}>189</text>
          <text x="204" y="139" fill={INK} fontSize="9.5" fontFamily={F}>Mumtaz</text>
          <line x1="30" y1="145" x2="284" y2="145" stroke={LINE} strokeWidth="0.5" />

          {/* Row 5 */}
          <text x="42"  y="159" fill={INK} fontSize="9.5" fontFamily={F}>Hafiz Abdul Rahman</text>
          <text x="168" y="159" fill={INK} fontSize="9.5" fontFamily={F}>245</text>
          <text x="204" y="159" fill={INK} fontSize="9.5" fontFamily={F}>Jayyid</text>
          <line x1="30" y1="165" x2="284" y2="165" stroke={LINE} strokeWidth="0.5" />

          {/* Row 6 — incomplete */}
          <text x="42"  y="179" fill={INK} fontSize="9.5" fontFamily={F}>Aisyah Zahra bt...</text>
          <text x="168" y="179" fill={INK2} fontSize="9.5" fontFamily={F}>—</text>
          <line x1="30" y1="185" x2="284" y2="185" stroke={LINE} strokeWidth="0.5" />

          {/* Row 7 — blank */}
          <line x1="30" y1="205" x2="284" y2="205" stroke={LINE} strokeWidth="0.5" />

          {/* Row 8 — blank */}
          <line x1="30" y1="225" x2="284" y2="225" stroke={LINE} strokeWidth="0.5" />

          {/* Row 9 — trailing off */}
          <text x="42"  y="241" fill={INK2} fontSize="9.5" fontFamily={F}>Zulaikha...</text>
          <line x1="30" y1="245" x2="284" y2="245" stroke={LINE} strokeWidth="0.5" />

          {/* Row 10 — blank */}
          <line x1="30" y1="265" x2="284" y2="265" stroke={LINE} strokeWidth="0.5" />

          {/* Coffee stain */}
          <ellipse cx="234" cy="192" rx="33" ry="27" fill="oklch(0.68 0.062 55)" opacity="0.14" />
          <ellipse cx="234" cy="192" rx="33" ry="27" fill="none" stroke="oklch(0.60 0.065 55)" strokeWidth="2.5" opacity="0.09" />
          <ellipse cx="236" cy="190" rx="14" ry="12" fill="oklch(0.982 0.009 88)" opacity="0.82" />

          {/* Bottom note */}
          <text x="42" y="286" fill={RED} fontSize="8.5" fontFamily={F} fontStyle="italic">* rekod bulan lepas mana??</text>
          <text x="42" y="299" fill={RED} fontSize="8.5" fontFamily={F} fontStyle="italic">  buku lama dah basah kena hujan</text>
        </g>

        {/* Torn shadow below */}
        <path d={TORN_SHADOW} fill="oklch(0.22 0.012 160)" opacity="0.06" />
      </svg>
    </div>
  );
}

/* oklch values match the app's --st-*-ink tokens from index.css */
const STATUS_COLORS = {
  syahadah: 'oklch(0.55 0.150 22)',
  hafazan:  'oklch(0.50 0.110 152)',
  talaqqi:  'oklch(0.52 0.130 300)',
  murajaah: 'oklch(0.58 0.130 55)',
  belum:    'oklch(0.88 0.006 130)',
};

/* fill (soft) for legend dots */
const LEGEND_COLORS = {
  syahadah: 'oklch(0.91 0.050 18)',
  hafazan:  'oklch(0.90 0.055 152)',
  talaqqi:  'oklch(0.91 0.050 300)',
  murajaah: 'oklch(0.92 0.060 62)',
  belum:    'oklch(0.93 0.004 150)',
};

const LABELS = {
  syahadah: 'Syahadah',
  hafazan:  'Hafazan',
  talaqqi:  'Talaqqi',
  murajaah: 'Murajaah',
  belum:    'Belum',
};

function demoStatus(page) {
  if (page <= 200) return 'syahadah';
  if (page <= 280) return 'hafazan';
  if (page <= 320) return 'talaqqi';
  if (page <= 370) return 'murajaah';
  return 'belum';
}

const COLS = 30;
const SIZE = 7;
const GAP  = 2;
const CELL = SIZE + GAP;

export function MushafGrid() {
  const rects = [];
  for (let i = 0; i < 604; i++) {
    const col    = i % COLS;
    const row    = Math.floor(i / COLS);
    const status = demoStatus(i + 1);
    rects.push(
      <rect
        key={i}
        x={col * CELL}
        y={row * CELL}
        width={SIZE}
        height={SIZE}
        fill={STATUS_COLORS[status]}
        rx={1.5}
      />
    );
  }

  const rows = Math.ceil(604 / COLS);
  const svgW = COLS * CELL - GAP;
  const svgH = rows * CELL - GAP;

  return (
    <div className="mushaf-wrap">
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        aria-label="Visualisasi grid hafazan 604 muka surat mushaf Madani"
      >
        {rects}
      </svg>
      <div className="mushaf-legend">
        {Object.keys(STATUS_COLORS).map((key) => (
          <span key={key} className="legend-item">
            <span className="legend-dot" style={{ background: LEGEND_COLORS[key] }} />
            {LABELS[key]}
          </span>
        ))}
      </div>
    </div>
  );
}

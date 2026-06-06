const STATUS_COLORS = {
  syahadah: '#f59e0b',
  hafazan:  '#059669',
  talaqqi:  '#3b82f6',
  murajaah: '#d97706',
  belum:    '#e5e7eb',
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
        {Object.entries(STATUS_COLORS).map(([key, color]) => (
          <span key={key} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            {LABELS[key]}
          </span>
        ))}
      </div>
    </div>
  );
}

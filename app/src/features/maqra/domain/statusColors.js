export const STATUS = [
  { key: "belum",    label: "Belum Mula",       css: "belum" },
  { key: "hafazan",  label: "Hafazan",          css: "hafazan" },
  { key: "bacaan",   label: "Bacaan",           css: "bacaan" },
  { key: "talaqqi",  label: "Talaqqi / Semakan", css: "talaqqi" },
  { key: "murajaah", label: "Murajaah",         css: "murajaah" },
  { key: "syahadah", label: "Syahadah",         css: "syahadah" },
  { key: "iqra",     label: "Iqra'",            css: "iqra" },
  { key: "tilawah",  label: "Tilawah",          css: "tilawah" }
];

export const STATUS_MAP = Object.fromEntries(STATUS.map((s) => [s.key, s]));

export const GRED = [
  { key: "Mumtaz",        css: "mumtaz" },
  { key: "Jayyid Jiddan", css: "jayyidj" },
  { key: "Jayyid",        css: "jayyid" },
  { key: "Sederhana",     css: "sederhana" },
  { key: "Maqbul",        css: "maqbul" }
];

export const GRED_MAP = Object.fromEntries(GRED.map((g) => [g.key, g]));


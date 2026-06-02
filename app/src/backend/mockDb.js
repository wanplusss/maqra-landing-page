// Deterministic RNG for seed data
function rng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Map page to juzuk
const JUZ_START = [1,22,42,62,82,102,121,142,162,182,202,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];
function juzukOf(page) {
  let j = 1;
  for (let i = 0; i < 30; i++) if (page >= JUZ_START[i]) j = i + 1;
  return j;
}

const SURAH = [
  [1,"Al-Fatihah"],[2,"Al-Baqarah"],[50,"Ali 'Imran"],[77,"An-Nisa'"],[106,"Al-Ma'idah"],
  [128,"Al-An'am"],[151,"Al-A'raf"],[177,"Al-Anfal"],[187,"At-Taubah"],[208,"Yunus"],
  [221,"Hud"],[235,"Yusuf"],[249,"Ar-Ra'd"],[255,"Ibrahim"],[262,"Al-Hijr"],
  [267,"An-Nahl"],[282,"Al-Isra'"],[293,"Al-Kahfi"],[305,"Maryam"],[312,"Ta-Ha"],
  [322,"Al-Anbiya'"],[332,"Al-Hajj"],[342,"Al-Mu'minun"],[350,"An-Nur"],[359,"Al-Furqan"],
  [367,"Asy-Syu'ara'"],[377,"An-Naml"],[385,"Al-Qasas"],[396,"Al-'Ankabut"],[404,"Ar-Rum"],
  [411,"Luqman"],[415,"As-Sajdah"],[418,"Al-Ahzab"],[428,"Saba'"],[434,"Fatir"],
  [440,"Ya-Sin"],[446,"As-Saffat"],[453,"Sad"],[458,"Az-Zumar"],[467,"Ghafir"],
  [477,"Fussilat"],[483,"Asy-Syura"],[489,"Az-Zukhruf"],[496,"Ad-Dukhan"],[499,"Al-Jathiyah"],
  [502,"Al-Ahqaf"],[507,"Muhammad"],[511,"Al-Fath"],[515,"Al-Hujurat"],[518,"Qaf"],
  [520,"Az-Zariyat"],[523,"At-Tur"],[526,"An-Najm"],[528,"Al-Qamar"],[531,"Ar-Rahman"],
  [534,"Al-Waqi'ah"],[537,"Al-Hadid"],[542,"Al-Mujadalah"],[545,"Al-Hasyr"],[549,"Al-Mumtahanah"],
  [551,"As-Saff"],[553,"Al-Jumu'ah"],[554,"Al-Munafiqun"],[556,"At-Taghabun"],[558,"At-Talaq"],
  [560,"At-Tahrim"],[562,"Al-Mulk"],[564,"Al-Qalam"],[566,"Al-Haqqah"],[568,"Al-Ma'arij"],
  [570,"Nuh"],[572,"Al-Jinn"],[574,"Al-Muzzammil"],[575,"Al-Muddaththir"],[577,"Al-Qiyamah"],
  [578,"Al-Insan"],[580,"Al-Mursalat"],[582,"An-Naba'"],[583,"An-Nazi'at"],[585,"'Abasa"],
  [586,"At-Takwir"],[587,"Al-Infitar"],[587,"Al-Mutaffifin"],[589,"Al-Insyiqaq"],[590,"Al-Buruj"],
  [591,"At-Tariq"],[591,"Al-A'la"],[592,"Al-Ghasyiyah"],[593,"Al-Fajr"],[594,"Al-Balad"],
  [595,"Asy-Syams"],[595,"Al-Lail"],[596,"Ad-Duha"],[596,"Asy-Syarh"],[597,"At-Tin"],
  [597,"Al-'Alaq"],[598,"Al-Qadr"],[598,"Al-Bayyinah"],[599,"Az-Zalzalah"],[599,"Al-'Adiyat"],
  [600,"Al-Qari'ah"],[600,"At-Takathur"],[601,"Al-'Asr"],[601,"Al-Humazah"],[601,"Al-Fil"],
  [602,"Quraisy"],[602,"Al-Ma'un"],[602,"Al-Kauthar"],[603,"Al-Kafirun"],[603,"An-Nasr"],
  [603,"Al-Masad"],[604,"Al-Ikhlas"],[604,"Al-Falaq"],[604,"An-Nas"]
];
function surahOf(page) {
  let name = "Al-Fatihah";
  for (let i = 0; i < SURAH.length; i++) if (page >= SURAH[i][0]) name = SURAH[i][1];
  return name;
}

// Build progress map
function buildStatus(frontier, seed, beginner) {
  const map = {};
  const r = rng(seed);
  for (let p = 1; p <= 604; p++) {
    if (p > frontier + 9) { map[p] = "belum"; continue; }
    if (p > frontier)     { map[p] = "bacaan"; continue; }
    const x = r();
    if (beginner && p > frontier - 6) { map[p] = x < 0.5 ? "iqra" : "tilawah"; continue; }
    if (x < 0.07)      map[p] = "syahadah";
    else if (x < 0.20) map[p] = "talaqqi";
    else if (x < 0.40) map[p] = "murajaah";
    else               map[p] = "hafazan";
  }
  return map;
}

const KATEGORI = ["Nazirah", "Saba'", "Sabqi", "Manzil", "Talaqqi", "Murajaah AM", "Syahadah", "Iqra'", "Tilawah"];
const GRED = ["Mumtaz", "Jayyid Jiddan", "Jayyid", "Sederhana", "Maqbul"];
const ULASAN = [
  "Bacaan lancar, tajwid baik.", "Ingatan kuat, teruskan usaha.", "Hafazan bertambah baik.",
  "Sebutan makhraj semakin jelas.", "Tanda waqaf dipatuhi dengan baik.", "Yakin dan tenang ketika tasmik.",
  "Murajaah dilakukan dengan konsisten.", "Mad dibaca dengan kadar yang betul."
];
const MASALAH = [
  "Ada kesilapan pada mim mati.", "Perlu perbaiki makhraj huruf 'ain.", "Tertinggal beberapa ayat di tengah.",
  "Dengung idgham kurang sempurna.", "Tergesa-gesa pada ayat panjang.", "—"
];
const CADANGAN = [
  "Banyakkan murajaah waktu pagi.", "Fokus pada hukum nun mati.", "Ulang muka surat ini 3 kali sehari.",
  "Dengar bacaan qari sebagai rujukan.", "Tasmik semula minggu depan.", "Teruskan kadar semasa."
];

function buildHistory(studentId, frontier, seed) {
  const r = rng(seed * 7 + 13);
  const out = [];
  let page = frontier;
  const today = new Date(2026, 4, 30);
  let day = 0;
  for (let i = 0; i < 8; i++) {
    const span = 3 + Math.floor(r() * 6);
    const from = Math.max(1, page - span);
    day += 1 + Math.floor(r() * 3);
    const d = new Date(today);
    d.setDate(d.getDate() - day - i);
    out.push({
      id: "h" + seed + "_" + i,
      studentId,
      date: d.toISOString(),
      kategori: KATEGORI[Math.floor(r() * KATEGORI.length)],
      gred: GRED[Math.floor(r() * GRED.length)],
      from, 
      to: page,
      juzuk: juzukOf(page),
      surah: surahOf(page),
      ulasan: ULASAN[Math.floor(r() * ULASAN.length)],
      masalah: MASALAH[Math.floor(r() * MASALAH.length)],
      cadangan: CADANGAN[Math.floor(r() * CADANGAN.length)],
      guru: ["Ustazah Aisyah Binti Hamzah", "Ustaz Hakim Bin Rashid", "Ustazah Mariam Binti Idris"][Math.floor(r() * 3)]
    });
    page = from;
  }
  return out;
}

const RAW_STUDENTS = [
  { id: "STU00123", name: "Muhammad Danish Bin Ahmad", kelas: "Tahun 4", umur: 10, frontier: 336, sex: "m", parent: "012-345 6789" },
  { id: "STU00124", name: "Nurul Aisyah Binti Razak",  kelas: "Tahun 5", umur: 11, frontier: 451, sex: "f", parent: "013-882 1140" },
  { id: "STU00131", name: "Ahmad Haikal Bin Yusof",    kelas: "Tahun 3", umur: 9,  frontier: 188, sex: "m", parent: "019-220 7763" },
  { id: "STU00140", name: "Siti Khadijah Binti Omar",  kelas: "Tahun 6", umur: 12, frontier: 545, sex: "f", parent: "017-661 9028" },
  { id: "STU00152", name: "Muhammad Irfan Bin Salleh", kelas: "Tahun 2", umur: 8,  frontier: 84,  sex: "m", parent: "011-2098 4471", beginner: true },
  { id: "STU00160", name: "Aina Sofea Binti Kamal",    kelas: "Tahun 4", umur: 10, frontier: 268, sex: "f", parent: "014-339 5512" }
];

export function getMockDb() {
  const data = localStorage.getItem("maqra_db");
  if (data) {
    return JSON.parse(data);
  }

  // Generate seed data
  const tasmik_records = [];
  const students = RAW_STUDENTS.map((s, i) => {
    const status = buildStatus(s.frontier, 1000 + i * 97, s.beginner);
    const yr = parseInt(s.kelas.replace(/\D/g, "")) || 3;
    const target = s.beginner ? 8 : yr <= 3 ? 12 : yr <= 5 ? 15 : 18;
    
    // Add history records
    const history = buildHistory(s.id, s.frontier, 1000 + i * 97);
    tasmik_records.push(...history);

    return {
      id: s.id,
      name: s.name,
      kelas: s.kelas,
      umur: s.umur,
      frontier: s.frontier,
      sex: s.sex,
      parent: s.parent,
      beginner: !!s.beginner,
      enroll: ["2024-01-08", "2023-09-02", "2024-01-08", "2022-06-15", "2025-01-13", "2024-01-08"][i],
      target,
      statusMap: status,
      school_slug: "al-furqan",
    };
  });

  const school = {
    slug: "al-furqan",
    name: "Maahad Tahfiz Al-Furqan",
    address: "No. 12, Jalan Seri Kenangan, 43000 Kajang, Selangor",
    description: "Maahad Tahfiz Al-Furqan menyediakan program hafazan Al-Quran 30 juzuk dengan pendekatan talaqqi dan musyafahah. Kami komited membentuk generasi huffaz yang berakhlak mulia dan cemerlang dalam akademik.",
    phone: "03-8765 4321",
    email: "admin@alfurqan.edu.my",
    founded: 2016,
    qrCode: "" // Empty by default, can be custom uploaded
  };

  const teachers = [
    { id: "t1", name: "Ustazah Aisyah Binti Hamzah", email: "aisyah@alfurqan.edu.my", kelas: "Tahun 4 & 5", password: "password123", school_slug: "al-furqan" },
    { id: "t2", name: "Ustaz Hakim Bin Rashid",      email: "hakim@alfurqan.edu.my",  kelas: "Tahun 2 & 3", password: "password123", school_slug: "al-furqan" },
    { id: "t3", name: "Ustazah Mariam Binti Idris",   email: "mariam@alfurqan.edu.my", kelas: "Tahun 6",     password: "password123", school_slug: "al-furqan" }
  ];

  const admin = {
    email: "admin@alfurqan.edu.my",
    password: "admin123",
    name: "Pengurus Pentadbiran"
  };

  const superadmin = {
    email: "owner@maqra.app",
    password: "owner123",
    name: "Pemilik Platform"
  };

  const schools = [
    { slug: "al-furqan", name: "Maahad Tahfiz Al-Furqan", city: "Kajang, Selangor", students: students.length, teachers: teachers.length, avgProg: 42.1, plan: "Premium", status: "aktif", since: "2024-01" },
    { slug: "darul-huffaz", name: "Maahad Darul Huffaz", city: "Kuala Terengganu", students: 84, teachers: 7, avgProg: 61.4, plan: "Premium", status: "aktif", since: "2023-08" },
    { slug: "nurul-iman", name: "Tahfiz Nurul Iman", city: "Shah Alam, Selangor", students: 46, teachers: 4, avgProg: 48.2, plan: "Asas", status: "aktif", since: "2024-05" },
    { slug: "as-sakinah", name: "Maahad As-Sakinah", city: "Kota Bharu, Kelantan", students: 122, teachers: 11, avgProg: 67.9, plan: "Premium", status: "aktif", since: "2022-11" },
    { slug: "al-hidayah", name: "Pusat Tahfiz Al-Hidayah", city: "Ipoh, Perak", students: 31, teachers: 3, avgProg: 35.6, plan: "Percubaan", status: "percubaan", since: "2026-04" },
    { slug: "baitul-quran", name: "Baitul Quran Cemerlang", city: "Johor Bahru, Johor", students: 68, teachers: 6, avgProg: 54.1, plan: "Asas", status: "aktif", since: "2023-02" },
    { slug: "al-amin", name: "Tahfiz Al-Amin", city: "Kuantan, Pahang", students: 19, teachers: 2, avgProg: 22.8, plan: "Percubaan", status: "tidak aktif", since: "2025-09" }
  ];

  const announcements = [
    { id: "a1", date: "2026-05-28", tag: "Peperiksaan", title: "Tasmik Pertengahan Tahun Bermula 9 Jun", body: "Sesi tasmik penilaian pertengahan tahun akan berlangsung dari 9 hingga 20 Jun. Pelajar dinasihatkan memperbanyakkan murajaah juzuk lepas.", school_slug: "al-furqan" },
    { id: "a2", date: "2026-05-15", tag: "Majlis", title: "Majlis Khatam & Penyampaian Sijil", body: "Majlis khatam tahunan akan diadakan pada 5 Julai 2026, jam 9 pagi di dewan utama maahad. Kehadiran ibu bapa amat dialu-alukan.", school_slug: "al-furqan" },
    { id: "a3", date: "2026-04-30", tag: "Cuti", title: "Cuti Pertengahan Penggal", body: "Maahad akan bercuti dari 24 Mei hingga 1 Jun. Kelas tahfiz disambung semula pada 2 Jun 2026.", school_slug: "al-furqan" }
  ];

  const db = {
    students,
    school,
    teachers,
    admin,
    superadmin,
    schools,
    tasmik_records,
    announcements,
    student_targets: {}
  };

  saveMockDb(db);
  return db;
}

export function saveMockDb(db) {
  localStorage.setItem("maqra_db", JSON.stringify(db));
}

// Yearly prices in RM. MRR = yearly / 12.
export const PLANS = {
  Percubaan: {
    label: "Percubaan",
    yearlyRM: 0,
    mrrRM: 0,
    studentLimit: 30,
    trialDays: 60,
    features: {
      tasmik: true,
      pengumuman: false,
      laporanPDF: false,
      analitikPenuh: false,
      sijilPDF: false,
      exportData: false,
    },
  },
  Asas: {
    label: "Asas",
    yearlyRM: 480,
    mrrRM: 40,
    studentLimit: 150,
    trialDays: null,
    features: {
      tasmik: true,
      pengumuman: true,
      laporanPDF: true,
      analitikPenuh: false,
      sijilPDF: false,
      exportData: false,
    },
  },
  Premium: {
    label: "Premium",
    yearlyRM: 960,
    mrrRM: 80,
    studentLimit: Infinity,
    trialDays: null,
    features: {
      tasmik: true,
      pengumuman: true,
      laporanPDF: true,
      analitikPenuh: true,
      sijilPDF: true,
      exportData: true,
    },
  },
};

export const PLAN_OPTIONS = Object.keys(PLANS);
export const STATUS_OPTIONS = ["aktif", "percubaan", "tidak aktif"];

/** Total MRR across a list of school objects (each with a .plan field) */
export function calcMRR(schools) {
  return schools.reduce((sum, s) => sum + (PLANS[s.plan]?.mrrRM ?? 0), 0);
}

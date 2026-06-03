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

/**
 * Returns true if the given plan includes the feature.
 * @param {string} plan - "Percubaan" | "Asas" | "Premium"
 * @param {string} feature - key from PLANS[x].features
 */
export function hasFeature(plan, feature) {
  return PLANS[plan]?.features?.[feature] ?? false;
}

/**
 * Check whether a school is allowed to log in.
 * Handles old "YYYY-MM" since format gracefully (treats as 1st of month).
 * @param {{ status: string, plan: string, since: string }} school
 * @returns {{ allowed: boolean, type: 'suspended'|'trial_expired'|null, message: string|null }}
 */
export function checkSchoolAccess(school) {
  if (school.status === "tidak aktif") {
    return {
      allowed: false,
      type: "suspended",
      message: "Sekolah ini telah digantung. Sila hubungi kami untuk bantuan.",
    };
  }

  if (school.plan === "Percubaan" && school.since) {
    // Normalise "2026-06" → "2026-06-01" so Date can parse it
    const normalised = school.since.length === 7 ? school.since + "-01" : school.since;
    const start = new Date(normalised);
    if (!isNaN(start.getTime())) {
      const trialDays = PLANS.Percubaan.trialDays ?? 60;
      const expiry = new Date(start.getTime() + trialDays * 86400000);
      if (Date.now() > expiry.getTime()) {
        return {
          allowed: false,
          type: "trial_expired",
          message: `Tempoh percubaan ${trialDays} hari telah tamat. Sila naik taraf untuk meneruskan.`,
        };
      }
    }
  }

  return { allowed: true, type: null, message: null };
}

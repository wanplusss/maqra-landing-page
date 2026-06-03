// jsQR is CJS — import defensively
import jsQRModule from "jsqr";
const jsQR = typeof jsQRModule === "function" ? jsQRModule : jsQRModule.default;

// EMV QR tag parser — returns Map<tagId, value>
function parseEMV(payload) {
  const tags = new Map();
  let i = 0;
  while (i + 4 <= payload.length) {
    const id = payload.slice(i, i + 2);
    const len = parseInt(payload.slice(i + 2, i + 4), 10);
    if (isNaN(len) || len < 0) break;
    const val = payload.slice(i + 4, i + 4 + len);
    tags.set(id, val);
    i += 4 + len;
  }
  return tags;
}

// DuitNow signatures — PayNet Malaysia EMV merchant account info (tags 26-51)
// Covers all known bank encodings: Maybank, CIMB, RHB, HLB, Public Bank, etc.
const DUITNOW_SIGNATURES = [
  "A000000615",   // PayNet Malaysia root AID
  "A0000006150301",
  "A000000615030101",
  "duitnow",
  "com.duitnow",
  "paynet",
  "MY.DuitNow",
  "MY.Maybank",
  "MY.CIMB",
  "MY.RHB",
  "MY.HLB",
  "0014A000",
];

function isDuitNow(tags, rawPayload) {
  // EMV QRCPS requires tag 00 = "01"
  if (tags.get("00") !== "01") {
    // Lenient: if raw payload looks like EMV and has PayNet, accept anyway
    const raw = rawPayload.toUpperCase();
    return DUITNOW_SIGNATURES.some(sig => raw.toUpperCase().includes(sig.toUpperCase()));
  }

  // Check merchant account info tags (26–51)
  for (const [id, val] of tags) {
    const numId = parseInt(id, 10);
    if (numId >= 26 && numId <= 51) {
      const upper = val.toUpperCase();
      if (DUITNOW_SIGNATURES.some(sig => upper.includes(sig.toUpperCase()))) {
        return true;
      }
    }
  }

  // Final fallback: raw scan
  const raw = rawPayload.toUpperCase();
  return DUITNOW_SIGNATURES.some(sig => raw.includes(sig.toUpperCase()));
}

// Try to decode QR from canvas imageData, returns payload string or null
function tryDecode(imageData) {
  // Try normal orientation first
  let result = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "attemptBoth", // handles both dark-on-light and light-on-dark
  });
  return result ? result.data : null;
}

// AID prefix → bank name map (PayNet Malaysia registered BICs)
const AID_BANK_MAP = {
  "A00000061503010101": "Maybank",
  "A00000061503010102": "CIMB Bank",
  "A00000061503010103": "Public Bank",
  "A00000061503010104": "RHB Bank",
  "A00000061503010105": "Hong Leong Bank",
  "A00000061503010106": "AmBank",
  "A00000061503010107": "Bank Islam",
  "A00000061503010108": "Bank Muamalat",
  "A00000061503010109": "Affin Bank",
  "A00000061503010110": "Alliance Bank",
  "A00000061503010111": "OCBC Bank",
  "A00000061503010112": "Standard Chartered",
  "A00000061503010113": "HSBC Bank",
  "A00000061503010114": "Citibank",
  "A00000061503010115": "Bank Rakyat",
  "A00000061503010116": "BSN",
  "A00000061503010117": "Agrobank",
  "A00000061503010118": "Bank Simpanan Nasional",
};

// Extract sub-tags from a merchant account info value string
function parseSubTags(val) {
  const sub = new Map();
  let i = 0;
  while (i + 4 <= val.length) {
    const id = val.slice(i, i + 2);
    const len = parseInt(val.slice(i + 2, i + 4), 10);
    if (isNaN(len) || len < 0) break;
    sub.set(id, val.slice(i + 4, i + 4 + len));
    i += 4 + len;
  }
  return sub;
}

// Parse recipient name, proxy value, bank from EMV tags
export function parseDuitNowDetails(tags, rawPayload) {
  const details = { recipientName: null, proxyValue: null, proxyType: null, bankName: null };

  // Tag 59 = Merchant Name
  if (tags.has("59")) details.recipientName = tags.get("59").trim();

  // Search merchant account info tags 26–51 for PayNet sub-tags
  for (const [id, val] of tags) {
    const numId = parseInt(id, 10);
    if (numId < 26 || numId > 51) continue;
    const sub = parseSubTags(val);

    // Sub-tag 00 = AID, 01 = proxy type, 02 = proxy value
    if (sub.has("01")) details.proxyType = sub.get("01").trim();
    if (sub.has("02")) details.proxyValue = sub.get("02").trim();

    // Try to match AID to bank
    if (!details.bankName && sub.has("00")) {
      const aid = sub.get("00").toUpperCase();
      for (const [prefix, bank] of Object.entries(AID_BANK_MAP)) {
        if (aid.startsWith(prefix.toUpperCase())) { details.bankName = bank; break; }
      }
    }
  }

  return details;
}

// Decode QR from uploaded File → { payload, isDuitNow, error }
export async function decodeQRFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");

        // Target at least 800px on the short side for reliable jsQR detection
        const minPx = 800;
        const shortSide = Math.min(img.width, img.height);
        const scale = shortSide < minPx ? Math.ceil(minPx / shortSide) : 1;

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let payload = tryDecode(imageData);

        // If still null, try greyscale-boosted pass (helps low-contrast screenshots)
        if (!payload) {
          const d = imageData.data;
          for (let i = 0; i < d.length; i += 4) {
            const grey = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
            d[i] = d[i + 1] = d[i + 2] = grey > 128 ? 255 : 0; // binarise
          }
          payload = tryDecode(imageData);
        }

        if (!payload) {
          resolve({
            payload: null, isDuitNow: false, details: null,
            error: "Tiada QR ditemui dalam imej. Pastikan kod QR jelas, tidak kabur, dan seluruh QR kelihatan dalam imej.",
          });
          return;
        }

        const tags = parseEMV(payload);
        const isDN = isDuitNow(tags, payload);

        if (!isDN) {
          resolve({
            payload, isDuitNow: false, details: null,
            error: `QR ditemui tetapi tandatangan DuitNow tidak dapat disahkan. Kandungan: "${payload.slice(0, 60)}..." — cuba muat naik semula atau gunakan imej asal dari bank.`,
          });
          return;
        }

        resolve({ payload, isDuitNow: true, error: null, details: parseDuitNowDetails(tags, payload) });
      };
      img.onerror = () =>
        resolve({ payload: null, isDuitNow: false, error: "Gagal membaca imej. Cuba format PNG atau JPG." });
      img.src = e.target.result;
    };
    reader.onerror = () =>
      resolve({ payload: null, isDuitNow: false, error: "Gagal membaca fail." });
    reader.readAsDataURL(file);
  });
}

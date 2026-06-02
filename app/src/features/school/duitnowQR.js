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

// DuitNow signatures found in merchant account info tags (26-51)
// PayNet Malaysia app ID: A000000615
// Some banks encode as "A0000006150301" or "A000000615030101"
const DUITNOW_SIGNATURES = [
  "A000000615",   // PayNet Malaysia (all DuitNow)
  "duitnow",
  "com.duitnow",
  "paynet",
  "0014A000",     // sub-tag 00, len 14, starting with A000 (covers all variants)
];

function isDuitNow(tags, rawPayload) {
  // Must be EMV QRCPS (tag 00 = "01")
  if (tags.get("00") !== "01") return false;

  // Check all merchant account info tags (26–51) for DuitNow signatures
  for (const [id, val] of tags) {
    const numId = parseInt(id, 10);
    if (numId >= 26 && numId <= 51) {
      const upper = val.toUpperCase();
      if (DUITNOW_SIGNATURES.some(sig => upper.includes(sig.toUpperCase()))) {
        return true;
      }
    }
  }

  // Fallback: scan raw payload for PayNet ID (handles unusual tag arrangements)
  const raw = rawPayload.toUpperCase();
  return DUITNOW_SIGNATURES.some(sig => raw.includes(sig.toUpperCase()));
}

// Decode QR from uploaded File → { payload, isDuitNow, error }
export async function decodeQRFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Upscale small images for better jsQR detection
        const scale = img.width < 400 ? Math.ceil(400 / img.width) : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (!result) {
          resolve({
            payload: null,
            isDuitNow: false,
            error: "Tiada QR ditemui dalam imej. Pastikan kod QR jelas, tidak kabur, dan seluruh QR kelihatan dalam imej.",
          });
          return;
        }
        const payload = result.data;
        const tags = parseEMV(payload);
        if (!isDuitNow(tags, payload)) {
          resolve({
            payload,
            isDuitNow: false,
            // Show first 40 chars of payload to help debug
            error: `QR bukan format DuitNow. Kandungan: "${payload.slice(0, 60)}..."`,
          });
          return;
        }
        resolve({ payload, isDuitNow: true, error: null });
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

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
            payload: null,
            isDuitNow: false,
            error: "Tiada QR ditemui dalam imej. Pastikan kod QR jelas, tidak kabur, dan seluruh QR kelihatan dalam imej.",
          });
          return;
        }

        const tags = parseEMV(payload);
        const isDN = isDuitNow(tags, payload);

        if (!isDN) {
          // Accept it anyway but warn — admin knows their own QR
          resolve({
            payload,
            isDuitNow: false,
            error: `QR ditemui tetapi tandatangan DuitNow tidak dapat disahkan. Kandungan: "${payload.slice(0, 60)}..." — cuba muat naik semula atau gunakan imej asal dari bank.`,
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

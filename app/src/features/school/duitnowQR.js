import jsQR from "jsqr";

// EMV QR tag parser — returns Map<tagId, value>
function parseEMV(payload) {
  const tags = new Map();
  let i = 0;
  while (i + 4 <= payload.length) {
    const id = payload.slice(i, i + 2);
    const len = parseInt(payload.slice(i + 2, i + 4), 10);
    if (isNaN(len)) break;
    const val = payload.slice(i + 4, i + 4 + len);
    tags.set(id, val);
    i += 4 + len;
  }
  return tags;
}

// DuitNow merchant IDs live in tag 26 or 29 sub-tag "01"
// Malaysia DuitNow payload indicator: tag 00 = "01" (EMV standard),
// and the merchant account info (tag 26-51) contains a DuitNow GUID or phone/IC/BRN.
const DUITNOW_INDICATORS = [
  "com.duitnow",
  "A000000615",      // DuitNow app ID prefix
  "duitnow",
];

function isDuitNow(tags) {
  // Tag 00 must be "01" (EMV QRCPS spec)
  if (tags.get("00") !== "01") return false;
  // Search merchant account info tags 26-51 for DuitNow signatures
  for (const [id, val] of tags) {
    const numId = parseInt(id, 10);
    if (numId >= 26 && numId <= 51) {
      const lower = val.toLowerCase();
      if (DUITNOW_INDICATORS.some(ind => lower.includes(ind.toLowerCase()))) {
        return true;
      }
    }
  }
  return false;
}

// Decode QR from uploaded File → returns { payload, isDuitNow, error }
export async function decodeQRFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);
        const result = jsQR(data, width, height);
        if (!result) {
          resolve({ payload: null, isDuitNow: false, error: "Tiada QR ditemui dalam imej. Pastikan kod QR jelas dan tidak kabur." });
          return;
        }
        const payload = result.data;
        const tags = parseEMV(payload);
        const valid = isDuitNow(tags);
        if (!valid) {
          resolve({ payload, isDuitNow: false, error: "QR bukan format DuitNow. Sila guna kod QR DuitNow bank anda sahaja." });
          return;
        }
        resolve({ payload, isDuitNow: true, error: null });
      };
      img.onerror = () => resolve({ payload: null, isDuitNow: false, error: "Gagal membaca imej. Cuba format PNG atau JPG." });
      img.src = e.target.result;
    };
    reader.onerror = () => resolve({ payload: null, isDuitNow: false, error: "Gagal membaca fail." });
    reader.readAsDataURL(file);
  });
}
